
-- Fix overly permissive RLS policies on Kayla AI tables
-- Replace authenticated-role "system" policies with service_role-only policies
-- Add owner-scoped read policies for business owners

-- 1. kayla_grant_matches
DROP POLICY IF EXISTS "System can manage grant matches" ON kayla_grant_matches;
CREATE POLICY "service_role_manage_grant_matches"
  ON kayla_grant_matches FOR ALL TO service_role
  USING (true) WITH CHECK (true);
CREATE POLICY "business_owners_read_grant_matches"
  ON kayla_grant_matches FOR SELECT TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- 2. kayla_cashflow_forecasts
DROP POLICY IF EXISTS "System can manage forecasts" ON kayla_cashflow_forecasts;
CREATE POLICY "service_role_manage_forecasts"
  ON kayla_cashflow_forecasts FOR ALL TO service_role
  USING (true) WITH CHECK (true);
CREATE POLICY "business_owners_read_forecasts"
  ON kayla_cashflow_forecasts FOR SELECT TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- 3. kayla_price_recommendations
DROP POLICY IF EXISTS "System can manage price recommendations" ON kayla_price_recommendations;
CREATE POLICY "service_role_manage_price_recommendations"
  ON kayla_price_recommendations FOR ALL TO service_role
  USING (true) WITH CHECK (true);
CREATE POLICY "business_owners_read_price_recommendations"
  ON kayla_price_recommendations FOR SELECT TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- 4. kayla_reminders_sent
DROP POLICY IF EXISTS "System can manage sent reminders" ON kayla_reminders_sent;
CREATE POLICY "service_role_manage_sent_reminders"
  ON kayla_reminders_sent FOR ALL TO service_role
  USING (true) WITH CHECK (true);
CREATE POLICY "business_owners_read_sent_reminders"
  ON kayla_reminders_sent FOR SELECT TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- 5. kayla_email_sends
DROP POLICY IF EXISTS "System can manage email sends" ON kayla_email_sends;
CREATE POLICY "service_role_manage_email_sends"
  ON kayla_email_sends FOR ALL TO service_role
  USING (true) WITH CHECK (true);
CREATE POLICY "business_owners_read_email_sends"
  ON kayla_email_sends FOR SELECT TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
