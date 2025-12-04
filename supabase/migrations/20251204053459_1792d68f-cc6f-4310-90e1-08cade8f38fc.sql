-- Account suspensions table
CREATE TABLE public.account_suspensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  suspended_by UUID NOT NULL,
  reason TEXT NOT NULL,
  suspension_type TEXT NOT NULL DEFAULT 'temporary', -- 'temporary', 'permanent'
  suspended_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  lifted_at TIMESTAMPTZ,
  lifted_by UUID,
  lift_reason TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_target CHECK (user_id IS NOT NULL OR business_id IS NOT NULL)
);

-- System settings table
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Broadcast announcements table
CREATE TABLE public.broadcast_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  announcement_type TEXT NOT NULL DEFAULT 'info', -- 'info', 'warning', 'alert', 'success'
  target_audience TEXT NOT NULL DEFAULT 'all', -- 'all', 'customers', 'businesses', 'agents'
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.account_suspensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for account_suspensions (admin only)
CREATE POLICY "Admins can manage suspensions" ON public.account_suspensions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for system_settings
CREATE POLICY "Admins can manage settings" ON public.system_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public settings viewable by all" ON public.system_settings
  FOR SELECT TO authenticated
  USING (is_public = true);

-- RLS Policies for broadcast_announcements
CREATE POLICY "Admins can manage announcements" ON public.broadcast_announcements
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Active announcements viewable by all" ON public.broadcast_announcements
  FOR SELECT TO authenticated
  USING (is_active = true AND starts_at <= now() AND (expires_at IS NULL OR expires_at > now()));

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
  ('commission_rate', '"10"', 'number', 'financial', 'Default commission rate percentage', false),
  ('platform_fee', '"2.5"', 'number', 'financial', 'Platform fee percentage', false),
  ('max_referral_bonus', '"100"', 'number', 'financial', 'Maximum referral bonus amount', false),
  ('maintenance_mode', 'false', 'boolean', 'system', 'Enable maintenance mode', true),
  ('new_registrations_enabled', 'true', 'boolean', 'system', 'Allow new user registrations', true),
  ('business_verification_required', 'true', 'boolean', 'business', 'Require business verification', false),
  ('max_qr_scans_per_day', '"100"', 'number', 'limits', 'Maximum QR scans per user per day', false),
  ('welcome_message', '"Welcome to Mansa Musa Marketplace!"', 'string', 'content', 'Welcome message for new users', true);

-- Create function to check if user is suspended
CREATE OR REPLACE FUNCTION public.is_user_suspended(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.account_suspensions
    WHERE user_id = check_user_id
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Create function to check if business is suspended
CREATE OR REPLACE FUNCTION public.is_business_suspended(check_business_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.account_suspensions
    WHERE business_id = check_business_id
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Triggers for updated_at
CREATE TRIGGER update_account_suspensions_updated_at
  BEFORE UPDATE ON public.account_suspensions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broadcast_announcements_updated_at
  BEFORE UPDATE ON public.broadcast_announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();