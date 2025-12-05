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
            headers = event.get('headers', {})
            user_role = headers.get('X-User-Role', '')
            
            cur.execute("""
                SELECT u.id, u.email, u.fio, u.display_name, u.company, u.subdivision, u.position, u.role, u.created_at,
                       COALESCE(s.registered_count, 0) as registered_count,
                       COALESCE(s.online_count, 0) as online_count,
                       COALESCE(s.offline_count, 0) as offline_count
                FROM t_p80499285_psot_realization_pro.users u
                LEFT JOIN t_p80499285_psot_realization_pro.user_stats s ON u.id = s.user_id
                ORDER BY u.created_at DESC
            """)
            
            users = []
            for row in cur.fetchall():
                is_superadmin = user_role == 'superadmin'
                users.append({
                    'id': row[0],
                    'email': row[1],
                    'fio': row[2] if is_superadmin else row[3],
                    'display_name': row[3],
                    'company': row[4],
                    'subdivision': row[5],
                    'position': row[6],
                    'role': row[7],
                    'created_at': row[8].isoformat() if row[8] else None,
                    'stats': {
                        'registered_count': row[9],
                        'online_count': row[10],
                        'offline_count': row[11]
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
                FROM t_p80499285_psot_realization_pro.users
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
            new_role_escaped = new_role.replace("'", "''")
            cur.execute(f"UPDATE t_p80499285_psot_realization_pro.users SET role = '{new_role_escaped}' WHERE id = {user_id}")
            conn.commit()
            
        elif action == 'update_profile':
            fio = body_data.get('fio')
            company = body_data.get('company')
            subdivision = body_data.get('subdivision')
            position = body_data.get('position')
            
            fio_escaped = fio.replace("'", "''") if fio else ''
            company_escaped = company.replace("'", "''") if company else ''
            subdivision_escaped = subdivision.replace("'", "''") if subdivision else ''
            position_escaped = position.replace("'", "''") if position else ''
            
            fio_sql = f"'{fio_escaped}'" if fio else 'NULL'
            company_sql = f"'{company_escaped}'" if company else 'NULL'
            subdivision_sql = f"'{subdivision_escaped}'" if subdivision else 'NULL'
            position_sql = f"'{position_escaped}'" if position else 'NULL'
            
            cur.execute(f"""
                UPDATE t_p80499285_psot_realization_pro.users 
                SET fio = {fio_sql}, company = {company_sql}, subdivision = {subdivision_sql}, position = {position_sql} 
                WHERE id = {user_id}
            """)
            conn.commit()
            
        elif action == 'change_email':
            import hashlib
            
            new_email = body_data.get('newEmail')
            new_email_escaped = new_email.replace("'", "''")
            
            cur.execute(f"SELECT id FROM t_p80499285_psot_realization_pro.users WHERE email = '{new_email_escaped}' AND id != {user_id}")
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
            
            cur.execute(f"UPDATE t_p80499285_psot_realization_pro.users SET email = '{new_email_escaped}' WHERE id = {user_id}")
            conn.commit()
            
        elif action == 'change_password':
            import hashlib
            
            new_password = body_data.get('newPassword')
            new_hash = hashlib.sha256(new_password.encode()).hexdigest()
            
            cur.execute(f"UPDATE t_p80499285_psot_realization_pro.users SET password_hash = '{new_hash}' WHERE id = {user_id}")
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
            
            email_escaped = email.replace("'", "''")
            cur.execute(f"SELECT id FROM t_p80499285_psot_realization_pro.users WHERE email = '{email_escaped}'")
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
            
            fio_escaped = fio.replace("'", "''") if fio else ''
            company_escaped = company.replace("'", "''") if company else ''
            subdivision_escaped = subdivision.replace("'", "''") if subdivision else ''
            position_escaped = position.replace("'", "''") if position else ''
            role_escaped = role.replace("'", "''")
            
            fio_sql = f"'{fio_escaped}'" if fio else 'NULL'
            company_sql = f"'{company_escaped}'" if company else 'NULL'
            subdivision_sql = f"'{subdivision_escaped}'" if subdivision else 'NULL'
            position_sql = f"'{position_escaped}'" if position else 'NULL'
            
            cur.execute(f"""
                INSERT INTO t_p80499285_psot_realization_pro.users (email, password_hash, fio, company, subdivision, position, role) 
                VALUES ('{email_escaped}', '{password_hash}', {fio_sql}, {company_sql}, {subdivision_sql}, {position_sql}, '{role_escaped}') 
                RETURNING id
            """)
            
            user_id = cur.fetchone()[0]
            
            cur.execute(f"INSERT INTO t_p80499285_psot_realization_pro.user_stats (user_id) VALUES ({user_id})")
            
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
        
        cur.execute(f"DELETE FROM t_p80499285_psot_realization_pro.user_stats WHERE user_id = {user_id}")
        cur.execute(f"DELETE FROM t_p80499285_psot_realization_pro.prescriptions WHERE user_id = {user_id}")
        cur.execute(f"DELETE FROM t_p80499285_psot_realization_pro.audits WHERE user_id = {user_id}")
        cur.execute(f"DELETE FROM t_p80499285_psot_realization_pro.violations WHERE user_id = {user_id}")
        cur.execute(f"DELETE FROM t_p80499285_psot_realization_pro.users WHERE id = {user_id}")
        
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