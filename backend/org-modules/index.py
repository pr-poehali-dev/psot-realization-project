import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Управление модулями и страницами организации
    GET - получить все модули/страницы или для конкретной организации
    POST - подключить модуль/страницу к организации
    PUT - отключить модуль/страницу от организации
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
        params = event.get('queryStringParameters', {})
        org_id = params.get('organization_id')
        resource_type = params.get('type', 'modules')
        
        if resource_type == 'modules':
            if org_id:
                cur.execute('''
                    SELECT m.id, m.name, m.description, m.module_type, m.is_active,
                           CASE WHEN om.id IS NOT NULL THEN true ELSE false END as enabled
                    FROM modules m
                    LEFT JOIN organization_modules om ON m.id = om.module_id AND om.organization_id = %s
                    WHERE m.is_active = true
                    ORDER BY m.name
                ''', (org_id,))
            else:
                cur.execute('SELECT id, name, description, module_type, is_active FROM modules WHERE is_active = true ORDER BY name')
            
            rows = cur.fetchall()
            items = []
            for row in rows:
                item = {
                    'id': row[0],
                    'name': row[1],
                    'description': row[2],
                    'module_type': row[3],
                    'is_active': row[4]
                }
                if org_id:
                    item['enabled'] = row[5]
                items.append(item)
        
        elif resource_type == 'pages':
            if org_id:
                cur.execute('''
                    SELECT p.id, p.name, p.route, p.icon, p.description, p.is_active,
                           CASE WHEN op.id IS NOT NULL THEN true ELSE false END as enabled
                    FROM pages p
                    LEFT JOIN organization_pages op ON p.id = op.page_id AND op.organization_id = %s
                    WHERE p.is_active = true
                    ORDER BY p.name
                ''', (org_id,))
            else:
                cur.execute('SELECT id, name, route, icon, description, is_active FROM pages WHERE is_active = true ORDER BY name')
            
            rows = cur.fetchall()
            items = []
            for row in rows:
                item = {
                    'id': row[0],
                    'name': row[1],
                    'route': row[2],
                    'icon': row[3],
                    'description': row[4],
                    'is_active': row[5]
                }
                if org_id:
                    item['enabled'] = row[6]
                items.append(item)
        
        else:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid type'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(items, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        org_id = body.get('organization_id')
        resource_type = body.get('type')
        resource_id = body.get('resource_id')
        
        if not org_id or not resource_type or not resource_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing required fields'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        if resource_type == 'module':
            cur.execute('''
                INSERT INTO organization_modules (organization_id, module_id)
                VALUES (%s, %s)
                ON CONFLICT (organization_id, module_id) DO NOTHING
            ''', (org_id, resource_id))
        elif resource_type == 'page':
            cur.execute('''
                INSERT INTO organization_pages (organization_id, page_id)
                VALUES (%s, %s)
                ON CONFLICT (organization_id, page_id) DO NOTHING
            ''', (org_id, resource_id))
        else:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid type'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        org_id = body.get('organization_id')
        resource_type = body.get('type')
        items = body.get('items', [])
        
        if not org_id or not resource_type:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing required fields'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        if resource_type == 'modules':
            for item_id in items:
                cur.execute('''
                    INSERT INTO organization_modules (organization_id, module_id)
                    VALUES (%s, %s)
                    ON CONFLICT (organization_id, module_id) DO NOTHING
                ''', (org_id, item_id))
        elif resource_type == 'pages':
            for item_id in items:
                cur.execute('''
                    INSERT INTO organization_pages (organization_id, page_id)
                    VALUES (%s, %s)
                    ON CONFLICT (organization_id, page_id) DO NOTHING
                ''', (org_id, item_id))
        
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
        'body': json.dumps({'error': 'Method not allowed'}, ensure_ascii=False),
        'isBase64Encoded': False
    }
