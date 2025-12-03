-- Создаём тестового администратора для проверки системы ролей
-- Пароль: admin123 (хеш SHA256)
INSERT INTO users (email, password_hash, fio, company, subdivision, position, role) 
VALUES ('admin@test.com', 'ed0cb90bdfa4f93981a7d03cff99213a30193eea67ed7a65f6f30e61a0781d2d', 'Администратор', 'АСУБТ', 'Администрация', 'Главный администратор', 'superadmin')
ON CONFLICT (email) DO NOTHING;