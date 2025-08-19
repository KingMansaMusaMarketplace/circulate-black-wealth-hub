-- CRITICAL SECURITY FIXES: Fix Public Data Exposure
-- Remove overly permissive RLS policies and add proper access control

-- 1. Fix businesses table - remove public access, add proper policies
DROP POLICY IF EXISTS "Public businesses are viewable by everyone" ON public.businesses;
DROP POLICY IF EXISTS "Businesses are viewable by everyone" ON public.businesses;

-- Only business owners can see full business details
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
CREATE POLICY "Users can view their own profile only" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile only" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Fix transactions table - ensure proper access control
DROP POLICY IF EXISTS "Transactions are viewable by everyone" ON public.transactions;

-- Only customers can see their own transactions
CREATE POLICY "Customers can view their own transactions only" 
ON public.transactions 
FOR SELECT 
TO authenticated
USING (auth.uid() = customer_id);

-- Business owners can see transactions for their business
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
CREATE POLICY "Customers can view their own loyalty points" 
ON public.loyalty_points 
FOR SELECT 
TO authenticated
USING (auth.uid() = customer_id);

-- Business owners can view points for their business
CREATE POLICY "Business owners can view loyalty points for their business" 
ON public.loyalty_points 
FOR SELECT 
TO authenticated
USING (auth.uid() IN (
  SELECT owner_id FROM public.businesses WHERE id = business_id
));

-- 5. Fix qr_scans table - ensure proper access control  
DROP POLICY IF EXISTS "QR scans are viewable by everyone" ON public.qr_scans;

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
CREATE POLICY "Users can view their own email notifications only" 
ON public.email_notifications 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 7. Fix reviews table - add proper authentication requirement
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;

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

-- Customers can manage their own reviews
CREATE POLICY "Customers can manage their own reviews" 
ON public.reviews 
FOR ALL
TO authenticated
USING (auth.uid() = customer_id)
WITH CHECK (auth.uid() = customer_id);

-- 8. Fix qr_codes table - ensure business owners control access
DROP POLICY IF EXISTS "Active QR codes are viewable by everyone" ON public.qr_codes;

-- Business owners can manage their QR codes
CREATE POLICY "Business owners can manage their QR codes" 
ON public.qr_codes 
FOR ALL
TO authenticated
USING (auth.uid() IN (
  SELECT owner_id FROM public.businesses WHERE id = business_id
))
WITH CHECK (auth.uid() IN (
  SELECT owner_id FROM public.businesses WHERE id = business_id
));

-- Allow authenticated users to view active QR codes for scanning
CREATE POLICY "Authenticated users can view active QR codes" 
ON public.qr_codes 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- 9. Fix rewards table - ensure proper access control
DROP POLICY IF EXISTS "Active rewards are viewable by everyone" ON public.rewards;

-- Business owners can manage their rewards
CREATE POLICY "Business owners can manage their rewards" 
ON public.rewards 
FOR ALL
TO authenticated
USING (auth.uid() IN (
  SELECT owner_id FROM public.businesses WHERE id = business_id
))
WITH CHECK (auth.uid() IN (
  SELECT owner_id FROM public.businesses WHERE id = business_id
));

-- Allow authenticated users to view active rewards
CREATE POLICY "Authenticated users can view active rewards" 
ON public.rewards 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- 10. Fix redeemed_rewards table access
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

-- 11. Add security audit logging for policy changes
INSERT INTO public.security_audit_log (action, table_name, user_id) 
VALUES ('security_policy_update', 'multiple_tables', auth.uid());

-- Update public search function to use the new business_directory view
CREATE OR REPLACE FUNCTION public.search_public_businesses(
  p_search_term text DEFAULT NULL,
  p_category text DEFAULT NULL,
  p_min_rating numeric DEFAULT NULL,
  p_featured boolean DEFAULT NULL,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  business_name text,
  description text,
  category character varying,
  city character varying,
  state character varying,
  logo_url character varying,
  banner_url character varying,
  is_verified boolean,
  average_rating numeric,
  review_count integer,
  created_at timestamp with time zone,
  total_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_query text;
    v_conditions text[] := ARRAY[]::text[];
    v_count bigint;
BEGIN
    -- Build conditions array
    IF p_search_term IS NOT NULL AND trim(p_search_term) != '' THEN
        v_conditions := array_append(v_conditions, 
            format('(business_name ILIKE %L OR category ILIKE %L)', 
                   '%' || trim(p_search_term) || '%',
                   '%' || trim(p_search_term) || '%'));
    END IF;
    
    IF p_category IS NOT NULL AND p_category != 'all' THEN
        v_conditions := array_append(v_conditions, format('category = %L', p_category));
    END IF;
    
    IF p_min_rating IS NOT NULL AND p_min_rating > 0 THEN
        v_conditions := array_append(v_conditions, format('average_rating >= %s', p_min_rating));
    END IF;
    
    IF p_featured IS TRUE THEN
        v_conditions := array_append(v_conditions, 'is_verified = true');
    END IF;
    
    -- Get total count for pagination
    v_query := 'SELECT COUNT(*) FROM business_directory';
    IF array_length(v_conditions, 1) > 0 THEN
        v_query := v_query || ' WHERE ' || array_to_string(v_conditions, ' AND ');
    END IF;
    
    EXECUTE v_query INTO v_count;
    
    -- Return filtered results from business_directory view
    RETURN QUERY EXECUTE format('
        SELECT 
            bd.id,
            bd.business_name,
            bd.description,
            bd.category,
            bd.city,
            bd.state,
            bd.logo_url,
            bd.banner_url,
            bd.is_verified,
            bd.average_rating,
            bd.review_count,
            bd.created_at,
            %s::bigint as total_count
        FROM business_directory bd
        %s
        ORDER BY bd.is_verified DESC, bd.created_at DESC
        LIMIT %s OFFSET %s',
        v_count,
        CASE WHEN array_length(v_conditions, 1) > 0 
             THEN 'WHERE ' || array_to_string(v_conditions, ' AND ')
             ELSE '' END,
        COALESCE(p_limit, 20),
        COALESCE(p_offset, 0)
    );
END;
$$;