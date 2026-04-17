
-- Tracked visits (no money moves; ROI only)
CREATE TABLE IF NOT EXISTS public.tracked_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL,
  qr_scan_id uuid,
  qr_code_id uuid,
  reported_amount numeric(10,2) NOT NULL CHECK (reported_amount >= 0 AND reported_amount <= 99999.99),
  discount_percentage integer NOT NULL DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','disputed','expired')),
  confirmed_at timestamptz,
  confirmed_by_method text CHECK (confirmed_by_method IN ('cashier_pin','business_owner','auto')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tracked_visits_business ON public.tracked_visits(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracked_visits_customer ON public.tracked_visits(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracked_visits_status ON public.tracked_visits(status);

ALTER TABLE public.tracked_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can create their own visits"
ON public.tracked_visits FOR INSERT TO authenticated
WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can view their own visits"
ON public.tracked_visits FOR SELECT TO authenticated
USING (customer_id = auth.uid());

CREATE POLICY "Business owners can view their visits"
ON public.tracked_visits FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = tracked_visits.business_id AND b.owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can update their visits"
ON public.tracked_visits FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = tracked_visits.business_id AND b.owner_id = auth.uid()
  )
);

-- Cashier PINs (per business)
CREATE TABLE IF NOT EXISTS public.business_cashier_pins (
  business_id uuid PRIMARY KEY REFERENCES public.businesses(id) ON DELETE CASCADE,
  pin_hash text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.business_cashier_pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage their cashier PIN"
ON public.business_cashier_pins FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_cashier_pins.business_id AND b.owner_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_cashier_pins.business_id AND b.owner_id = auth.uid())
);

-- Verify a PIN server-side (called by edge function with service role)
CREATE OR REPLACE FUNCTION public.verify_cashier_pin(p_business_id uuid, p_pin text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_hash text;
BEGIN
  SELECT pin_hash INTO v_hash FROM public.business_cashier_pins WHERE business_id = p_business_id;
  IF v_hash IS NULL THEN
    RETURN false;
  END IF;
  RETURN v_hash = encode(extensions.digest(p_pin || p_business_id::text, 'sha256'), 'hex');
END;
$$;

-- Helper to set/update PIN safely (hashed)
CREATE OR REPLACE FUNCTION public.set_cashier_pin(p_business_id uuid, p_pin text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.businesses WHERE id = p_business_id AND owner_id = auth.uid()) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;
  IF p_pin !~ '^[0-9]{4,6}$' THEN
    RAISE EXCEPTION 'invalid_pin_format';
  END IF;
  INSERT INTO public.business_cashier_pins (business_id, pin_hash, updated_by)
  VALUES (p_business_id, encode(extensions.digest(p_pin || p_business_id::text, 'sha256'), 'hex'), auth.uid())
  ON CONFLICT (business_id) DO UPDATE
  SET pin_hash = EXCLUDED.pin_hash, updated_at = now(), updated_by = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.tracked_visits_touch()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_tracked_visits_touch ON public.tracked_visits;
CREATE TRIGGER trg_tracked_visits_touch
BEFORE UPDATE ON public.tracked_visits
FOR EACH ROW EXECUTE FUNCTION public.tracked_visits_touch();
