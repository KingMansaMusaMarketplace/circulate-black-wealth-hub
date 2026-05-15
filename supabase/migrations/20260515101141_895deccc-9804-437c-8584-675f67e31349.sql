CREATE TABLE IF NOT EXISTS public.host_payout_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL UNIQUE,
  method_type text NOT NULL DEFAULT 'bank_transfer',
  account_holder_name text,
  bank_name text,
  account_last4 text,
  routing_last4 text,
  stripe_account_id text,
  paypal_email text,
  notes text,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.host_payout_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hosts manage own payout method"
ON public.host_payout_methods FOR ALL
USING (auth.uid() = host_id)
WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Admins view all payout methods"
ON public.host_payout_methods FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update payout methods"
ON public.host_payout_methods FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_host_payout_methods_updated_at
BEFORE UPDATE ON public.host_payout_methods
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();