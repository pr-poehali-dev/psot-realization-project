-- Таблица правил начисления баллов
CREATE TABLE IF NOT EXISTS t_p80499285_psot_realization_pro.points_rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    points_amount NUMERIC(10,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица привязки правил к предприятиям
CREATE TABLE IF NOT EXISTS t_p80499285_psot_realization_pro.organization_points_rules (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES t_p80499285_psot_realization_pro.organizations(id),
    rule_id INTEGER REFERENCES t_p80499285_psot_realization_pro.points_rules(id),
    is_enabled BOOLEAN DEFAULT true,
    multiplier NUMERIC(5,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем базовые правила начисления баллов
INSERT INTO t_p80499285_psot_realization_pro.points_rules 
(rule_name, action_type, points_amount, description, is_active) VALUES
('Регистрация в системе', 'user_registration', 100, 'Начисляется новому пользователю при регистрации', true),
('Вход в систему', 'user_login', 5, 'Начисляется при каждом входе (раз в день)', true),
('Создание записи ПАБ', 'pab_create', 50, 'Начисляется за создание записи о потенциально аварийной ситуации', true),
('Загрузка файла', 'file_upload', 10, 'Начисляется за загрузку документа в хранилище', true),
('Создание папки', 'folder_create', 5, 'Начисляется за создание новой папки в хранилище', true),
('Заполнение профиля', 'profile_complete', 50, 'Однократное начисление за полное заполнение профиля', true),
('Активность (10 действий)', 'activity_milestone_10', 20, 'Бонус за 10 действий в системе', true),
('Активность (50 действий)', 'activity_milestone_50', 100, 'Бонус за 50 действий в системе', true),
('Активность (100 действий)', 'activity_milestone_100', 250, 'Бонус за 100 действий в системе', true),
('Месяц без нарушений', 'safety_month', 500, 'Начисляется если нет нарушений в течение месяца', true);

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_points_rules_action_type ON t_p80499285_psot_realization_pro.points_rules(action_type);
CREATE INDEX IF NOT EXISTS idx_org_points_rules_org_id ON t_p80499285_psot_realization_pro.organization_points_rules(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_points_rules_rule_id ON t_p80499285_psot_realization_pro.organization_points_rules(rule_id);

COMMENT ON TABLE t_p80499285_psot_realization_pro.points_rules IS 'Глобальные правила начисления баллов за различные действия';
COMMENT ON TABLE t_p80499285_psot_realization_pro.organization_points_rules IS 'Настройка правил начисления для каждого предприятия с возможностью множителя';
