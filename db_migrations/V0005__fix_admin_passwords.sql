-- Исправляем пароли администраторов на правильный хэш для "admin123"
-- SHA256('admin123') = 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
UPDATE users 
SET password_hash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' 
WHERE email IN ('admin@test.com', 'admin1@test.com');