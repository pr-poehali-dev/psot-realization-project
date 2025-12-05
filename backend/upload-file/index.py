import json
import os
import base64
import uuid
import psycopg2
from typing import Dict, Any
import mimetypes
from io import BytesIO

def parse_multipart(body: bytes, boundary: str) -> Dict[str, Any]:
    """
    Парсинг multipart/form-data вручную
    """
    result = {}
    boundary_bytes = f'--{boundary}'.encode('latin-1')
    parts = body.split(boundary_bytes)
    
    for part in parts:
        if not part or part in (b'--\r\n', b'--', b'\r\n'):
            continue
        
        # Разделяем заголовки и тело
        if b'\r\n\r\n' not in part:
            continue
            
        headers_raw, body_raw = part.split(b'\r\n\r\n', 1)
        
        # Убираем завершающий \r\n
        if body_raw.endswith(b'\r\n'):
            body_raw = body_raw[:-2]
        
        headers_str = headers_raw.decode('utf-8', errors='ignore')
        
        # Извлекаем имя поля
        if 'Content-Disposition' not in headers_str:
            continue
            
        name = None
        filename = None
        
        for line in headers_str.split('\r\n'):
            if 'Content-Disposition' in line:
                # Парсим name="..." и filename="..."
                parts_list = line.split(';')
                for p in parts_list:
                    p = p.strip()
                    if p.startswith('name='):
                        name = p.split('=', 1)[1].strip('"')
                    elif p.startswith('filename='):
                        filename = p.split('=', 1)[1].strip('"')
        
        if name:
            if filename:
                # Это файл
                result[name] = {
                    'filename': filename,
                    'data': body_raw
                }
            else:
                # Это обычное поле
                result[name] = body_raw.decode('utf-8', errors='ignore')
    
    return result

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Загрузка файлов в хранилище
    POST: Загрузить файл в папку (multipart/form-data)
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
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    try:
        headers = event.get('headers', {})
        content_type = headers.get('content-type') or headers.get('Content-Type', '')
        
        if 'multipart/form-data' not in content_type.lower():
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Требуется multipart/form-data'}),
                'isBase64Encoded': False
            }
        
        # Извлекаем boundary
        if 'boundary=' not in content_type:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Отсутствует boundary в Content-Type'}),
                'isBase64Encoded': False
            }
        
        boundary = content_type.split('boundary=')[-1].strip()
        
        # Получаем тело запроса
        body = event.get('body', '')
        is_base64 = event.get('isBase64Encoded', False)
        
        if is_base64:
            body_bytes = base64.b64decode(body)
        else:
            body_bytes = body.encode('latin-1') if isinstance(body, str) else body
        
        # Парсим multipart
        parsed = parse_multipart(body_bytes, boundary)
        
        # Отладка
        print(f"Parsed keys: {list(parsed.keys())}")
        for key in parsed.keys():
            if isinstance(parsed[key], dict):
                print(f"  {key}: file, filename={parsed[key].get('filename')}, size={len(parsed[key].get('data', b''))}")
            else:
                print(f"  {key}: {parsed[key][:50] if len(str(parsed[key])) > 50 else parsed[key]}")
        
        # Проверяем наличие необходимых полей
        if 'file' not in parsed:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Отсутствует поле file', 'parsed_keys': list(parsed.keys())}),
                'isBase64Encoded': False
            }
        
        if 'folder_id' not in parsed:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Отсутствует поле folder_id', 'parsed_keys': list(parsed.keys())}),
                'isBase64Encoded': False
            }
        
        file_info = parsed['file']
        if not isinstance(file_info, dict) or 'filename' not in file_info:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Некорректные данные файла'}),
                'isBase64Encoded': False
            }
        
        file_name = file_info['filename']
        file_data = file_info['data']
        folder_id = str(parsed['folder_id']).strip()
        
        if not file_data or not file_name or not folder_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Отсутствует file, folder_id или filename'}),
                'isBase64Encoded': False
            }
        
        file_size = len(file_data)
        file_type = mimetypes.guess_type(file_name)[0] or 'application/octet-stream'
        
        # Создаем data URL для хранения в БД
        file_url = f'data:{file_type};base64,{base64.b64encode(file_data).decode("utf-8")}'
        
        # Подключаемся к БД
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        try:
            # Проверяем существование папки
            cur.execute('SELECT id FROM storage_folders WHERE id = %s', (folder_id,))
            if not cur.fetchone():
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Папка не найдена'}),
                    'isBase64Encoded': False
                }
            
            # Вставляем файл
            cur.execute('''
                INSERT INTO storage_files (folder_id, file_name, file_url, file_size, file_type) 
                VALUES (%s, %s, %s, %s, %s) 
                RETURNING id
            ''', (folder_id, file_name, file_url, file_size, file_type))
            
            file_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'file_id': file_id, 'file_url': file_url, 'message': 'Файл загружен'}),
                'isBase64Encoded': False
            }
        
        finally:
            cur.close()
            conn.close()
    
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error occurred: {error_trace}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка загрузки: {str(e)}', 'trace': error_trace}),
            'isBase64Encoded': False
        }