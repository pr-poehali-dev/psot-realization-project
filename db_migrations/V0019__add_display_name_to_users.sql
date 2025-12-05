-- Добавление поля display_name для закодированного отображения ФИО
ALTER TABLE t_p80499285_psot_realization_pro.users 
ADD COLUMN display_name TEXT;

-- Обновление существующих записей (если есть)
UPDATE t_p80499285_psot_realization_pro.users 
SET display_name = 'ID№' || LPAD(id::text, 5, '0') || '-' || 
    SUBSTRING(fio FROM 1 FOR 1) || '.' || 
    SUBSTRING(SPLIT_PART(fio, ' ', 2) FROM 1 FOR 1) || '.' || 
    SUBSTRING(SPLIT_PART(fio, ' ', 3) FROM 1 FOR 1) || '.'
WHERE display_name IS NULL AND fio IS NOT NULL;