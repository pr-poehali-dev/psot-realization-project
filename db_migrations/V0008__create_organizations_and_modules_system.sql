-- Таблица организаций (предприятий)
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    registration_code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trial_end_date TIMESTAMP,
    subscription_type VARCHAR(50) DEFAULT 'free',
    is_active BOOLEAN DEFAULT true
);

-- Таблица доступных модулей
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    module_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица доступных страниц
CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    route VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Связь организаций с модулями
CREATE TABLE organization_modules (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    module_id INTEGER REFERENCES modules(id),
    enabled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, module_id)
);

-- Связь организаций со страницами
CREATE TABLE organization_pages (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    page_id INTEGER REFERENCES pages(id),
    enabled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, page_id)
);

-- Добавление поля organization_id к таблице users
ALTER TABLE users ADD COLUMN organization_id INTEGER REFERENCES organizations(id);

-- Таблица планов подписки
CREATE TABLE subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0,
    trial_days INTEGER DEFAULT 0,
    max_users INTEGER,
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка базовых модулей
INSERT INTO modules (name, description, module_type) VALUES
('ПАБ регистрация', 'Модуль регистрации предварительных анализов безопасности', 'pab'),
('Справочники ПАБ', 'Управление справочниками для ПАБ', 'pab'),
('Хранилище файлов', 'Модуль для хранения и управления файлами', 'storage'),
('Управление пользователями', 'Модуль управления пользователями предприятия', 'users');

-- Вставка базовых страниц
INSERT INTO pages (name, route, icon, description) VALUES
('Дашборд', '/dashboard', 'LayoutDashboard', 'Главная страница с обзором'),
('Регистрация ПАБ', '/pab-registration', 'ClipboardCheck', 'Страница регистрации ПАБ'),
('Справочники', '/pab-dictionaries', 'BookOpen', 'Управление справочниками'),
('Хранилище', '/storage', 'FolderOpen', 'Управление файлами'),
('Профиль', '/profile', 'User', 'Профиль пользователя');

-- Вставка базовых тарифных планов
INSERT INTO subscription_plans (name, price, trial_days, max_users, features) VALUES
('Бесплатный', 0, 30, 5, '{"modules": ["pab"], "storage_gb": 1}'),
('Базовый', 5000, 14, 20, '{"modules": ["pab", "storage"], "storage_gb": 10}'),
('Профессиональный', 15000, 14, 100, '{"modules": ["pab", "storage", "users"], "storage_gb": 50}'),
('Корпоративный', 50000, 30, 500, '{"modules": ["pab", "storage", "users"], "storage_gb": 200}');