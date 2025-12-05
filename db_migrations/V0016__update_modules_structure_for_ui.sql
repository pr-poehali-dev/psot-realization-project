-- Добавляем новые поля в таблицу modules для UI
ALTER TABLE modules 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS route_path VARCHAR(255),
ADD COLUMN IF NOT EXISTS icon VARCHAR(100),
ADD COLUMN IF NOT EXISTS category VARCHAR(100);

-- Обновляем существующие модули
UPDATE modules SET 
    display_name = name,
    route_path = CASE 
        WHEN module_type = 'pab' THEN '/pab'
        WHEN module_type = 'storage' THEN '/storage'
        WHEN module_type = 'users' THEN '/employees'
    END,
    icon = CASE 
        WHEN module_type = 'pab' THEN 'FileText'
        WHEN module_type = 'storage' THEN 'Warehouse'
        WHEN module_type = 'users' THEN 'Users'
    END,
    category = module_type
WHERE display_name IS NULL;

-- Добавляем базовые модули приложения (проверяя существование по name)
INSERT INTO modules (name, display_name, description, route_path, icon, category, module_type, is_active) 
SELECT 'dashboard', 'Главная панель', 'Главная панель управления предприятием', '/dashboard', 'LayoutDashboard', 'main', 'core', true
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE name = 'dashboard');

INSERT INTO modules (name, display_name, description, route_path, icon, category, module_type, is_active) 
SELECT 'reception', 'Приёмка', 'Приёмка товаров и материалов', '/reception', 'PackageOpen', 'logistics', 'logistics', true
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE name = 'reception');

INSERT INTO modules (name, display_name, description, route_path, icon, category, module_type, is_active) 
SELECT 'production', 'Производство', 'Управление производственными процессами', '/production', 'Factory', 'production', 'production', true
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE name = 'production');

INSERT INTO modules (name, display_name, description, route_path, icon, category, module_type, is_active) 
SELECT 'shipment', 'Отгрузка', 'Отгрузка готовой продукции', '/shipment', 'TruckIcon', 'logistics', 'logistics', true
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE name = 'shipment');

INSERT INTO modules (name, display_name, description, route_path, icon, category, module_type, is_active) 
SELECT 'analytics', 'Аналитика', 'Аналитика и отчёты', '/analytics', 'BarChart3', 'analytics', 'analytics', true
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE name = 'analytics');

INSERT INTO modules (name, display_name, description, route_path, icon, category, module_type, is_active) 
SELECT 'settings', 'Настройки', 'Настройки предприятия', '/settings', 'Settings', 'system', 'system', true
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE name = 'settings');

-- Создаём базовые тарифные планы
INSERT INTO tariff_plans (name, description, price, is_default, is_active, created_at, updated_at) 
SELECT 'Базовый', 'Базовый функционал для малого бизнеса', 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tariff_plans WHERE name = 'Базовый');

INSERT INTO tariff_plans (name, description, price, is_default, is_active, created_at, updated_at) 
SELECT 'Стандарт', 'Расширенный функционал для среднего бизнеса', 5000, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tariff_plans WHERE name = 'Стандарт');

INSERT INTO tariff_plans (name, description, price, is_default, is_active, created_at, updated_at) 
SELECT 'Премиум', 'Полный функционал для крупного предприятия', 15000, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tariff_plans WHERE name = 'Премиум');