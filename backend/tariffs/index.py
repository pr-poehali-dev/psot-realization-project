import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API управления тарифными планами
    GET - получить все тарифы с модулями
    POST - создать новый тариф
    PUT - обновить тариф и его модули
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    if method == 'GET':
        params = event.get('queryStringParameters', {}) or {}
        tariff_id = params.get('id')
        
        if tariff_id:
            cur.execute('''
                SELECT tp.id, tp.name, tp.description, tp.price, tp.is_active, tp.is_default
                FROM t_p80499285_psot_realization_pro.tariff_plans tp
                WHERE tp.id = %s
            ''', (tariff_id,))
            row = cur.fetchone()
            
            if not row:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Тариф не найден'}),
                    'isBase64Encoded': False
                }
            
            tariff = {
                'id': row[0],
                'name': row[1],
                'description': row[2],
                'price': float(row[3]) if row[3] else 0,
                'is_active': row[4],
                'is_default': row[5],
                'modules': []
            }
            
            cur.execute('''
                SELECT m.id, m.name, m.display_name, m.description, m.route_path, m.icon, m.category
                FROM t_p80499285_psot_realization_pro.modules m
                JOIN t_p80499285_psot_realization_pro.tariff_modules tm ON m.id = tm.module_id
                WHERE tm.tariff_id = %s AND m.is_active = true
                ORDER BY m.category, m.display_name
            ''', (tariff_id,))
            
            for mod_row in cur.fetchall():
                tariff['modules'].append({
                    'id': mod_row[0],
                    'name': mod_row[1],
                    'display_name': mod_row[2],
                    'description': mod_row[3],
                    'route_path': mod_row[4],
                    'icon': mod_row[5],
                    'category': mod_row[6]
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(tariff, ensure_ascii=False),
                'isBase64Encoded': False
            }
        else:
            cur.execute('''
                SELECT tp.id, tp.name, tp.description, tp.price, tp.is_active, tp.is_default,
                       COUNT(tm.module_id) as module_count
                FROM t_p80499285_psot_realization_pro.tariff_plans tp
                LEFT JOIN t_p80499285_psot_realization_pro.tariff_modules tm ON tp.id = tm.tariff_id
                GROUP BY tp.id
                ORDER BY tp.price
            ''')
            
            tariffs = []
            for row in cur.fetchall():
                tariffs.append({
                    'id': row[0],
                    'name': row[1],
                    'description': row[2],
                    'price': float(row[3]) if row[3] else 0,
                    'is_active': row[4],
                    'is_default': row[5],
                    'module_count': row[6]
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(tariffs, ensure_ascii=False),
                'isBase64Encoded': False
            }
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        name = body.get('name')
        description = body.get('description', '')
        price = body.get('price', 0)
        module_ids = body.get('module_ids', [])
        
        if not name:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Название тарифа обязательно'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        cur.execute('''
            INSERT INTO t_p80499285_psot_realization_pro.tariff_plans (name, description, price, is_active, is_default)
            VALUES (%s, %s, %s, true, false)
            RETURNING id
        ''', (name, description, price))
        
        tariff_id = cur.fetchone()[0]
        
        for module_id in module_ids:
            cur.execute('''
                INSERT INTO t_p80499285_psot_realization_pro.tariff_modules (tariff_id, module_id)
                VALUES (%s, %s)
            ''', (tariff_id, module_id))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'id': tariff_id, 'name': name}, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        tariff_id = body.get('id')
        
        if not tariff_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'ID тарифа обязателен'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        updates = []
        params = []
        
        if 'name' in body:
            updates.append('name = %s')
            params.append(body['name'])
        
        if 'description' in body:
            updates.append('description = %s')
            params.append(body['description'])
        
        if 'price' in body:
            updates.append('price = %s')
            params.append(body['price'])
        
        if 'is_active' in body:
            updates.append('is_active = %s')
            params.append(body['is_active'])
        
        if updates:
            params.append(tariff_id)
            query = f"UPDATE t_p80499285_psot_realization_pro.tariff_plans SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
            cur.execute(query, params)
        
        if 'module_ids' in body:
            cur.execute('DELETE FROM t_p80499285_psot_realization_pro.tariff_modules WHERE tariff_id = %s', (tariff_id,))
            
            for module_id in body['module_ids']:
                cur.execute('''
                    INSERT INTO t_p80499285_psot_realization_pro.tariff_modules (tariff_id, module_id)
                    VALUES (%s, %s)
                ''', (tariff_id, module_id))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }