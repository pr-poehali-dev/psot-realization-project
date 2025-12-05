-- Связываем тарифы с модулями
-- Базовый: только основные модули
INSERT INTO tariff_modules (tariff_id, module_id, created_at)
SELECT tp.id, m.id, CURRENT_TIMESTAMP 
FROM tariff_plans tp 
CROSS JOIN modules m
WHERE tp.name = 'Базовый' 
  AND m.name IN ('dashboard', 'Хранилище файлов', 'Управление пользователями', 'settings')
  AND NOT EXISTS (
    SELECT 1 FROM tariff_modules tm 
    WHERE tm.tariff_id = tp.id AND tm.module_id = m.id
  );

-- Стандарт: добавляем логистику и ПАБ
INSERT INTO tariff_modules (tariff_id, module_id, created_at)
SELECT tp.id, m.id, CURRENT_TIMESTAMP 
FROM tariff_plans tp 
CROSS JOIN modules m
WHERE tp.name = 'Стандарт' 
  AND m.name IN ('dashboard', 'reception', 'Хранилище файлов', 'shipment', 'Управление пользователями', 'ПАБ регистрация', 'Справочники ПАБ', 'settings')
  AND NOT EXISTS (
    SELECT 1 FROM tariff_modules tm 
    WHERE tm.tariff_id = tp.id AND tm.module_id = m.id
  );

-- Премиум: все модули
INSERT INTO tariff_modules (tariff_id, module_id, created_at)
SELECT tp.id, m.id, CURRENT_TIMESTAMP 
FROM tariff_plans tp 
CROSS JOIN modules m
WHERE tp.name = 'Премиум'
  AND NOT EXISTS (
    SELECT 1 FROM tariff_modules tm 
    WHERE tm.tariff_id = tp.id AND tm.module_id = m.id
  );