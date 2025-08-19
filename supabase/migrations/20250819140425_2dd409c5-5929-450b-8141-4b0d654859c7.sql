-- CRITICAL SECURITY FIXES: Fix Public Data Exposure (Fixed version)
-- Remove overly permissive RLS policies and add proper access control

-- 1. Fix businesses table - remove public access, add proper policies
DROP POLICY IF EXISTS "Public businesses are viewable by everyone" ON public.businesses;
DROP POLICY IF EXISTS "Businesses are viewable by everyone" ON public.businesses;

-- Only business owners can see full business details
DROP POLICY IF EXISTS "Business owners can view their own business details" ON public.businesses;
CREATE POLICY "Business owners can view their own business details" 
ON public.businesses 
FOR SELECT 
TO authenticated
USING (auth.uid() = owner_id);

-- Create limited public view for business directory (non-sensitive data only)
CREATE OR REPLACE VIEW public.business_directory AS
SELECT 
  id,
  business_name,
  description,
  category,
  city,
  state,
  logo_url,
  banner_url,
  is_verified,
  average_rating,
  review_count,
  created_at
FROM public.businesses
WHERE is_verified = true; -- Only show verified businesses publicly

-- Allow public read access to the directory view
GRANT SELECT ON public.business_directory TO anon, authenticated;

-- 2. Fix profiles table - ensure only users see their own data
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles" ON public.profiles;

-- Users can only view their own profile
DROP POLICY IF EXISTS "Users can view their own profile only" ON public.profiles;
CREATE POLICY "Users can view their own profile only" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Users can only update their own profile
DROP POLICY IF EXISTS "Users can update their own profile only" ON public.profiles;
CREATE POLICY "Users can update their own profile only" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Fix transactions table - ensure proper access control
DROP POLICY IF EXISTS "Transactions are viewable by everyone" ON public.transactions;

-- Only customers can see their own transactions
DROP POLICY IF EXISTS "Customers can view their own transactions only" ON public.transactions;
CREATE POLICY "Customers can view their own transactions only" 
ON public.transactions 
FOR SELECT 
TO authenticated
USING (auth.uid() = customer_id);

-- Business owners can see transactions for their business
DROP POLICY IF EXISTS "Business owners can view their business transactions" ON public.transactions;
CREATE POLICY "Business owners can view their business transactions" 
ON public.transactions 
FOR SELECT 
TO authenticated
USING (auth.uid() IN (
  SELECT owner_id FROM public.businesses WHERE id = business_id
));

-- 4. Fix loyalty_points table - ensure proper access control
DROP POLICY IF EXISTS "Loyalty points are viewable by everyone" ON public.loyalty_points;

-- Customers can view their own points
DROP POLICY IF EXISTS "Customers can view their own loyalty points" ON public.loyalty_points;
CREATE POLICY "Customers can view their own loyalty points" 
ON public.loyalty_points 
FOR SELECT 
TO authenticated
USING (auth.uid() = customer_id);

-- Business owners can view points for their business
DROP POLICY IF EXISTS "Business owners can view loyalty points for their business" ON public.loyalty_points;
CREATE POLICY "Business owners can view loyalty points for their business" 
ON public.loyalty_points 
FOR SELECT 
TO authenticated
USING (auth.uid() IN (
  SELECT owner_id FROM public.businesses WHERE id = business_id
));

-- 5. Fix qr_scans table - ensure proper access control  
DROP POLICY IF EXISTS "QR scans are viewable by everyone" ON public.qr_scans;

-- Remove existing policies to avoid conflicts
DROP POLICY IF EXISTS "Customers can view their own QR scans" ON public.qr_scans;
DROP POLICY IF EXISTS "Business owners can view QR scans for their business" ON public.qr_scans;
DROP POLICY IF EXISTS "Authenticated users can create QR scans" ON public.qr_scans;

-- Customers can view their own scans
CREATE POLICY "Customers can view their own QR scans" 
ON public.qr_scans 
FOR SELECT 
TO authenticated
USING (auth.uid() = customer_id);

-- Business owners can view scans for their business
CREATE POLICY "Business owners can view QR scans for their business" 
ON public.qr_scans 
FOR SELECT 
TO authenticated
USING (auth.uid() IN (
  SELECT owner_id FROM public.businesses WHERE id = business_id
));

-- Allow authenticated users to create QR scans
CREATE POLICY "Authenticated users can create QR scans" 
ON public.qr_scans 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = customer_id);

-- 6. Fix email_notifications table - ensure only users see their own
DROP POLICY IF EXISTS "Users can view their own email notifications only" ON public.email_notifications;
CREATE POLICY "Users can view their own email notifications only" 
ON public.email_notifications 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 7. Fix reviews table - add proper authentication requirement
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anonymous users can view reviews" ON public.reviews;

-- Allow authenticated users to view reviews (business reviews should be public)
CREATE POLICY "Authenticated users can view reviews" 
ON public.reviews 
FOR SELECT 
TO authenticated
USING (true);

-- Allow anonymous users to view reviews for public business directory
CREATE POLICY "Anonymous users can view reviews" 
ON public.reviews 
FOR SELECT 
TO anon
USING (true);

-- 8. Fix qr_codes table - ensure business owners control access
DROP POLICY IF EXISTS "Active QR codes are viewable by everyone" ON public.qr_codes;
DROP POLICY IF EXISTS "Authenticated users can view active QR codes" ON public.qr_codes;

-- Allow authenticated users to view active QR codes for scanning
CREATE POLICY "Authenticated users can view active QR codes" 
ON public.qr_codes 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- 9. Fix rewards table - ensure proper access control
DROP POLICY IF EXISTS "Active rewards are viewable by everyone" ON public.rewards;
DROP POLICY IF EXISTS "Authenticated users can view active rewards" ON public.rewards;

-- Allow authenticated users to view active rewards
CREATE POLICY "Authenticated users can view active rewards" 
ON public.rewards 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- 10. Fix redeemed_rewards table access
DROP POLICY IF EXISTS "Customers can view their own redeemed rewards only" ON public.redeemed_rewards;
DROP POLICY IF EXISTS "Business owners can view redemptions for their business" ON public.redeemed_rewards;

CREATE POLICY "Customers can view their own redeemed rewards only" 
ON public.redeemed_rewards 
FOR SELECT 
TO authenticated
USING (auth.uid() = customer_id);

CREATE POLICY "Business owners can view redemptions for their business" 
ON public.redeemed_rewards 
FOR SELECT 
TO authenticated
USING (auth.uid() IN (
  SELECT owner_id FROM public.businesses WHERE id = business_id
));

-- Add security audit logging for policy changes
INSERT INTO public.security_audit_log (action, table_name, user_id) 
VALUES ('security_policy_update', 'multiple_tables', auth.uid());