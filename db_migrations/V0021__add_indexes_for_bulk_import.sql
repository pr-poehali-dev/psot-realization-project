-- Add index on organization_id for better query performance during bulk import
CREATE INDEX IF NOT EXISTS idx_users_organization_id 
ON t_p80499285_psot_realization_pro.users(organization_id);

-- Add index on email for faster email lookups during import validation
CREATE INDEX IF NOT EXISTS idx_users_email 
ON t_p80499285_psot_realization_pro.users(email);