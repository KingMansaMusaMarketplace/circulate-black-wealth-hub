CREATE TABLE public.sponsor_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_key text NOT NULL,
  tier_name text NOT NULL,
  annual_amount_cents bigint NOT NULL DEFAULT 0,
  payment_schedule text NOT NULL DEFAULT 'annual',
  installment_amount_cents bigint NOT NULL DEFAULT 0,
  company_name text NOT NULL,
  company_website text,
  billing_address text NOT NULL,
  contact_name text NOT NULL,
  contact_title text,
  contact_email text NOT NULL,
  contact_phone text,
  po_number text,
  category_exclusivity boolean NOT NULL DEFAULT false,
  signer_name text NOT NULL,
  signer_title text,
  signature_typed_name text NOT NULL,
  agreed_terms boolean NOT NULL DEFAULT false,
  agreement_version text NOT NULL,
  signed_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  status text NOT NULL DEFAULT 'signed',
  stripe_customer_id text,
  stripe_invoice_id text,
  stripe_invoice_url text,
  stripe_invoice_number text,
  invoice_sent_at timestamptz,
  paid_at timestamptz,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.sponsor_agreements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sponsor_agreements TO authenticated;
GRANT ALL ON public.sponsor_agreements TO service_role;

ALTER TABLE public.sponsor_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a signed sponsor agreement"
  ON public.sponsor_agreements FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view sponsor agreements"
  ON public.sponsor_agreements FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update sponsor agreements"
  ON public.sponsor_agreements FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete sponsor agreements"
  ON public.sponsor_agreements FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Server-side pricing + status lockdown on insert
CREATE OR REPLACE FUNCTION public.enforce_sponsor_agreement_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_annual bigint;
  v_divisor int;
BEGIN
  v_annual := CASE NEW.tier_key
    WHEN 'founding_sponsor' THEN 2100000
    WHEN 'bronze' THEN 6000000
    WHEN 'silver' THEN 18000000
    WHEN 'gold' THEN 30000000
    WHEN 'platinum' THEN 60000000
    ELSE NULL
  END;

  IF v_annual IS NULL THEN
    RAISE EXCEPTION 'Invalid sponsorship tier: %', NEW.tier_key;
  END IF;

  IF NEW.payment_schedule NOT IN ('annual', 'quarterly', 'monthly') THEN
    RAISE EXCEPTION 'Invalid payment schedule: %', NEW.payment_schedule;
  END IF;

  v_divisor := CASE NEW.payment_schedule
    WHEN 'annual' THEN 1
    WHEN 'quarterly' THEN 4
    WHEN 'monthly' THEN 12
  END;

  NEW.annual_amount_cents := v_annual;
  NEW.installment_amount_cents := v_annual / v_divisor;

  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.status := 'signed';
    NEW.stripe_customer_id := NULL;
    NEW.stripe_invoice_id := NULL;
    NEW.stripe_invoice_url := NULL;
    NEW.stripe_invoice_number := NULL;
    NEW.invoice_sent_at := NULL;
    NEW.paid_at := NULL;
    NEW.admin_notes := NULL;
    NEW.signed_at := now();
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_sponsor_agreement_insert() FROM PUBLIC, anon;

CREATE TRIGGER trg_sponsor_agreements_insert
  BEFORE INSERT ON public.sponsor_agreements
  FOR EACH ROW EXECUTE FUNCTION public.enforce_sponsor_agreement_insert();

CREATE TRIGGER trg_sponsor_agreements_updated_at
  BEFORE UPDATE ON public.sponsor_agreements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_sponsor_agreements_status ON public.sponsor_agreements (status, created_at DESC);