-- Добавляем поля блокировки в таблицу users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS blocked_until TIMESTAMP,
ADD COLUMN IF NOT EXISTS block_reason TEXT,
ADD COLUMN IF NOT EXISTS blocked_by INTEGER,
ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMP;

-- Добавляем поля блокировки в таблицу organizations
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS blocked_until TIMESTAMP,
ADD COLUMN IF NOT EXISTS block_reason TEXT,
ADD COLUMN IF NOT EXISTS blocked_by INTEGER,
ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMP;

-- Создаем таблицу истории блокировок для аудита
CREATE TABLE IF NOT EXISTS block_history (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL,
    blocked_until TIMESTAMP,
    reason TEXT,
    performed_by INTEGER NOT NULL,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);