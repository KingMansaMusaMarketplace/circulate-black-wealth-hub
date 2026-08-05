
-- 1. Claim fields on businesses
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS claim_token text,
  ADD COLUMN IF NOT EXISTS claim_token_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS claim_status text NOT NULL DEFAULT 'unclaimed',
  ADD COLUMN IF NOT EXISTS claimed_at timestamptz,
  ADD COLUMN IF NOT EXISTS claim_invited_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS businesses_claim_token_uidx
  ON public.businesses (claim_token) WHERE claim_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS businesses_claim_status_idx
  ON public.businesses (claim_status, listing_status);

-- 2. Campaigns
CREATE TABLE IF NOT EXISTS public.business_claim_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  target_city text,
  target_state text,
  target_category text,
  daily_limit integer NOT NULL DEFAULT 200,
  status text NOT NULL DEFAULT 'draft',
  total_sent integer NOT NULL DEFAULT 0,
  total_opened integer NOT NULL DEFAULT 0,
  total_claimed integer NOT NULL DEFAULT 0,
  last_run_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_claim_campaigns TO authenticated;
GRANT ALL ON public.business_claim_campaigns TO service_role;
ALTER TABLE public.business_claim_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage claim campaigns" ON public.business_claim_campaigns
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Invites
CREATE TABLE IF NOT EXISTS public.business_claim_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.business_claim_campaigns(id) ON DELETE SET NULL,
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'sent',
  error_message text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  opened_at timestamptz,
  claimed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS business_claim_invites_business_idx ON public.business_claim_invites (business_id);
CREATE INDEX IF NOT EXISTS business_claim_invites_campaign_idx ON public.business_claim_invites (campaign_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_claim_invites TO authenticated;
GRANT ALL ON public.business_claim_invites TO service_role;
ALTER TABLE public.business_claim_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage claim invites" ON public.business_claim_invites
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Opt-outs (CAN-SPAM)
CREATE TABLE IF NOT EXISTS public.claim_email_optouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.claim_email_optouts TO authenticated;
GRANT ALL ON public.claim_email_optouts TO service_role;
ALTER TABLE public.claim_email_optouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read optouts" ON public.claim_email_optouts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage optouts" ON public.claim_email_optouts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at triggers
CREATE TRIGGER trg_claim_campaigns_updated_at BEFORE UPDATE ON public.business_claim_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_claim_invites_updated_at BEFORE UPDATE ON public.business_claim_invites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Verify a directory claim token (public, safe subset)
CREATE OR REPLACE FUNCTION public.verify_business_claim_token(p_token text)
RETURNS TABLE(business_id uuid, business_name text, city text, state text, category text, is_valid boolean, is_expired boolean)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT b.id, b.business_name, b.city, b.state, b.category,
    (b.claim_token = p_token AND b.claim_token_expires_at > now() AND b.claim_status <> 'claimed') AS is_valid,
    (b.claim_token = p_token AND b.claim_token_expires_at <= now()) AS is_expired
  FROM public.businesses b
  WHERE b.claim_token = p_token
  LIMIT 1;
END; $$;

REVOKE EXECUTE ON FUNCTION public.verify_business_claim_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_business_claim_token(text) TO anon, authenticated, service_role;

-- 6. Claim a directory business (signed-in users only)
CREATE OR REPLACE FUNCTION public.claim_directory_business(p_token text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_biz RECORD;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'You must be signed in to claim a listing');
  END IF;

  SELECT * INTO v_biz FROM public.businesses
  WHERE claim_token = p_token
    AND claim_token_expires_at > now()
    AND claim_status <> 'claimed'
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'This claim link is invalid, expired, or already used');
  END IF;

  UPDATE public.businesses
  SET owner_id = v_uid,
      claim_status = 'claimed',
      claimed_at = now(),
      claim_token = NULL,
      claim_token_expires_at = NULL
  WHERE id = v_biz.id;

  UPDATE public.business_claim_invites
  SET claimed_at = now(), status = 'claimed'
  WHERE business_id = v_biz.id AND claimed_at IS NULL;

  RETURN jsonb_build_object('success', true, 'business_id', v_biz.id, 'business_name', v_biz.business_name);
END; $$;

REVOKE EXECUTE ON FUNCTION public.claim_directory_business(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_directory_business(text) TO authenticated, service_role;

-- 7. One-click unsubscribe (no auth required)
CREATE OR REPLACE FUNCTION public.claim_email_unsubscribe(p_email text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF p_email IS NULL OR p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid email');
  END IF;
  INSERT INTO public.claim_email_optouts (email, reason)
  VALUES (lower(trim(p_email)), 'one_click_unsubscribe')
  ON CONFLICT (email) DO NOTHING;
  RETURN jsonb_build_object('success', true);
END; $$;

REVOKE EXECUTE ON FUNCTION public.claim_email_unsubscribe(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_email_unsubscribe(text) TO anon, authenticated, service_role;
