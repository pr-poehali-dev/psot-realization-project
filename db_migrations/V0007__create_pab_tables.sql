-- Таблица для хранения записей ПАБ
CREATE TABLE pab_records (
    id SERIAL PRIMARY KEY,
    doc_number VARCHAR(50) UNIQUE NOT NULL,
    doc_date DATE NOT NULL,
    inspector_fio VARCHAR(255) NOT NULL,
    inspector_position VARCHAR(255) NOT NULL,
    user_id INTEGER,
    department VARCHAR(255),
    location VARCHAR(255),
    checked_object VARCHAR(255),
    photo_url TEXT,
    word_file_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для наблюдений
CREATE TABLE pab_observations (
    id SERIAL PRIMARY KEY,
    pab_record_id INTEGER,
    observation_number INTEGER NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(255),
    conditions_actions VARCHAR(255),
    hazard_factors VARCHAR(255),
    measures TEXT NOT NULL,
    responsible_person VARCHAR(255),
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для справочника категорий
CREATE TABLE pab_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для справочника условий
CREATE TABLE pab_conditions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для справочника опасных факторов
CREATE TABLE pab_hazards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для счётчика номеров ПАБ
CREATE TABLE pab_counter (
    id SERIAL PRIMARY KEY,
    year INTEGER UNIQUE NOT NULL,
    counter INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX idx_pab_records_doc_number ON pab_records(doc_number);
CREATE INDEX idx_pab_records_user_id ON pab_records(user_id);
CREATE INDEX idx_pab_observations_pab_record_id ON pab_observations(pab_record_id);

-- Начальные данные
INSERT INTO pab_categories (name) VALUES 
('Безопасность на рабочем месте'),
('Использование СИЗ'),
('Состояние оборудования'),
('Порядок и чистота'),
('Электробезопасность');

INSERT INTO pab_conditions (name) VALUES 
('Небезопасное состояние'),
('Небезопасное действие'),
('Безопасное состояние'),
('Безопасное действие');

INSERT INTO pab_hazards (name) VALUES 
('Механические опасности'),
('Электрические опасности'),
('Химические вещества'),
('Пожароопасность'),
('Падение с высоты'),
('Движущиеся механизмы');