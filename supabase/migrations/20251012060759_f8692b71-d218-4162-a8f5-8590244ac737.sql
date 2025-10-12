-- Ensure RLS is enabled on corporate_subscriptions
ALTER TABLE corporate_subscriptions ENABLE ROW LEVEL SECURITY;

-- Ensure RLS is enabled on sponsor_impact_metrics  
ALTER TABLE sponsor_impact_metrics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to recreate them)
DROP POLICY IF EXISTS "Sponsors can view their own subscription" ON corporate_subscriptions;
DROP POLICY IF EXISTS "Sponsors can update their own subscription" ON corporate_subscriptions;
DROP POLICY IF EXISTS "Sponsors can view their own metrics" ON sponsor_impact_metrics;

-- Sponsors can view their own subscription
CREATE POLICY "Sponsors can view their own subscription"
ON corporate_subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Sponsors can update their own subscription (logo_url, website_url)
CREATE POLICY "Sponsors can update their own subscription"
ON corporate_subscriptions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Sponsors can view their own impact metrics
CREATE POLICY "Sponsors can view their own metrics"
ON sponsor_impact_metrics FOR SELECT
USING (
  subscription_id IN (
    SELECT id FROM corporate_subscriptions WHERE user_id = auth.uid()
  )
);