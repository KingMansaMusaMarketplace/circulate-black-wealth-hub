-- Community wealth aggregate stats (single row)
CREATE TABLE IF NOT EXISTS public.community_wealth_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_verified_spending numeric DEFAULT 0,
  verified_transaction_count integer DEFAULT 0,
  economic_impact numeric DEFAULT 0,
  last_transaction_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Verified transaction audit trail
CREATE TABLE IF NOT EXISTS public.verified_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric NOT NULL,
  business_id uuid REFERENCES businesses(id) ON DELETE SET NULL,
  stripe_session_id text,
  customer_email text,
  verified_at timestamptz DEFAULT now()
);

-- Add revenue tracking columns to businesses if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'total_revenue_tracked') THEN
    ALTER TABLE businesses ADD COLUMN total_revenue_tracked numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'transaction_count') THEN
    ALTER TABLE businesses ADD COLUMN transaction_count integer DEFAULT 0;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.community_wealth_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_transactions ENABLE ROW LEVEL SECURITY;

-- Public read access for the wealth ticker
CREATE POLICY "Anyone can view community wealth stats"
  ON public.community_wealth_stats FOR SELECT
  USING (true);

-- Service role manages wealth stats
CREATE POLICY "Service role manages wealth stats"
  ON public.community_wealth_stats FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can view verified transactions
CREATE POLICY "Admins can view verified transactions"
  ON public.verified_transactions FOR SELECT
  TO authenticated
  USING (public.is_admin_secure());

-- Service role manages verified transactions
CREATE POLICY "Service role manages verified transactions"
  ON public.verified_transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed the single aggregate row if empty
INSERT INTO community_wealth_stats (id, total_verified_spending, verified_transaction_count, economic_impact)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Enable realtime on community_wealth_stats for live ticker updates
ALTER PUBLICATION supabase_realtime ADD TABLE community_wealth_stats;

-- Function to increment community wealth metrics from verified Stripe transactions
CREATE OR REPLACE FUNCTION public.increment_community_wealth(
  p_amount numeric,
  p_business_id uuid DEFAULT NULL,
  p_stripe_session_id text DEFAULT NULL,
  p_customer_email text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_multiplier numeric := 6.0;
BEGIN
  -- Update aggregate stats
  UPDATE community_wealth_stats SET
    total_verified_spending = total_verified_spending + p_amount,
    verified_transaction_count = verified_transaction_count + 1,
    economic_impact = (total_verified_spending + p_amount) * v_multiplier,
    last_transaction_at = now(),
    updated_at = now()
  WHERE id = '00000000-0000-0000-0000-000000000001'::uuid;

  -- Audit trail
  INSERT INTO verified_transactions (amount, business_id, stripe_session_id, customer_email, verified_at)
  VALUES (p_amount, p_business_id, p_stripe_session_id, p_customer_email, now());

  -- Per-business stats
  IF p_business_id IS NOT NULL THEN
    UPDATE businesses
    SET total_revenue_tracked = COALESCE(total_revenue_tracked, 0) + p_amount,
        transaction_count = COALESCE(transaction_count, 0) + 1
    WHERE id = p_business_id;
  END IF;
END;
$$;