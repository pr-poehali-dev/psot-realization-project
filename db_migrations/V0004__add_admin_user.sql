-- Создаём администратора для тестирования
-- Email: admin1@test.com, Пароль: admin123
INSERT INTO users (email, password_hash, fio, company, subdivision, position, role) 
VALUES ('admin1@test.com', 'ed0cb90bdfa4f93981a7d03cff99213a30193eea67ed7a65f6f30e61a0781d2d', 'Иванов Иван Иванович', 'АСУБТ', 'Отдел безопасности', 'Администратор', 'admin')
ON CONFLICT (email) DO NOTHING;