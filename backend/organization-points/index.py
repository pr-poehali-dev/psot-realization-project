import json
import os
import psycopg2
from typing import Dict, Any

def get_db_connection():
    """Создает подключение к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для управления баллами предприятий
    GET /?org_id=X - получить баланс баллов предприятия
    POST / - начислить/списать баллы
    GET /?org_id=X&history=true - история операций с баллами
    PUT / - включить/выключить систему баллов для предприятия
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            org_id = params.get('org_id')
            history = params.get('history', 'false').lower() == 'true'
            
            if not org_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'org_id обязателен'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            if history:
                cur.execute("""
                    SELECT id, points_amount, operation_type, description, created_at
                    FROM t_p80499285_psot_realization_pro.points_history
                    WHERE organization_id = %s
                    ORDER BY created_at DESC
                    LIMIT 100
                """, (org_id,))
                
                history_records = []
                for row in cur.fetchall():
                    history_records.append({
                        'id': row[0],
                        'points_amount': float(row[1]),
                        'operation_type': row[2],
                        'description': row[3],
                        'created_at': row[4].isoformat() if row[4] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(history_records, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            else:
                cur.execute("""
                    SELECT id, points_balance, total_earned, total_spent, is_enabled, created_at, updated_at
                    FROM t_p80499285_psot_realization_pro.organization_points
                    WHERE organization_id = %s
                """, (org_id,))
                
                row = cur.fetchone()
                
                if not row:
                    cur.execute("""
                        INSERT INTO t_p80499285_psot_realization_pro.organization_points
                        (organization_id, points_balance, total_earned, total_spent, is_enabled)
                        VALUES (%s, 0, 0, 0, false)
                        RETURNING id, points_balance, total_earned, total_spent, is_enabled, created_at, updated_at
                    """, (org_id,))
                    
                    row = cur.fetchone()
                    conn.commit()
                
                points_data = {
                    'id': row[0],
                    'points_balance': float(row[1]) if row[1] else 0,
                    'total_earned': float(row[2]) if row[2] else 0,
                    'total_spent': float(row[3]) if row[3] else 0,
                    'is_enabled': row[4],
                    'created_at': row[5].isoformat() if row[5] else None,
                    'updated_at': row[6].isoformat() if row[6] else None
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(points_data, ensure_ascii=False),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            org_id = body.get('org_id')
            points_amount = body.get('points_amount', 0)
            operation_type = body.get('operation_type', 'manual')
            description = body.get('description', '')
            
            if not org_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'org_id обязателен'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                SELECT id, points_balance, total_earned, total_spent 
                FROM t_p80499285_psot_realization_pro.organization_points
                WHERE organization_id = %s
            """, (org_id,))
            
            row = cur.fetchone()
            
            if not row:
                cur.execute("""
                    INSERT INTO t_p80499285_psot_realization_pro.organization_points
                    (organization_id, points_balance, total_earned, total_spent, is_enabled)
                    VALUES (%s, 0, 0, 0, true)
                    RETURNING id, points_balance, total_earned, total_spent
                """, (org_id,))
                row = cur.fetchone()
            
            current_balance = float(row[1]) if row[1] else 0
            total_earned = float(row[2]) if row[2] else 0
            total_spent = float(row[3]) if row[3] else 0
            
            new_balance = current_balance + points_amount
            
            if new_balance < 0:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Недостаточно баллов'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            if points_amount > 0:
                total_earned += points_amount
            else:
                total_spent += abs(points_amount)
            
            cur.execute("""
                UPDATE t_p80499285_psot_realization_pro.organization_points
                SET points_balance = %s, 
                    total_earned = %s,
                    total_spent = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE organization_id = %s
            """, (new_balance, total_earned, total_spent, org_id))
            
            cur.execute("""
                INSERT INTO t_p80499285_psot_realization_pro.points_history
                (organization_id, points_amount, operation_type, description)
                VALUES (%s, %s, %s, %s)
            """, (org_id, points_amount, operation_type, description))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': 'Баллы обновлены',
                    'new_balance': new_balance
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            org_id = body.get('org_id')
            is_enabled = body.get('is_enabled')
            
            if not org_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'org_id обязателен'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                INSERT INTO t_p80499285_psot_realization_pro.organization_points
                (organization_id, is_enabled, points_balance, total_earned, total_spent)
                VALUES (%s, %s, 0, 0, 0)
                ON CONFLICT (organization_id) 
                DO UPDATE SET is_enabled = EXCLUDED.is_enabled, updated_at = CURRENT_TIMESTAMP
            """, (org_id, is_enabled))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Настройки баллов обновлены'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}, ensure_ascii=False),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
