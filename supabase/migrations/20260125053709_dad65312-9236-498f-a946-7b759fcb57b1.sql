-- =====================================================
-- PARTNER REFERRAL SYSTEM ENHANCEMENTS
-- =====================================================

-- 1. UTM Tracking columns for partner_referrals
ALTER TABLE public.partner_referrals 
ADD COLUMN IF NOT EXISTS utm_source text,
ADD COLUMN IF NOT EXISTS utm_medium text,
ADD COLUMN IF NOT EXISTS utm_campaign text,
ADD COLUMN IF NOT EXISTS utm_content text,
ADD COLUMN IF NOT EXISTS utm_term text,
ADD COLUMN IF NOT EXISTS landing_page text,
ADD COLUMN IF NOT EXISTS cookie_expires_at timestamp with time zone DEFAULT (now() + interval '30 days');

-- 2. Tiered commission structure for directory_partners
ALTER TABLE public.directory_partners
ADD COLUMN IF NOT EXISTS commission_tier text NOT NULL DEFAULT 'bronze',
ADD COLUMN IF NOT EXISTS tier_updated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS lifetime_referrals integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_bonus_earned numeric(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS cookie_duration_days integer NOT NULL DEFAULT 30,
ADD COLUMN IF NOT EXISTS email_notifications_enabled boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS leaderboard_opt_in boolean NOT NULL DEFAULT true;

-- 3. Create partner_link_clicks for funnel tracking
CREATE TABLE IF NOT EXISTS public.partner_link_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.directory_partners(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  ip_address inet,
  user_agent text,
  referer_url text,
  landing_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  country_code text,
  device_type text,
  converted_to_signup boolean DEFAULT false,
  referral_id uuid REFERENCES public.partner_referrals(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 4. Create partner_leaderboard view
CREATE OR REPLACE VIEW public.partner_leaderboard AS
SELECT 
  dp.id,
  dp.directory_name,
  dp.logo_url,
  dp.commission_tier,
  dp.total_referrals,
  dp.total_conversions,
  dp.total_earnings,
  dp.lifetime_referrals,
  CASE 
    WHEN dp.total_referrals > 0 THEN ROUND((dp.total_conversions::numeric / dp.total_referrals::numeric) * 100, 1)
    ELSE 0 
  END as conversion_rate,
  RANK() OVER (ORDER BY dp.total_earnings DESC) as earnings_rank,
  RANK() OVER (ORDER BY dp.total_referrals DESC) as referrals_rank,
  dp.created_at
FROM public.directory_partners dp
WHERE dp.status = 'active' 
  AND dp.leaderboard_opt_in = true;

-- 5. Create partner_invoices table for payout receipts
CREATE TABLE IF NOT EXISTS public.partner_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.directory_partners(id) ON DELETE CASCADE,
  payout_id uuid REFERENCES public.partner_payouts(id),
  invoice_number text NOT NULL UNIQUE,
  invoice_date date NOT NULL DEFAULT CURRENT_DATE,
  amount numeric(10,2) NOT NULL,
  tax_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,
  line_items jsonb NOT NULL DEFAULT '[]',
  partner_details jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'issued',
  pdf_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 6. Create fraud_detection_log table
CREATE TABLE IF NOT EXISTS public.partner_fraud_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES public.directory_partners(id),
  referral_id uuid REFERENCES public.partner_referrals(id),
  detection_type text NOT NULL,
  severity text NOT NULL DEFAULT 'low',
  details jsonb NOT NULL DEFAULT '{}',
  ip_address inet,
  is_blocked boolean DEFAULT false,
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 7. Create monthly_bonus_config table
CREATE TABLE IF NOT EXISTS public.partner_bonus_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_name text NOT NULL,
  referrals_required integer NOT NULL,
  bonus_amount numeric(10,2) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert default milestone bonuses
INSERT INTO public.partner_bonus_milestones (milestone_name, referrals_required, bonus_amount) VALUES
  ('First 10 Referrals', 10, 50.00),
  ('25 Club', 25, 150.00),
  ('50 Club', 50, 400.00),
  ('Century Partner', 100, 1000.00)
ON CONFLICT DO NOTHING;

-- 8. Function to update partner commission tier
CREATE OR REPLACE FUNCTION public.update_partner_commission_tier(p_partner_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lifetime_referrals integer;
  v_new_tier text;
  v_new_flat_fee numeric;
  v_new_rev_share numeric;
BEGIN
  SELECT lifetime_referrals INTO v_lifetime_referrals
  FROM directory_partners WHERE id = p_partner_id;
  
  -- Tier thresholds
  IF v_lifetime_referrals >= 100 THEN
    v_new_tier := 'platinum';
    v_new_flat_fee := 10.00;
    v_new_rev_share := 20.00;
  ELSIF v_lifetime_referrals >= 50 THEN
    v_new_tier := 'gold';
    v_new_flat_fee := 8.00;
    v_new_rev_share := 15.00;
  ELSIF v_lifetime_referrals >= 20 THEN
    v_new_tier := 'silver';
    v_new_flat_fee := 6.00;
    v_new_rev_share := 12.00;
  ELSE
    v_new_tier := 'bronze';
    v_new_flat_fee := 5.00;
    v_new_rev_share := 10.00;
  END IF;
  
  UPDATE directory_partners
  SET 
    commission_tier = v_new_tier,
    flat_fee_per_signup = v_new_flat_fee,
    revenue_share_percent = v_new_rev_share,
    tier_updated_at = now(),
    updated_at = now()
  WHERE id = p_partner_id 
    AND commission_tier != v_new_tier;
END;
$$;

-- 9. Function to check for fraud patterns
CREATE OR REPLACE FUNCTION public.check_partner_referral_fraud()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_duplicate_count integer;
  v_same_ip_count integer;
  v_fraud_detected boolean := false;
  v_detection_type text;
  v_severity text := 'low';
BEGIN
  -- Check for duplicate email within 24 hours
  SELECT COUNT(*) INTO v_duplicate_count
  FROM partner_referrals
  WHERE referred_email = NEW.referred_email
    AND partner_id = NEW.partner_id
    AND id != NEW.id
    AND created_at > now() - interval '24 hours';
  
  IF v_duplicate_count > 0 THEN
    v_fraud_detected := true;
    v_detection_type := 'duplicate_email';
    v_severity := 'medium';
  END IF;
  
  -- Check for self-referral (partner's own email)
  IF EXISTS (
    SELECT 1 FROM directory_partners 
    WHERE id = NEW.partner_id 
    AND contact_email = NEW.referred_email
  ) THEN
    v_fraud_detected := true;
    v_detection_type := 'self_referral';
    v_severity := 'high';
  END IF;
  
  -- Check for suspicious IP patterns (>5 referrals from same IP in 1 hour)
  IF NEW.ip_address IS NOT NULL THEN
    SELECT COUNT(*) INTO v_same_ip_count
    FROM partner_referrals
    WHERE ip_address = NEW.ip_address
      AND partner_id = NEW.partner_id
      AND created_at > now() - interval '1 hour';
    
    IF v_same_ip_count >= 5 THEN
      v_fraud_detected := true;
      v_detection_type := 'ip_abuse';
      v_severity := 'high';
    END IF;
  END IF;
  
  -- Log fraud if detected
  IF v_fraud_detected THEN
    INSERT INTO partner_fraud_log (
      partner_id, referral_id, detection_type, severity, 
      ip_address, details
    ) VALUES (
      NEW.partner_id, NEW.id, v_detection_type, v_severity,
      NEW.ip_address, 
      jsonb_build_object(
        'referred_email', NEW.referred_email,
        'duplicate_count', v_duplicate_count,
        'same_ip_count', v_same_ip_count
      )
    );
    
    -- Block high severity fraud
    IF v_severity = 'high' THEN
      NEW.status := 'blocked';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for fraud detection
DROP TRIGGER IF EXISTS check_referral_fraud ON public.partner_referrals;
CREATE TRIGGER check_referral_fraud
  BEFORE INSERT ON public.partner_referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.check_partner_referral_fraud();

-- 10. Function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_partner_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number integer;
  invoice_num text;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 8) AS INTEGER)), 0) + 1
  INTO next_number
  FROM partner_invoices
  WHERE invoice_number LIKE 'PINV-%';
  
  invoice_num := 'PINV-' || TO_CHAR(NOW(), 'YYMM') || '-' || LPAD(next_number::TEXT, 5, '0');
  RETURN invoice_num;
END;
$$;

-- 11. RLS Policies

-- partner_link_clicks
ALTER TABLE public.partner_link_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their own clicks"
  ON public.partner_link_clicks FOR SELECT
  USING (partner_id IN (
    SELECT id FROM directory_partners WHERE user_id = auth.uid()
  ));

CREATE POLICY "System can insert clicks"
  ON public.partner_link_clicks FOR INSERT
  WITH CHECK (true);

-- partner_invoices
ALTER TABLE public.partner_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their own invoices"
  ON public.partner_invoices FOR SELECT
  USING (partner_id IN (
    SELECT id FROM directory_partners WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage invoices"
  ON public.partner_invoices FOR ALL
  USING (is_admin_secure());

-- partner_fraud_log
ALTER TABLE public.partner_fraud_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view fraud logs"
  ON public.partner_fraud_log FOR SELECT
  USING (is_admin_secure());

-- partner_bonus_milestones (public read)
ALTER TABLE public.partner_bonus_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view milestones"
  ON public.partner_bonus_milestones FOR SELECT
  USING (is_active = true);

-- partner_leaderboard view (public for opted-in partners)
GRANT SELECT ON public.partner_leaderboard TO authenticated, anon;

-- 12. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_partner_clicks_partner_id ON public.partner_link_clicks(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_clicks_created_at ON public.partner_link_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_partner_clicks_referral_code ON public.partner_link_clicks(referral_code);
CREATE INDEX IF NOT EXISTS idx_partner_referrals_utm ON public.partner_referrals(utm_source, utm_campaign);
CREATE INDEX IF NOT EXISTS idx_partner_invoices_partner_id ON public.partner_invoices(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_fraud_partner_id ON public.partner_fraud_log(partner_id);