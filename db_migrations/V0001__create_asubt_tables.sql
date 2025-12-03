-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fio VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    subdivision VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица предписаний
CREATE TABLE prescriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'assigned',
    plan_date DATE,
    fact_date DATE,
    plan_audit_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица аудитов/наблюдений
CREATE TABLE audits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan_date DATE,
    fact_date DATE,
    status VARCHAR(50) DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица нарушений
CREATE TABLE violations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    description TEXT,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица статистики пользователей
CREATE TABLE user_stats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    registered_count INTEGER DEFAULT 0,
    online_count INTEGER DEFAULT 0,
    offline_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);