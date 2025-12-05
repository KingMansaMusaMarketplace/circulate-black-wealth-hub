
-- Phase 1: Feature Flags
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key VARCHAR(100) UNIQUE NOT NULL,
  flag_name VARCHAR(200) NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 100 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_user_types TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage feature flags" ON public.feature_flags
  FOR ALL USING (is_admin_secure());

CREATE POLICY "Anyone can read enabled flags" ON public.feature_flags
  FOR SELECT USING (is_enabled = true);

-- Phase 2: Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(30) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_on_user', 'resolved', 'closed')),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all tickets" ON public.support_tickets
  FOR ALL USING (is_admin_secure());

CREATE POLICY "Users can view their own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Support Ticket Messages
CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_internal_note BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all messages" ON public.support_ticket_messages
  FOR ALL USING (is_admin_secure());

CREATE POLICY "Users can view non-internal messages on their tickets" ON public.support_ticket_messages
  FOR SELECT USING (
    is_internal_note = false AND 
    ticket_id IN (SELECT id FROM public.support_tickets WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can add messages to their tickets" ON public.support_ticket_messages
  FOR INSERT WITH CHECK (
    ticket_id IN (SELECT id FROM public.support_tickets WHERE user_id = auth.uid())
  );

-- Content Moderation Queue
CREATE TABLE IF NOT EXISTS public.content_moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL,
  content_id UUID NOT NULL,
  reported_by UUID REFERENCES auth.users(id),
  reason VARCHAR(100) NOT NULL,
  details TEXT,
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'removed', 'warned')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  action_taken VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.content_moderation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage moderation queue" ON public.content_moderation_queue
  FOR ALL USING (is_admin_secure());

CREATE POLICY "Users can report content" ON public.content_moderation_queue
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

-- Promo Codes
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'points')),
  discount_value NUMERIC(10,2) NOT NULL,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  min_purchase_amount NUMERIC(10,2),
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  applies_to VARCHAR(50) DEFAULT 'all',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage promo codes" ON public.promo_codes
  FOR ALL USING (is_admin_secure());

CREATE POLICY "Active promo codes are viewable" ON public.promo_codes
  FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));

-- Promo Code Redemptions
CREATE TABLE IF NOT EXISTS public.promo_code_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID REFERENCES public.promo_codes(id),
  user_id UUID REFERENCES auth.users(id),
  business_id UUID REFERENCES public.businesses(id),
  redeemed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.promo_code_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all redemptions" ON public.promo_code_redemptions
  FOR ALL USING (is_admin_secure());

CREATE POLICY "Users can view their redemptions" ON public.promo_code_redemptions
  FOR SELECT USING (auth.uid() = user_id);

-- Scheduled Reports
CREATE TABLE IF NOT EXISTS public.scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_name VARCHAR(200) NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  recipients TEXT[] NOT NULL,
  next_run_at TIMESTAMPTZ NOT NULL,
  last_run_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.scheduled_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage scheduled reports" ON public.scheduled_reports
  FOR ALL USING (is_admin_secure());

-- Admin Permissions
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_role VARCHAR(50) NOT NULL,
  permission VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(admin_role, permission)
);

ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage permissions" ON public.admin_permissions
  FOR ALL USING (is_admin_secure());

CREATE POLICY "Admins can view permissions" ON public.admin_permissions
  FOR SELECT USING (is_admin_secure());

-- Insert default permissions
INSERT INTO public.admin_permissions (admin_role, permission) VALUES
  ('super_admin', 'all'),
  ('support_admin', 'tickets'),
  ('support_admin', 'users_view'),
  ('content_admin', 'moderation'),
  ('content_admin', 'reviews'),
  ('finance_admin', 'financial'),
  ('finance_admin', 'payouts'),
  ('analytics_admin', 'analytics'),
  ('analytics_admin', 'reports')
ON CONFLICT DO NOTHING;

-- User Impersonation Log
CREATE TABLE IF NOT EXISTS public.impersonation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  reason TEXT
);

ALTER TABLE public.impersonation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage impersonation sessions" ON public.impersonation_sessions
  FOR ALL USING (is_admin_secure());

-- Generate ticket number function
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  next_number INTEGER;
  ticket_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM support_tickets
  WHERE ticket_number LIKE 'TKT-%';
  
  ticket_num := 'TKT-' || LPAD(next_number::TEXT, 6, '0');
  RETURN ticket_num;
END;
$$;

-- Trigger for auto ticket number
CREATE OR REPLACE FUNCTION public.set_ticket_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_ticket_number_trigger ON public.support_tickets;
CREATE TRIGGER set_ticket_number_trigger
  BEFORE INSERT ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.set_ticket_number();

-- Update timestamps triggers
CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
