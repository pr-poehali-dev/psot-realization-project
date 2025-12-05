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
    API для управления тарифными планами
    GET / - список всех тарифов
    GET /?id=X - получить один тариф с компонентами
    POST / - создать новый тариф
    PUT / - обновить существующий тариф
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
            plan_id = params.get('id')
            
            if plan_id:
                cur.execute("""
                    SELECT id, name, description, base_price, is_active, 
                           is_points_enabled, points_value, price, trial_days, 
                           max_users, features, created_at
                    FROM t_p80499285_psot_realization_pro.subscription_plans 
                    WHERE id = %s
                """, (plan_id,))
                
                row = cur.fetchone()
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'План не найден'}),
                        'isBase64Encoded': False
                    }
                
                plan = {
                    'id': row[0],
                    'name': row[1],
                    'description': row[2],
                    'base_price': float(row[3]) if row[3] else 0,
                    'is_active': row[4],
                    'is_points_enabled': row[5],
                    'points_value': float(row[6]) if row[6] else 0,
                    'price': float(row[7]) if row[7] else 0,
                    'trial_days': row[8],
                    'max_users': row[9],
                    'features': row[10],
                    'created_at': row[11].isoformat() if row[11] else None
                }
                
                cur.execute("""
                    SELECT id, component_type, component_name, price, is_included
                    FROM t_p80499285_psot_realization_pro.plan_components
                    WHERE plan_id = %s
                    ORDER BY component_type, component_name
                """, (plan_id,))
                
                components = []
                for comp_row in cur.fetchall():
                    components.append({
                        'id': comp_row[0],
                        'component_type': comp_row[1],
                        'component_name': comp_row[2],
                        'price': float(comp_row[3]) if comp_row[3] else 0,
                        'is_included': comp_row[4]
                    })
                
                plan['components'] = components
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(plan, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            else:
                cur.execute("""
                    SELECT id, name, description, base_price, is_active, 
                           is_points_enabled, points_value, price, trial_days, 
                           max_users, features, created_at
                    FROM t_p80499285_psot_realization_pro.subscription_plans 
                    ORDER BY created_at DESC
                """)
                
                plans = []
                for row in cur.fetchall():
                    cur.execute("""
                        SELECT COUNT(*), COALESCE(SUM(price), 0)
                        FROM t_p80499285_psot_realization_pro.plan_components
                        WHERE plan_id = %s AND is_included = true
                    """, (row[0],))
                    
                    comp_stats = cur.fetchone()
                    
                    plans.append({
                        'id': row[0],
                        'name': row[1],
                        'description': row[2],
                        'base_price': float(row[3]) if row[3] else 0,
                        'is_active': row[4],
                        'is_points_enabled': row[5],
                        'points_value': float(row[6]) if row[6] else 0,
                        'price': float(row[7]) if row[7] else 0,
                        'trial_days': row[8],
                        'max_users': row[9],
                        'features': row[10],
                        'created_at': row[11].isoformat() if row[11] else None,
                        'component_count': comp_stats[0],
                        'components_total': float(comp_stats[1]) if comp_stats[1] else 0
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(plans, ensure_ascii=False),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            name = body.get('name')
            description = body.get('description', '')
            base_price = body.get('base_price', 0)
            is_points_enabled = body.get('is_points_enabled', False)
            points_value = body.get('points_value', 0)
            
            cur.execute("""
                INSERT INTO t_p80499285_psot_realization_pro.subscription_plans 
                (name, description, base_price, is_points_enabled, points_value, is_active, price, trial_days, max_users)
                VALUES (%s, %s, %s, %s, %s, true, %s, 30, 100)
                RETURNING id
            """, (name, description, base_price, is_points_enabled, points_value, base_price))
            
            plan_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': plan_id, 'message': 'Тариф создан'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            plan_id = body.get('id')
            
            if not plan_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID тарифа обязателен'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            name = body.get('name')
            description = body.get('description')
            base_price = body.get('base_price')
            is_active = body.get('is_active')
            is_points_enabled = body.get('is_points_enabled')
            points_value = body.get('points_value')
            
            cur.execute("""
                UPDATE t_p80499285_psot_realization_pro.subscription_plans 
                SET name = COALESCE(%s, name),
                    description = COALESCE(%s, description),
                    base_price = COALESCE(%s, base_price),
                    is_active = COALESCE(%s, is_active),
                    is_points_enabled = COALESCE(%s, is_points_enabled),
                    points_value = COALESCE(%s, points_value),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (name, description, base_price, is_active, is_points_enabled, points_value, plan_id))
            
            components = body.get('components', [])
            if components:
                cur.execute("""
                    UPDATE t_p80499285_psot_realization_pro.plan_components
                    SET is_included = false
                    WHERE plan_id = %s
                """, (plan_id,))
                
                for comp in components:
                    cur.execute("""
                        SELECT id FROM t_p80499285_psot_realization_pro.plan_components
                        WHERE plan_id = %s AND component_type = %s AND component_name = %s
                    """, (plan_id, comp.get('component_type'), comp.get('component_name')))
                    
                    existing = cur.fetchone()
                    
                    if existing:
                        cur.execute("""
                            UPDATE t_p80499285_psot_realization_pro.plan_components
                            SET price = %s, is_included = %s
                            WHERE id = %s
                        """, (comp.get('price', 0), comp.get('is_included', False), existing[0]))
                    else:
                        cur.execute("""
                            INSERT INTO t_p80499285_psot_realization_pro.plan_components
                            (plan_id, component_type, component_name, price, is_included)
                            VALUES (%s, %s, %s, %s, %s)
                        """, (plan_id, comp.get('component_type'), comp.get('component_name'), 
                              comp.get('price', 0), comp.get('is_included', False)))
                
                cur.execute("""
                    UPDATE t_p80499285_psot_realization_pro.subscription_plans
                    SET base_price = (
                        SELECT COALESCE(SUM(price), 0) 
                        FROM t_p80499285_psot_realization_pro.plan_components
                        WHERE plan_id = %s AND is_included = true
                    ),
                    price = (
                        SELECT COALESCE(SUM(price), 0) 
                        FROM t_p80499285_psot_realization_pro.plan_components
                        WHERE plan_id = %s AND is_included = true
                    )
                    WHERE id = %s
                """, (plan_id, plan_id, plan_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Тариф обновлен'}, ensure_ascii=False),
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
