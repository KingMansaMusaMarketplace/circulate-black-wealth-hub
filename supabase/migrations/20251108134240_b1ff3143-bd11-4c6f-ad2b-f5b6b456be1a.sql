-- Create admin notification preferences table
CREATE TABLE IF NOT EXISTS public.admin_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Email notification toggles
  business_verification_enabled BOOLEAN DEFAULT true,
  agent_milestone_enabled BOOLEAN DEFAULT true,
  
  -- Milestone-specific toggles
  milestone_referrals_enabled BOOLEAN DEFAULT true,
  milestone_earnings_enabled BOOLEAN DEFAULT true,
  milestone_conversion_enabled BOOLEAN DEFAULT true,
  
  -- Notification thresholds
  min_referral_milestone INTEGER DEFAULT 1,
  min_earnings_milestone NUMERIC DEFAULT 100,
  min_conversion_milestone NUMERIC DEFAULT 50,
  
  -- Notification frequency
  send_immediate BOOLEAN DEFAULT true,
  send_daily_digest BOOLEAN DEFAULT false,
  send_weekly_digest BOOLEAN DEFAULT false,
  digest_time TIME DEFAULT '09:00:00',
  
  -- Contact preferences
  notification_email TEXT NOT NULL,
  send_to_multiple_emails TEXT[], -- Array of additional email addresses
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(admin_user_id)
);

-- Enable RLS
ALTER TABLE public.admin_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view their own preferences"
  ON public.admin_notification_preferences
  FOR SELECT
  USING (
    auth.uid() = admin_user_id OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update their own preferences"
  ON public.admin_notification_preferences
  FOR UPDATE
  USING (auth.uid() = admin_user_id)
  WITH CHECK (auth.uid() = admin_user_id);

CREATE POLICY "Admins can insert their own preferences"
  ON public.admin_notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = admin_user_id);

-- Create function to get or create default preferences
CREATE OR REPLACE FUNCTION get_admin_notification_preferences(p_admin_id UUID)
RETURNS public.admin_notification_preferences
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_preferences public.admin_notification_preferences;
  v_admin_email TEXT;
BEGIN
  -- Try to get existing preferences
  SELECT * INTO v_preferences
  FROM public.admin_notification_preferences
  WHERE admin_user_id = p_admin_id;
  
  -- If not found, create default preferences
  IF NOT FOUND THEN
    -- Get admin email
    SELECT email INTO v_admin_email
    FROM auth.users
    WHERE id = p_admin_id;
    
    -- Insert default preferences
    INSERT INTO public.admin_notification_preferences (
      admin_user_id,
      notification_email
    ) VALUES (
      p_admin_id,
      COALESCE(v_admin_email, '')
    )
    RETURNING * INTO v_preferences;
  END IF;
  
  RETURN v_preferences;
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_preferences_updated_at
  BEFORE UPDATE ON public.admin_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_preferences_timestamp();

-- Create index for faster lookups
CREATE INDEX idx_admin_notification_preferences_user_id 
  ON public.admin_notification_preferences(admin_user_id);

COMMENT ON TABLE public.admin_notification_preferences IS 'Stores notification preferences for admin users';
