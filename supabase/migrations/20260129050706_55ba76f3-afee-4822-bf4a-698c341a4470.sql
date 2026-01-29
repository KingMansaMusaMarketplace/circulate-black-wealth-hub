-- Fix Security Definer Views by explicitly setting SECURITY INVOKER
-- and fix the permissive RLS policy

-- 1. Drop and recreate views with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.partner_referred_businesses_api;
DROP VIEW IF EXISTS public.ecosystem_cross_stats;

-- Recreate partner_referred_businesses_api with SECURITY INVOKER
CREATE VIEW public.partner_referred_businesses_api 
WITH (security_invoker = true) AS
SELECT 
  b.id,
  b.business_name,
  b.category,
  b.city,
  b.state,
  b.average_rating,
  b.review_count,
  pr.partner_id,
  dp.directory_name AS referring_directory,
  dp.tier AS partner_tier,
  pr.converted_at AS joined_at
FROM public.businesses b
JOIN public.partner_referrals pr ON pr.referred_business_id = b.id
JOIN public.directory_partners dp ON dp.id = pr.partner_id
WHERE pr.is_converted = true
AND b.is_verified = true;

-- Recreate ecosystem_cross_stats with SECURITY INVOKER
CREATE VIEW public.ecosystem_cross_stats 
WITH (security_invoker = true) AS
SELECT
  (SELECT COUNT(*) FROM public.directory_partners WHERE status = 'active') AS active_partners,
  (SELECT COUNT(*) FROM public.developer_accounts WHERE status = 'active') AS active_developers,
  (SELECT COUNT(*) FROM public.technical_partners WHERE status = 'active') AS technical_partners,
  (SELECT COUNT(*) FROM public.partner_referrals WHERE is_converted = true) AS partner_referred_businesses,
  (SELECT COUNT(*) FROM public.app_business_attributions) AS app_attributed_businesses,
  (SELECT COALESCE(SUM(total_earnings), 0) FROM public.directory_partners) AS total_partner_earnings,
  (SELECT COALESCE(SUM(total_app_earnings), 0) FROM public.technical_partners) AS total_technical_partner_earnings;

-- 2. Fix the permissive RLS policy on app_business_attributions
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "System can insert attributions" ON public.app_business_attributions;

-- Create a more restrictive policy that allows authenticated users to insert their own attributions
CREATE POLICY "Developers can insert their own attributions"
ON public.app_business_attributions FOR INSERT
WITH CHECK (
  developer_id IN (
    SELECT id FROM public.developer_accounts WHERE user_id = auth.uid()
  )
);

-- Allow admins to insert attributions (for system operations)
CREATE POLICY "Admins can insert attributions"
ON public.app_business_attributions FOR INSERT
WITH CHECK (public.is_admin_secure());