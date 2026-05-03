-- Drop any partial businesses_private from the failed prior attempt
DROP TABLE IF EXISTS public.businesses_private CASCADE;
DROP TABLE IF EXISTS public.b2b_external_leads_private CASCADE;

-- =========================================================
-- 1. BUSINESSES private companion table
-- =========================================================
CREATE TABLE public.businesses_private (
  business_id uuid PRIMARY KEY REFERENCES public.businesses(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  email text,
  phone text,
  total_revenue_tracked numeric,
  transaction_count integer,
  latitude numeric,
  longitude numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.businesses_private (business_id, owner_id, email, phone, total_revenue_tracked, transaction_count, latitude, longitude)
SELECT id, owner_id, email, phone, total_revenue_tracked, transaction_count, latitude, longitude
FROM public.businesses
WHERE owner_id IS NOT NULL;

ALTER TABLE public.businesses_private ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their private business data"
ON public.businesses_private FOR SELECT TO authenticated
USING (owner_id = auth.uid() OR public.is_admin_secure());

CREATE POLICY "Owners can update their private business data"
ON public.businesses_private FOR UPDATE TO authenticated
USING (owner_id = auth.uid() OR public.is_admin_secure())
WITH CHECK (owner_id = auth.uid() OR public.is_admin_secure());

CREATE POLICY "Owners can insert their private business data"
ON public.businesses_private FOR INSERT TO authenticated
WITH CHECK (owner_id = auth.uid() OR public.is_admin_secure());

COMMENT ON TABLE public.businesses_private IS 'Private fields for businesses. Owners + admins only. Use this instead of public.businesses for email/phone/revenue/coords.';

-- =========================================================
-- 2. investor_access_log: fix INSERT policy
-- =========================================================
DROP POLICY IF EXISTS "Service role can insert access logs" ON public.investor_access_log;
DROP POLICY IF EXISTS "Admins and service role can insert access logs" ON public.investor_access_log;
CREATE POLICY "Admins and service role can insert access logs"
ON public.investor_access_log FOR INSERT TO authenticated, anon, service_role
WITH CHECK (
  public.is_admin_secure()
  OR auth.role() = 'service_role'
  OR current_setting('request.jwt.claim.role', true) = 'service_role'
);

-- =========================================================
-- 3. vacation_bookings: prevent guest_email spoofing
-- =========================================================
CREATE OR REPLACE FUNCTION public.enforce_vacation_booking_guest_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  authed_email text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT email INTO authed_email FROM auth.users WHERE id = auth.uid();

  IF authed_email IS NOT NULL AND NEW.guest_email IS DISTINCT FROM authed_email THEN
    NEW.guest_email := authed_email;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_vacation_booking_guest_email_trg ON public.vacation_bookings;
CREATE TRIGGER enforce_vacation_booking_guest_email_trg
BEFORE INSERT OR UPDATE ON public.vacation_bookings
FOR EACH ROW EXECUTE FUNCTION public.enforce_vacation_booking_guest_email();

-- =========================================================
-- 4. noir_drivers: remove duplicate SELECT policy, tighten INSERT
-- =========================================================
DROP POLICY IF EXISTS "Drivers can view own record" ON public.noir_drivers;

DROP POLICY IF EXISTS "Drivers can insert own profile" ON public.noir_drivers;
CREATE POLICY "Drivers can insert own profile"
ON public.noir_drivers FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- =========================================================
-- 5. b2b_external_leads private companion table
-- =========================================================
CREATE TABLE public.b2b_external_leads_private (
  lead_id uuid PRIMARY KEY REFERENCES public.b2b_external_leads(id) ON DELETE CASCADE,
  owner_email text,
  owner_name text,
  phone_number text,
  contact_info jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.b2b_external_leads_private (lead_id, owner_email, owner_name, phone_number, contact_info)
SELECT id, owner_email, owner_name, phone_number, contact_info
FROM public.b2b_external_leads;

ALTER TABLE public.b2b_external_leads_private ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view lead PII"
ON public.b2b_external_leads_private FOR SELECT TO authenticated
USING (public.is_admin_secure());

CREATE POLICY "Admins can manage lead PII"
ON public.b2b_external_leads_private FOR ALL TO authenticated
USING (public.is_admin_secure())
WITH CHECK (public.is_admin_secure());

COMMENT ON TABLE public.b2b_external_leads_private IS 'GDPR/CCPA-sensitive PII for scraped B2B leads. Admins only.';
