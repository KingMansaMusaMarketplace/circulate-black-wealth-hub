-- Create corporate subscriptions table
CREATE TABLE IF NOT EXISTS public.corporate_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'gold')),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'paused')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.corporate_subscriptions ENABLE ROW LEVEL SECURITY;

-- Sponsors can view their own subscription
CREATE POLICY "Sponsors can view their own subscription"
  ON public.corporate_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Sponsors can insert their own subscription
CREATE POLICY "Sponsors can create their own subscription"
  ON public.corporate_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Sponsors can update their own subscription
CREATE POLICY "Sponsors can update their own subscription"
  ON public.corporate_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON public.corporate_subscriptions
  FOR SELECT
  TO authenticated
  USING (is_admin_secure());

-- Create sponsor benefits tracking table
CREATE TABLE IF NOT EXISTS public.sponsor_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.corporate_subscriptions(id) ON DELETE CASCADE,
  benefit_type TEXT NOT NULL,
  benefit_value JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sponsor_benefits ENABLE ROW LEVEL SECURITY;

-- Sponsors can view their benefits
CREATE POLICY "Sponsors can view their benefits"
  ON public.sponsor_benefits
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.corporate_subscriptions
      WHERE id = sponsor_benefits.subscription_id
      AND user_id = auth.uid()
    )
  );

-- Create sponsor impact metrics table
CREATE TABLE IF NOT EXISTS public.sponsor_impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.corporate_subscriptions(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  businesses_supported INTEGER DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  community_reach INTEGER DEFAULT 0,
  economic_impact NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sponsor_impact_metrics ENABLE ROW LEVEL SECURITY;

-- Sponsors can view their metrics
CREATE POLICY "Sponsors can view their metrics"
  ON public.sponsor_impact_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.corporate_subscriptions
      WHERE id = sponsor_impact_metrics.subscription_id
      AND user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_corporate_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_corporate_subscriptions_updated_at
  BEFORE UPDATE ON public.corporate_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_corporate_subscriptions_updated_at();

CREATE TRIGGER update_sponsor_benefits_updated_at
  BEFORE UPDATE ON public.sponsor_benefits
  FOR EACH ROW
  EXECUTE FUNCTION update_corporate_subscriptions_updated_at();