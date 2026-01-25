-- Add payment tracking fields to partner_referrals
ALTER TABLE public.partner_referrals
ADD COLUMN IF NOT EXISTS referred_business_first_payment_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS referred_business_subscription_id text;

-- Create a function to credit a referral when the referred business makes their first payment
-- This will be called by a webhook or admin action when payment is received
CREATE OR REPLACE FUNCTION public.credit_partner_referral_on_payment(
  p_referral_id uuid,
  p_payment_amount numeric DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referral partner_referrals%ROWTYPE;
  v_partner directory_partners%ROWTYPE;
  v_flat_fee numeric;
  v_revenue_share numeric;
  v_total_earned numeric;
BEGIN
  -- Get the referral
  SELECT * INTO v_referral FROM partner_referrals WHERE id = p_referral_id;
  
  IF v_referral IS NULL THEN
    RAISE EXCEPTION 'Referral not found';
  END IF;
  
  -- Don't process if already credited or paid
  IF v_referral.status IN ('credited', 'paid') THEN
    RETURN;
  END IF;
  
  -- Get the partner's commission rates
  SELECT * INTO v_partner FROM directory_partners WHERE id = v_referral.partner_id;
  
  IF v_partner IS NULL THEN
    RAISE EXCEPTION 'Partner not found';
  END IF;
  
  -- Calculate earnings
  v_flat_fee := v_partner.flat_fee_per_signup;
  v_revenue_share := COALESCE(p_payment_amount * (v_partner.revenue_share_percent / 100), 0);
  v_total_earned := v_flat_fee + v_revenue_share;
  
  -- Update the referral to credited status
  UPDATE partner_referrals
  SET 
    is_converted = true,
    converted_at = COALESCE(converted_at, NOW()),
    conversion_type = 'first_payment',
    flat_fee_earned = v_flat_fee,
    revenue_share_earned = v_revenue_share,
    total_earned = v_total_earned,
    status = 'credited',
    credited_at = NOW(),
    referred_business_first_payment_at = NOW(),
    updated_at = NOW()
  WHERE id = p_referral_id;
  
  -- Update partner's totals
  UPDATE directory_partners
  SET 
    total_conversions = total_conversions + 1,
    total_earnings = total_earnings + v_total_earned,
    pending_earnings = pending_earnings + v_total_earned,
    updated_at = NOW()
  WHERE id = v_referral.partner_id;
END;
$$;

-- Create a function to mark referral as signup (pending, not yet credited)
CREATE OR REPLACE FUNCTION public.record_partner_referral_signup(
  p_partner_id uuid,
  p_email text,
  p_business_name text DEFAULT NULL,
  p_business_id uuid DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_partner directory_partners%ROWTYPE;
  v_referral_id uuid;
BEGIN
  -- Get the partner
  SELECT * INTO v_partner FROM directory_partners WHERE id = p_partner_id;
  
  IF v_partner IS NULL THEN
    RAISE EXCEPTION 'Partner not found';
  END IF;
  
  -- Create the referral in pending status (no earnings yet)
  INSERT INTO partner_referrals (
    partner_id,
    referred_email,
    referred_business_name,
    referred_business_id,
    referred_user_id,
    referral_code,
    is_converted,
    conversion_type,
    flat_fee_earned,
    revenue_share_earned,
    total_earned,
    status
  ) VALUES (
    p_partner_id,
    p_email,
    p_business_name,
    p_business_id,
    p_user_id,
    v_partner.referral_code,
    false,  -- Not converted until first payment
    NULL,
    0,      -- No earnings until payment
    0,
    0,
    'pending'
  )
  RETURNING id INTO v_referral_id;
  
  -- Update partner's referral count (but not conversions or earnings)
  UPDATE directory_partners
  SET 
    total_referrals = total_referrals + 1,
    updated_at = NOW()
  WHERE id = p_partner_id;
  
  RETURN v_referral_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.credit_partner_referral_on_payment(uuid, numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_partner_referral_signup(uuid, text, text, uuid, uuid) TO authenticated;

-- Add comment explaining the payment-triggered model
COMMENT ON FUNCTION public.credit_partner_referral_on_payment IS 
'Credits a partner referral when the referred business makes their first payment. 
This ensures partners are only paid after revenue is received, keeping cash flow positive.';