
-- Pricing config (single row)
CREATE TABLE IF NOT EXISTS public.noire_pricing_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_fare numeric NOT NULL DEFAULT 3.50,
  per_mile_rate numeric NOT NULL DEFAULT 1.75,
  per_minute_rate numeric NOT NULL DEFAULT 0.35,
  minimum_fare numeric NOT NULL DEFAULT 6.00,
  surge_multiplier numeric NOT NULL DEFAULT 1.00,
  platform_fee_pct numeric NOT NULL DEFAULT 20.00,
  is_active boolean NOT NULL DEFAULT true,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.noire_pricing_config ENABLE ROW LEVEL SECURITY;

-- Seed one row if empty
INSERT INTO public.noire_pricing_config (base_fare, per_mile_rate, per_minute_rate, minimum_fare, surge_multiplier, platform_fee_pct)
SELECT 3.50, 1.75, 0.35, 6.00, 1.00, 20.00
WHERE NOT EXISTS (SELECT 1 FROM public.noire_pricing_config);

CREATE POLICY "Anyone can view active pricing"
  ON public.noire_pricing_config FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage pricing config"
  ON public.noire_pricing_config FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Driver payouts
CREATE TABLE IF NOT EXISTS public.noire_driver_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES public.noir_drivers(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  method text,
  reference text,
  notes text,
  paid_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.noire_driver_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage driver payouts"
  ON public.noire_driver_payouts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Drivers view their own payouts"
  ON public.noire_driver_payouts FOR SELECT
  USING (driver_id IN (SELECT id FROM public.noir_drivers WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_noire_driver_payouts_driver ON public.noire_driver_payouts(driver_id);

-- Ride disputes
CREATE TABLE IF NOT EXISTS public.noire_ride_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid NOT NULL REFERENCES public.noir_rides(id) ON DELETE CASCADE,
  filed_by uuid NOT NULL,
  reason text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open',
  resolution_notes text,
  resolved_at timestamptz,
  resolved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.noire_ride_disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all disputes"
  ON public.noire_ride_disputes FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Riders create their own disputes"
  ON public.noire_ride_disputes FOR INSERT
  WITH CHECK (filed_by = auth.uid() AND ride_id IN (SELECT id FROM public.noir_rides WHERE rider_user_id = auth.uid()));

CREATE POLICY "Riders view their own disputes"
  ON public.noire_ride_disputes FOR SELECT
  USING (filed_by = auth.uid());

CREATE POLICY "Drivers view disputes on their rides"
  ON public.noire_ride_disputes FOR SELECT
  USING (ride_id IN (SELECT r.id FROM public.noir_rides r JOIN public.noir_drivers d ON d.id = r.driver_id WHERE d.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_noire_disputes_ride ON public.noire_ride_disputes(ride_id);
CREATE INDEX IF NOT EXISTS idx_noire_disputes_status ON public.noire_ride_disputes(status);

-- Updated_at triggers
CREATE TRIGGER trg_noire_pricing_updated
  BEFORE UPDATE ON public.noire_pricing_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_noire_disputes_updated
  BEFORE UPDATE ON public.noire_ride_disputes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
