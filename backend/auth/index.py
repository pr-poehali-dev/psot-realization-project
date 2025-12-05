import json
import os
import hashlib
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Authentication and user registration for ASUBT system
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'register':
            import psycopg2
            
            email = body_data.get('email')
            password = body_data.get('password')
            code = body_data.get('code')
            full_name = body_data.get('full_name')
            fio = body_data.get('fio') or full_name
            company = body_data.get('company')
            subdivision = body_data.get('subdivision')
            position = body_data.get('position')
            
            if not email or not password or not fio:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Email, password and full name are required'})
                }
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            
            organization_id = None
            if code:
                cur.execute("SELECT id, name FROM t_p80499285_psot_realization_pro.organizations WHERE registration_code = %s", (code,))
                org_result = cur.fetchone()
                if org_result:
                    organization_id = org_result[0]
                    company = org_result[1]
                else:
                    cur.close()
                    conn.close()
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': False, 'error': 'Invalid registration code'})
                    }
            
            cur.execute("SELECT id FROM t_p80499285_psot_realization_pro.users WHERE email = %s", (email,))
            existing = cur.fetchone()
            
            if existing:
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
            
            cur.execute(
                "INSERT INTO t_p80499285_psot_realization_pro.users (email, password_hash, fio, company, subdivision, position, organization_id, role) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (email, password_hash, fio, company, subdivision, position, organization_id, 'user')
            )
            user_id = cur.fetchone()[0]
            
            cur.execute(
                "INSERT INTO t_p80499285_psot_realization_pro.user_stats (user_id) VALUES (%s)",
                (user_id,)
            )
            
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
                'body': json.dumps({'success': True, 'userId': user_id})
            }
        
        elif action == 'login':
            import psycopg2
            
            email = body_data.get('email')
            password = body_data.get('password')
            
            print(f"[AUTH DEBUG] Login attempt for email: {email}, password length: {len(password) if password else 0}")
            
            if not email or not password:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Email and password required'})
                }
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            print(f"[AUTH DEBUG] Computed hash: {password_hash}")
            
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            
            cur.execute("SELECT email, password_hash FROM users WHERE email = %s", (email,))
            db_result = cur.fetchone()
            if db_result:
                print(f"[AUTH DEBUG] User found in DB. DB hash: {db_result[1]}")
                print(f"[AUTH DEBUG] Hashes match: {db_result[1] == password_hash}")
            else:
                print(f"[AUTH DEBUG] User NOT found in DB")
            
            cur.execute(
                "SELECT u.id, u.fio, u.company, u.position, u.role, u.organization_id, u.is_blocked, u.blocked_until, o.is_blocked, o.blocked_until FROM t_p80499285_psot_realization_pro.users u LEFT JOIN t_p80499285_psot_realization_pro.organizations o ON u.organization_id = o.id WHERE u.email = %s AND u.password_hash = %s",
                (email, password_hash)
            )
            result = cur.fetchone()
            print(f"[AUTH DEBUG] Final query result: {result is not None}")
            
            cur.close()
            conn.close()
            
            if result:
                from datetime import datetime
                user_blocked = result[6]
                user_blocked_until = result[7]
                org_blocked = result[8]
                org_blocked_until = result[9]
                
                if user_blocked:
                    if user_blocked_until and datetime.now() < user_blocked_until:
                        return {
                            'statusCode': 403,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'isBase64Encoded': False,
                            'body': json.dumps({
                                'success': False, 
                                'error': 'blocked',
                                'message': f'Ваш аккаунт был заблокирован по неизвестной причине, просьба обратиться к администратору вашего предприятия, не забудьте назвать свой id №{result[0]}'
                            })
                        }
                    elif not user_blocked_until:
                        return {
                            'statusCode': 403,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'isBase64Encoded': False,
                            'body': json.dumps({
                                'success': False, 
                                'error': 'blocked',
                                'message': f'Ваш аккаунт был заблокирован по неизвестной причине, просьба обратиться к администратору вашего предприятия, не забудьте назвать свой id №{result[0]}'
                            })
                        }
                
                if org_blocked and result[5]:
                    if org_blocked_until and datetime.now() < org_blocked_until:
                        return {
                            'statusCode': 403,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'isBase64Encoded': False,
                            'body': json.dumps({
                                'success': False, 
                                'error': 'blocked',
                                'message': 'Ваше предприятие временно заблокировано. Обратитесь к главному администратору системы.'
                            })
                        }
                    elif not org_blocked_until:
                        return {
                            'statusCode': 403,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'isBase64Encoded': False,
                            'body': json.dumps({
                                'success': False, 
                                'error': 'blocked',
                                'message': 'Ваше предприятие заблокировано. Обратитесь к главному администратору системы.'
                            })
                        }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': True,
                        'userId': result[0],
                        'fio': result[1],
                        'company': result[2],
                        'position': result[3],
                        'role': result[4],
                        'organizationId': result[5]
                    })
                }
            else:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Invalid credentials'})
                }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }