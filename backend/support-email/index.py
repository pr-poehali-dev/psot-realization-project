import json
import os
import urllib.request
import urllib.parse
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Отправка запросов техподдержки в Telegram
    Args: event - dict с httpMethod, body (requestType, description, userFio, userCompany, userEmail, userId)
          context - object с атрибутами: request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        request_type = body_data.get('requestType', 'problem')
        description = body_data.get('description', '')
        user_fio = body_data.get('userFio', 'Неизвестный пользователь')
        user_company = body_data.get('userCompany', 'Не указана')
        user_email = body_data.get('userEmail', 'Не указан')
        user_id = body_data.get('userId', 'Не указан')
        
        if not description.strip():
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': False, 'error': 'Описание запроса обязательно'})
            }
        
        request_types = {
            'problem': '🔴 Проблема в работе',
            'recommendation': '💡 Рекомендация',
            'new_feature': '✨ Заказать новый блок'
        }
        
        request_type_label = request_types.get(request_type, 'Неизвестный тип')
        
        telegram_message = f"""🆘 <b>Новый запрос в техподдержку АСУБТ</b>

<b>Тип:</b> {request_type_label}

<b>👤 Пользователь:</b> {user_fio}
<b>🏢 Предприятие:</b> {user_company}
<b>📧 Email:</b> {user_email}
<b>🆔 ID:</b> {user_id}

<b>📝 Описание:</b>
{description}

<b>🕐 Дата:</b> {datetime.now().strftime('%d.%m.%Y %H:%M:%S')}
"""
        
        try:
            bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
            chat_id = os.environ.get('TELEGRAM_CHAT_ID')
            
            if not bot_token or not chat_id:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Telegram не настроен'})
                }
            
            url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
            data = urllib.parse.urlencode({
                'chat_id': chat_id,
                'text': telegram_message,
                'parse_mode': 'HTML'
            }).encode('utf-8')
            
            req = urllib.request.Request(url, data=data, method='POST')
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                
                if result.get('ok'):
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': True, 'message': 'Запрос отправлен'})
                    }
                else:
                    return {
                        'statusCode': 500,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': False, 'error': 'Ошибка Telegram API'})
                    }
            
        except Exception as e:
            print(f'Telegram sending error: {str(e)}')
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': False, 'error': f'Ошибка отправки: {str(e)}'})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
