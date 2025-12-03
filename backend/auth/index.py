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
            fio = body_data.get('fio')
            company = body_data.get('company')
            subdivision = body_data.get('subdivision')
            position = body_data.get('position')
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
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
                "INSERT INTO users (email, password_hash, fio, company, subdivision, position) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (email, password_hash, fio, company, subdivision, position)
            )
            user_id = cur.fetchone()[0]
            
            cur.execute(
                "INSERT INTO user_stats (user_id) VALUES (%s)",
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
            
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            
            cur.execute(
                "SELECT id, fio, company, position, role FROM users WHERE email = %s AND password_hash = %s",
                (email, password_hash)
            )
            result = cur.fetchone()
            
            cur.close()
            conn.close()
            
            if result:
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
                        'role': result[4]
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