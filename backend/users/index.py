import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User management API for admins
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-User-Role',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        import psycopg2
        
        params = event.get('queryStringParameters') or {}
        action = params.get('action', 'list')
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if action == 'list':
            cur.execute("""
                SELECT u.id, u.email, u.fio, u.company, u.subdivision, u.position, u.role, u.created_at,
                       COALESCE(s.registered_count, 0) as registered_count,
                       COALESCE(s.online_count, 0) as online_count,
                       COALESCE(s.offline_count, 0) as offline_count
                FROM users u
                LEFT JOIN user_stats s ON u.id = s.user_id
                ORDER BY u.created_at DESC
            """)
            
            users = []
            for row in cur.fetchall():
                users.append({
                    'id': row[0],
                    'email': row[1],
                    'fio': row[2],
                    'company': row[3],
                    'subdivision': row[4],
                    'position': row[5],
                    'role': row[6],
                    'created_at': row[7].isoformat() if row[7] else None,
                    'stats': {
                        'registered_count': row[8],
                        'online_count': row[9],
                        'offline_count': row[10]
                    }
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'users': users})
            }
        
        elif action == 'stats':
            cur.execute("""
                SELECT 
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN role = 'user' THEN 1 END) as users_count,
                    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins_count,
                    COUNT(CASE WHEN role = 'superadmin' THEN 1 END) as superadmins_count
                FROM users
            """)
            
            row = cur.fetchone()
            stats = {
                'total_users': row[0],
                'users_count': row[1],
                'admins_count': row[2],
                'superadmins_count': row[3]
            }
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'stats': stats})
            }
    
    if method == 'PUT':
        import psycopg2
        
        body_data = json.loads(event.get('body', '{}'))
        user_id = body_data.get('userId')
        action = body_data.get('action')
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if action == 'update_role':
            new_role = body_data.get('role')
            cur.execute("UPDATE users SET role = %s WHERE id = %s", (new_role, user_id))
            conn.commit()
            
        elif action == 'update_profile':
            fio = body_data.get('fio')
            company = body_data.get('company')
            subdivision = body_data.get('subdivision')
            position = body_data.get('position')
            
            cur.execute("""
                UPDATE users 
                SET fio = %s, company = %s, subdivision = %s, position = %s 
                WHERE id = %s
            """, (fio, company, subdivision, position, user_id))
            conn.commit()
            
        elif action == 'change_email':
            import hashlib
            
            new_email = body_data.get('newEmail')
            
            cur.execute("SELECT id FROM users WHERE email = %s AND id != %s", (new_email, user_id))
            if cur.fetchone():
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Email already exists'})
                }
            
            cur.execute("UPDATE users SET email = %s WHERE id = %s", (new_email, user_id))
            conn.commit()
            
        elif action == 'change_password':
            import hashlib
            
            new_password = body_data.get('newPassword')
            new_hash = hashlib.sha256(new_password.encode()).hexdigest()
            
            cur.execute("UPDATE users SET password_hash = %s WHERE id = %s", (new_hash, user_id))
            conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'success': True})
        }
    
    if method == 'POST':
        import psycopg2
        import hashlib
        
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'create_user':
            email = body_data.get('email')
            password = body_data.get('password')
            fio = body_data.get('fio')
            company = body_data.get('company')
            subdivision = body_data.get('subdivision')
            position = body_data.get('position')
            role = body_data.get('role', 'user')
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Email already exists'})
                }
            
            cur.execute("""
                INSERT INTO users (email, password_hash, fio, company, subdivision, position, role) 
                VALUES (%s, %s, %s, %s, %s, %s, %s) 
                RETURNING id
            """, (email, password_hash, fio, company, subdivision, position, role))
            
            user_id = cur.fetchone()[0]
            
            cur.execute("INSERT INTO user_stats (user_id) VALUES (%s)", (user_id,))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'userId': user_id, 'email': email})
            }
    
    if method == 'DELETE':
        import psycopg2
        
        body_data = json.loads(event.get('body', '{}'))
        user_id = body_data.get('userId')
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        cur.execute("DELETE FROM user_stats WHERE user_id = %s", (user_id,))
        cur.execute("DELETE FROM prescriptions WHERE user_id = %s", (user_id,))
        cur.execute("DELETE FROM audits WHERE user_id = %s", (user_id,))
        cur.execute("DELETE FROM violations WHERE user_id = %s", (user_id,))
        cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'success': True})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }