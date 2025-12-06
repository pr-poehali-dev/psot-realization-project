CREATE TABLE IF NOT EXISTS t_p80499285_psot_realization_pro.miniadmin_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    module VARCHAR(100) NOT NULL,
    can_view BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT false,
    can_remove BOOLEAN DEFAULT false,
    assigned_by INTEGER,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, organization_id, module)
);

CREATE INDEX IF NOT EXISTS idx_miniadmin_permissions_user ON t_p80499285_psot_realization_pro.miniadmin_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_miniadmin_permissions_org ON t_p80499285_psot_realization_pro.miniadmin_permissions(organization_id);

CREATE TABLE IF NOT EXISTS t_p80499285_psot_realization_pro.miniadmin_audit_log (
    id SERIAL PRIMARY KEY,
    miniadmin_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    target_id INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_miniadmin_audit_miniadmin ON t_p80499285_psot_realization_pro.miniadmin_audit_log(miniadmin_id);
CREATE INDEX IF NOT EXISTS idx_miniadmin_audit_org ON t_p80499285_psot_realization_pro.miniadmin_audit_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_miniadmin_audit_created ON t_p80499285_psot_realization_pro.miniadmin_audit_log(created_at);
