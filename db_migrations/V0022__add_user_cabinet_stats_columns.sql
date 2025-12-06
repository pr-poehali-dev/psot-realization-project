-- Add columns for user cabinet statistics to user_stats table

ALTER TABLE t_p80499285_psot_realization_pro.user_stats
ADD COLUMN IF NOT EXISTS pab_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pab_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pab_in_progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pab_overdue INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS observations_issued INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS observations_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS observations_in_progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS observations_overdue INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prescriptions_issued INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prescriptions_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prescriptions_in_progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prescriptions_overdue INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS audits_conducted INTEGER DEFAULT 0;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id 
ON t_p80499285_psot_realization_pro.user_stats(user_id);
