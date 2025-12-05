import json
import os
import base64
import uuid
import psycopg2
from typing import Dict, Any
import mimetypes

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
        content_type = event.get('headers', {}).get('content-type', '')
        
        if 'multipart/form-data' not in content_type.lower():
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Требуется multipart/form-data'}),
                'isBase64Encoded': False
            }
        
        body = event.get('body', '')
        is_base64 = event.get('isBase64Encoded', False)
        
        if is_base64:
            body = base64.b64decode(body)
        else:
            body = body.encode('latin-1') if isinstance(body, str) else body
        
        boundary = content_type.split('boundary=')[-1].strip()
        boundary_bytes = f'--{boundary}'.encode('latin-1')
        
        parts = body.split(boundary_bytes)
        
        file_data = None
        file_name = None
        folder_id = None
        
        for part in parts:
            if not part or part == b'--\r\n' or part == b'--':
                continue
            
            if b'Content-Disposition' in part:
                lines = part.split(b'\r\n')
                
                headers_part = []
                body_start = 0
                for i, line in enumerate(lines):
                    if line == b'':
                        body_start = i + 1
                        break
                    headers_part.append(line)
                
                disposition = b''.join(headers_part).decode('latin-1', errors='ignore')
                
                if 'name="file"' in disposition:
                    if 'filename=' in disposition:
                        file_name = disposition.split('filename=')[1].split('"')[1]
                    
                    file_data = b'\r\n'.join(lines[body_start:])
                    if file_data.endswith(b'\r\n'):
                        file_data = file_data[:-2]
                
                elif 'name="folder_id"' in disposition:
                    folder_id = b'\r\n'.join(lines[body_start:]).decode('utf-8', errors='ignore').strip()
                    if folder_id.endswith('\r\n'):
                        folder_id = folder_id[:-2]
        
        if not file_data or not file_name or not folder_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Отсутствует file, folder_id или filename'}),
                'isBase64Encoded': False
            }
        
        file_size = len(file_data)
        file_type = mimetypes.guess_type(file_name)[0] or 'application/octet-stream'
        
        file_url = f'data:{file_type};base64,{base64.b64encode(file_data).decode("utf-8")}'
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        try:
            cur.execute('SELECT id FROM storage_folders WHERE id = %s', (folder_id,))
            if not cur.fetchone():
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Папка не найдена'}),
                    'isBase64Encoded': False
                }
            
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
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка загрузки: {str(e)}'}),
            'isBase64Encoded': False
        }