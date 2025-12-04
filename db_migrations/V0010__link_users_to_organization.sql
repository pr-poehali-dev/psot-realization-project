-- Привязка существующих пользователей к организации
UPDATE t_p80499285_psot_realization_pro.users 
SET organization_id = 1 
WHERE organization_id IS NULL;