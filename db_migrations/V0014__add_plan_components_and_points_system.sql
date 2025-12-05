-- Добавляем новые поля к существующей таблице subscription_plans
ALTER TABLE t_p80499285_psot_realization_pro.subscription_plans 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS base_price NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_points_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS points_value NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Таблица компонентов тарифа (блоки, страницы, кнопки, модули)
CREATE TABLE IF NOT EXISTS t_p80499285_psot_realization_pro.plan_components (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER REFERENCES t_p80499285_psot_realization_pro.subscription_plans(id),
    component_type VARCHAR(50) NOT NULL,
    component_name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) DEFAULT 0,
    is_included BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица баллов предприятий
CREATE TABLE IF NOT EXISTS t_p80499285_psot_realization_pro.organization_points (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES t_p80499285_psot_realization_pro.organizations(id),
    points_balance NUMERIC(10,2) DEFAULT 0,
    total_earned NUMERIC(10,2) DEFAULT 0,
    total_spent NUMERIC(10,2) DEFAULT 0,
    is_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id)
);

-- Таблица истории операций с баллами
CREATE TABLE IF NOT EXISTS t_p80499285_psot_realization_pro.points_history (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES t_p80499285_psot_realization_pro.organizations(id),
    points_amount NUMERIC(10,2) NOT NULL,
    operation_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем связь тарифа с предприятием
ALTER TABLE t_p80499285_psot_realization_pro.organizations 
ADD COLUMN IF NOT EXISTS subscription_plan_id INTEGER REFERENCES t_p80499285_psot_realization_pro.subscription_plans(id);

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_plan_components_plan_id ON t_p80499285_psot_realization_pro.plan_components(plan_id);
CREATE INDEX IF NOT EXISTS idx_organization_points_org_id ON t_p80499285_psot_realization_pro.organization_points(organization_id);
CREATE INDEX IF NOT EXISTS idx_points_history_org_id ON t_p80499285_psot_realization_pro.points_history(organization_id);

COMMENT ON TABLE t_p80499285_psot_realization_pro.plan_components IS 'Компоненты тарифа: блоки, страницы, кнопки, модули с индивидуальными ценами';
COMMENT ON TABLE t_p80499285_psot_realization_pro.organization_points IS 'Балансы баллов предприятий для оплаты тарифов';
COMMENT ON TABLE t_p80499285_psot_realization_pro.points_history IS 'История начисления и списания баллов';