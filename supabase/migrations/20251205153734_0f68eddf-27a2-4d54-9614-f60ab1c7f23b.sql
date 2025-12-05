-- Add sponsor management fields to corporate_subscriptions
ALTER TABLE corporate_subscriptions 
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS logo_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS placement_override JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS display_priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Create sponsor admin audit log table
CREATE TABLE IF NOT EXISTS sponsor_admin_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  sponsor_id UUID NOT NULL REFERENCES corporate_subscriptions(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on audit table
ALTER TABLE sponsor_admin_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view sponsor audit logs"
ON sponsor_admin_audit
FOR SELECT
USING (is_admin_secure());

-- Only admins can insert audit logs
CREATE POLICY "Admins can insert sponsor audit logs"
ON sponsor_admin_audit
FOR INSERT
WITH CHECK (is_admin_secure());

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sponsor_admin_audit_sponsor_id ON sponsor_admin_audit(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_corporate_subscriptions_visible ON corporate_subscriptions(is_visible, logo_approved) WHERE status = 'active';