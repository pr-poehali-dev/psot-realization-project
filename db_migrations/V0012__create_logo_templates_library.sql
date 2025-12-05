-- Создаем таблицу для библиотеки логотипов предприятий
CREATE TABLE organization_logo_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    logo_url TEXT NOT NULL,
    preview_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем индексы для быстрого поиска
CREATE INDEX idx_logo_templates_category ON organization_logo_templates(category);
CREATE INDEX idx_logo_templates_active ON organization_logo_templates(is_active);

-- Вставляем базовые категории логотипов (пустые записи будут заполнены через UI)
INSERT INTO organization_logo_templates (name, category, logo_url, preview_url) VALUES
('Промышленность - Завод', 'Промышленность', 'placeholder', 'placeholder'),
('Промышленность - Шестерня', 'Промышленность', 'placeholder', 'placeholder'),
('Строительство - Кран', 'Строительство', 'placeholder', 'placeholder'),
('Строительство - Каска', 'Строительство', 'placeholder', 'placeholder'),
('Добыча - Горы', 'Добыча', 'placeholder', 'placeholder'),
('Добыча - Молот', 'Добыча', 'placeholder', 'placeholder'),
('Офис - Здание', 'Офис', 'placeholder', 'placeholder'),
('Офис - Портфель', 'Офис', 'placeholder', 'placeholder');