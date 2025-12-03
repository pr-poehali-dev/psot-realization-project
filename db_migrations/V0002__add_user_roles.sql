-- Добавляем роли пользователей
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';

-- Создаём индекс для быстрого поиска по ролям
CREATE INDEX idx_users_role ON users(role);

-- Комментарии для ясности
COMMENT ON COLUMN users.role IS 'Роль: user, admin, superadmin';