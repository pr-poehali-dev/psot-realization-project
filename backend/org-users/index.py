import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get organization users with activity statistics
    Args: event - dict with httpMethod, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict with users list and activity stats
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-User-Role',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        import psycopg2
        
        params = event.get('queryStringParameters') or {}
        organization_id = params.get('organization_id')
        
        if not organization_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'organization_id required'})
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        cur.execute("""
            SELECT 
                u.id, 
                u.email, 
                u.fio, 
                u.subdivision, 
                u.position, 
                u.role, 
                u.created_at,
                COALESCE(
                    (SELECT COUNT(*) FROM t_p80499285_psot_realization_pro.pab_records WHERE user_id = u.id), 
                    0
                ) as records_count,
                COALESCE(
                    (SELECT COUNT(*) FROM t_p80499285_psot_realization_pro.user_activity WHERE user_id = u.id AND activity_date >= CURRENT_DATE - INTERVAL '30 days'), 
                    0
                ) as activities_last_month,
                COALESCE(
                    (SELECT MAX(activity_date) FROM t_p80499285_psot_realization_pro.user_activity WHERE user_id = u.id), 
                    NULL
                ) as last_activity
            FROM t_p80499285_psot_realization_pro.users u
            WHERE u.organization_id = %s
            ORDER BY u.created_at DESC
        """, (organization_id,))
        
        users = []
        for row in cur.fetchall():
            users.append({
                'id': row[0],
                'email': row[1],
                'fio': row[2],
                'subdivision': row[3],
                'position': row[4],
                'role': row[5],
                'created_at': row[6].isoformat() if row[6] else None,
                'records_count': row[7],
                'activities_last_month': row[8],
                'last_activity': row[9].isoformat() if row[9] else None
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
            'body': json.dumps(users)
        }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }