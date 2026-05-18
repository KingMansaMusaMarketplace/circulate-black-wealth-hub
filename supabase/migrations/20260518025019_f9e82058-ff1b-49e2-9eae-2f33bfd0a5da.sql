-- 1. Extend vacation_properties with lease fields
ALTER TABLE public.vacation_properties
  ADD COLUMN IF NOT EXISTS monthly_rent NUMERIC,
  ADD COLUMN IF NOT EXISTS lease_term_months INTEGER DEFAULT 12,
  ADD COLUMN IF NOT EXISTS security_deposit_amount NUMERIC,
  ADD COLUMN IF NOT EXISTS pet_deposit NUMERIC,
  ADD COLUMN IF NOT EXISTS utilities_included TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS section_8_accepted BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS min_credit_score INTEGER,
  ADD COLUMN IF NOT EXISTS min_income_multiplier NUMERIC DEFAULT 3,
  ADD COLUMN IF NOT EXISTS available_from DATE,
  ADD COLUMN IF NOT EXISTS furnished BOOLEAN DEFAULT false;

-- Update listing_mode check constraint to allow 'yearly_lease'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name LIKE '%listing_mode%'
  ) THEN
    EXECUTE (
      SELECT 'ALTER TABLE public.vacation_properties DROP CONSTRAINT ' || quote_ident(constraint_name)
      FROM information_schema.check_constraints
      WHERE constraint_name LIKE '%listing_mode%'
      LIMIT 1
    );
  END IF;
END $$;

ALTER TABLE public.vacation_properties
  ADD CONSTRAINT vacation_properties_listing_mode_check
  CHECK (listing_mode IN ('nightly', 'monthly', 'both', 'yearly_lease'));

CREATE INDEX IF NOT EXISTS idx_vacation_properties_yearly_lease
  ON public.vacation_properties (listing_mode, city, state)
  WHERE listing_mode = 'yearly_lease' AND is_active = true;

-- 2. lease_inquiries
CREATE TABLE IF NOT EXISTS public.lease_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
  tenant_id UUID,
  tenant_name TEXT NOT NULL,
  tenant_email TEXT NOT NULL,
  tenant_phone TEXT,
  desired_move_in DATE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','accepted','rejected','closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lease_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can create lease inquiries"
  ON public.lease_inquiries FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Tenants see their own inquiries"
  ON public.lease_inquiries FOR SELECT
  TO authenticated
  USING (tenant_id = auth.uid());

CREATE POLICY "Landlords see inquiries on their properties"
  ON public.lease_inquiries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.vacation_properties vp
      WHERE vp.id = lease_inquiries.property_id AND vp.host_id = auth.uid()
    )
  );

CREATE POLICY "Landlords update inquiries on their properties"
  ON public.lease_inquiries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.vacation_properties vp
      WHERE vp.id = lease_inquiries.property_id AND vp.host_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_lease_inquiries_property ON public.lease_inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_lease_inquiries_tenant ON public.lease_inquiries(tenant_id);

-- 3. lease_agreements
CREATE TABLE IF NOT EXISTS public.lease_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE RESTRICT,
  inquiry_id UUID REFERENCES public.lease_inquiries(id) ON DELETE SET NULL,
  landlord_id UUID NOT NULL,
  tenant_id UUID,
  tenant_email TEXT NOT NULL,
  tenant_name TEXT NOT NULL,
  tenant_confirm_token TEXT UNIQUE,
  lease_start_date DATE NOT NULL,
  lease_end_date DATE,
  monthly_rent NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_tenant_confirm'
    CHECK (status IN ('pending_tenant_confirm','pending_landlord_confirm','confirmed','cancelled','refunded')),
  landlord_confirmed_at TIMESTAMPTZ,
  tenant_confirmed_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  fee_amount NUMERIC NOT NULL DEFAULT 99,
  fee_currency TEXT NOT NULL DEFAULT 'usd',
  fee_charged_at TIMESTAMPTZ,
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  refund_eligible_until TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lease_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Landlords manage their own lease agreements"
  ON public.lease_agreements FOR ALL
  TO authenticated
  USING (landlord_id = auth.uid())
  WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Tenants see lease agreements where they are the tenant"
  ON public.lease_agreements FOR SELECT
  TO authenticated
  USING (tenant_id = auth.uid());

CREATE POLICY "Tenants can update confirmation on their own agreement"
  ON public.lease_agreements FOR UPDATE
  TO authenticated
  USING (tenant_id = auth.uid())
  WITH CHECK (tenant_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_lease_agreements_landlord ON public.lease_agreements(landlord_id);
CREATE INDEX IF NOT EXISTS idx_lease_agreements_tenant ON public.lease_agreements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lease_agreements_property ON public.lease_agreements(property_id);
CREATE INDEX IF NOT EXISTS idx_lease_agreements_token ON public.lease_agreements(tenant_confirm_token);

-- 4. lease_fee_refunds (audit)
CREATE TABLE IF NOT EXISTS public.lease_fee_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lease_agreement_id UUID NOT NULL REFERENCES public.lease_agreements(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL,
  refund_amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  stripe_refund_id TEXT,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing','succeeded','failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lease_fee_refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Landlords see their own refunds"
  ON public.lease_fee_refunds FOR SELECT
  TO authenticated
  USING (landlord_id = auth.uid());

-- 5. Triggers for updated_at
CREATE TRIGGER trg_lease_inquiries_updated_at
  BEFORE UPDATE ON public.lease_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_lease_agreements_updated_at
  BEFORE UPDATE ON public.lease_agreements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Public-safe lease listings view function for browse
CREATE OR REPLACE FUNCTION public.search_lease_listings(
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_min_rent NUMERIC DEFAULT NULL,
  p_max_rent NUMERIC DEFAULT NULL,
  p_bedrooms INTEGER DEFAULT NULL,
  p_pets BOOLEAN DEFAULT NULL,
  p_section_8 BOOLEAN DEFAULT NULL,
  p_available_by DATE DEFAULT NULL,
  p_furnished BOOLEAN DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
) RETURNS SETOF public.vacation_properties
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT *
  FROM public.vacation_properties
  WHERE listing_mode = 'yearly_lease'
    AND is_active = true
    AND (p_city IS NULL OR city ILIKE '%' || p_city || '%')
    AND (p_state IS NULL OR state ILIKE p_state)
    AND (p_min_rent IS NULL OR monthly_rent >= p_min_rent)
    AND (p_max_rent IS NULL OR monthly_rent <= p_max_rent)
    AND (p_bedrooms IS NULL OR bedrooms >= p_bedrooms)
    AND (p_pets IS NULL OR pets_allowed = p_pets)
    AND (p_section_8 IS NULL OR section_8_accepted = p_section_8)
    AND (p_available_by IS NULL OR available_from <= p_available_by)
    AND (p_furnished IS NULL OR furnished = p_furnished)
  ORDER BY is_verified DESC, created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;