-- Создаем таблицу для папок в хранилище
CREATE TABLE IF NOT EXISTS storage_folders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    folder_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, folder_name)
);

-- Создаем таблицу для файлов в хранилище
CREATE TABLE IF NOT EXISTS storage_files (
    id SERIAL PRIMARY KEY,
    folder_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_storage_folders_user_id ON storage_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_storage_files_folder_id ON storage_files(folder_id);