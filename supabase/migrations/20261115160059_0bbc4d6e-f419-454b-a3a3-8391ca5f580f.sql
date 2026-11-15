-- QR bill payments: the business sets the amount; the customer only types the bill code.
CREATE TABLE public.qr_bill_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  bill_code text NOT NULL DEFAULT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
  amount_cents integer NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open',
  created_by uuid NOT NULL DEFAULT auth.uid(),
  checkout_session_id text,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 minutes'),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_id, bill_code)
);

GRANT SELECT, INSERT, UPDATE ON public.qr_bill_requests TO authenticated;
GRANT ALL ON public.qr_bill_requests TO service_role;

ALTER TABLE public.qr_bill_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners and managers see their bills"
  ON public.qr_bill_requests FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND (b.owner_id = auth.uid() OR b.location_manager_id = auth.uid())));

CREATE POLICY "Business owners and managers create bills"
  ON public.qr_bill_requests FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() AND EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND (b.owner_id = auth.uid() OR b.location_manager_id = auth.uid())));

CREATE POLICY "Business owners and managers cancel bills"
  ON public.qr_bill_requests FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND (b.owner_id = auth.uid() OR b.location_manager_id = auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND (b.owner_id = auth.uid() OR b.location_manager_id = auth.uid())));

-- Validation (trigger, not CHECK, so time rules stay restorable).
CREATE OR REPLACE FUNCTION public.qr_bill_requests_validate()
 RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.amount_cents IS NULL OR NEW.amount_cents < 50 OR NEW.amount_cents > 9999999 THEN
      RAISE EXCEPTION 'Bill amount must be between $0.50 and $99,999.99';
    END IF;
    IF NEW.description IS NOT NULL AND length(NEW.description) > 200 THEN
      RAISE EXCEPTION 'Description is too long';
    END IF;
    IF auth.uid() IS NOT NULL THEN
      NEW.status := 'open';
      NEW.checkout_session_id := NULL;
      NEW.created_by := auth.uid();
      NEW.expires_at := now() + interval '30 minutes';
    END IF;
  ELSIF TG_OP = 'UPDATE' AND auth.uid() IS NOT NULL THEN
    -- Owners may only cancel; amount, code, business and payment link never change from the browser.
    IF NEW.status <> 'cancelled' OR NEW.amount_cents <> OLD.amount_cents OR NEW.bill_code <> OLD.bill_code
       OR NEW.business_id <> OLD.business_id OR NEW.checkout_session_id IS DISTINCT FROM OLD.checkout_session_id
       OR NEW.expires_at <> OLD.expires_at OR NEW.created_by <> OLD.created_by THEN
      RAISE EXCEPTION 'Bills can only be cancelled';
    END IF;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.qr_bill_requests_validate() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER qr_bill_requests_validate
  BEFORE INSERT OR UPDATE ON public.qr_bill_requests
  FOR EACH ROW EXECUTE FUNCTION public.qr_bill_requests_validate();

-- Customers look up one open bill by its code (amount + description only).
CREATE OR REPLACE FUNCTION public.get_qr_bill(_business uuid, _code text)
 RETURNS TABLE(amount_cents integer, description text, expires_at timestamptz)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT q.amount_cents, q.description, q.expires_at
  FROM public.qr_bill_requests q
  WHERE auth.uid() IS NOT NULL
    AND q.business_id = _business
    AND q.bill_code = upper(btrim(coalesce(_code, '')))
    AND q.status = 'open'
    AND q.expires_at > now()
  LIMIT 1
$$;
REVOKE EXECUTE ON FUNCTION public.get_qr_bill(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_qr_bill(uuid, text) TO authenticated, service_role;