-- Add explicit anonymous access denial policies to all sensitive tables
-- This prevents any public access to tables containing PII or financial data

-- businesses_private - sensitive contact data
DROP POLICY IF EXISTS "Deny public access to businesses_private" ON public.businesses_private;
CREATE POLICY "Deny public access to businesses_private"
ON public.businesses_private
FOR SELECT
TO anon
USING (false);

-- invoices - customer financial data
DROP POLICY IF EXISTS "Deny public access to invoices" ON public.invoices;
CREATE POLICY "Deny public access to invoices"
ON public.invoices
FOR SELECT
TO anon
USING (false);

-- bookings - customer contact and payment info
DROP POLICY IF EXISTS "Deny public access to bookings" ON public.bookings;
CREATE POLICY "Deny public access to bookings"
ON public.bookings
FOR SELECT
TO anon
USING (false);

-- platform_transactions - payment data
DROP POLICY IF EXISTS "Deny public access to platform_transactions" ON public.platform_transactions;
CREATE POLICY "Deny public access to platform_transactions"
ON public.platform_transactions
FOR SELECT
TO anon
USING (false);

-- sales_agents - agent personal info
DROP POLICY IF EXISTS "Deny public access to sales_agents" ON public.sales_agents;
CREATE POLICY "Deny public access to sales_agents"
ON public.sales_agents
FOR SELECT
TO anon
USING (false);

-- sales_agent_applications_personal_data - encrypted applicant data
DROP POLICY IF EXISTS "Deny public access to agent_applications_personal" ON public.sales_agent_applications_personal_data;
CREATE POLICY "Deny public access to agent_applications_personal"
ON public.sales_agent_applications_personal_data
FOR SELECT
TO anon
USING (false);

-- agent_commissions - financial data
DROP POLICY IF EXISTS "Deny public access to agent_commissions" ON public.agent_commissions;
CREATE POLICY "Deny public access to agent_commissions"
ON public.agent_commissions
FOR SELECT
TO anon
USING (false);

-- fraud_alerts - ensure business owners cannot see their own fraud alerts
DROP POLICY IF EXISTS "Business owners can view fraud alerts" ON public.fraud_alerts;
DROP POLICY IF EXISTS "Business owners view fraud alerts" ON public.fraud_alerts;
DROP POLICY IF EXISTS "business_owners_view_fraud_alerts" ON public.fraud_alerts;

-- Only admins should see fraud alerts
DROP POLICY IF EXISTS "Only admins can view fraud alerts" ON public.fraud_alerts;
CREATE POLICY "Only admins can view fraud alerts"
ON public.fraud_alerts
FOR SELECT
TO authenticated
USING (public.is_admin_secure());

-- Deny anonymous access to fraud_alerts
DROP POLICY IF EXISTS "Deny public access to fraud_alerts" ON public.fraud_alerts;
CREATE POLICY "Deny public access to fraud_alerts"
ON public.fraud_alerts
FOR SELECT
TO anon
USING (false);

-- Add explicit denial for all write operations from anonymous users on sensitive tables
-- invoices
DROP POLICY IF EXISTS "Deny anon insert invoices" ON public.invoices;
CREATE POLICY "Deny anon insert invoices" ON public.invoices FOR INSERT TO anon WITH CHECK (false);
DROP POLICY IF EXISTS "Deny anon update invoices" ON public.invoices;
CREATE POLICY "Deny anon update invoices" ON public.invoices FOR UPDATE TO anon USING (false);
DROP POLICY IF EXISTS "Deny anon delete invoices" ON public.invoices;
CREATE POLICY "Deny anon delete invoices" ON public.invoices FOR DELETE TO anon USING (false);

-- bookings
DROP POLICY IF EXISTS "Deny anon insert bookings" ON public.bookings;
CREATE POLICY "Deny anon insert bookings" ON public.bookings FOR INSERT TO anon WITH CHECK (false);
DROP POLICY IF EXISTS "Deny anon update bookings" ON public.bookings;
CREATE POLICY "Deny anon update bookings" ON public.bookings FOR UPDATE TO anon USING (false);
DROP POLICY IF EXISTS "Deny anon delete bookings" ON public.bookings;
CREATE POLICY "Deny anon delete bookings" ON public.bookings FOR DELETE TO anon USING (false);