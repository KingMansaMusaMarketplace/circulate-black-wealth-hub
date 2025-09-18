-- Fix remaining SECURITY DEFINER functions that don't need elevated privileges

-- Remove SECURITY DEFINER from functions that don't need it for admin purposes
-- Keep admin functions as SECURITY DEFINER since they legitimately need elevated privileges

-- Fix calculate_user_impact_metrics - this doesn't need SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.calculate_user_impact_metrics(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE  -- Removed SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_spending NUMERIC := 0;
  v_businesses_supported INTEGER := 0;
  v_transactions_count INTEGER := 0;
  v_estimated_jobs_created NUMERIC := 0;
  v_wealth_circulated NUMERIC := 0;
  v_result JSONB;
BEGIN
  -- This function now relies on RLS policies on the transactions table
  -- Only transactions the user has access to will be included
  
  -- Calculate total spending from transactions
  SELECT COALESCE(SUM(amount), 0) INTO v_total_spending
  FROM transactions
  WHERE customer_id = p_user_id;
  
  -- Calculate unique businesses supported
  SELECT COUNT(DISTINCT business_id) INTO v_businesses_supported
  FROM transactions
  WHERE customer_id = p_user_id;
  
  -- Calculate total transactions
  SELECT COUNT(*) INTO v_transactions_count
  FROM transactions
  WHERE customer_id = p_user_id;
  
  -- Estimate jobs created (rough calculation: $10K spending = 1 job supported)
  v_estimated_jobs_created := v_total_spending / 10000;
  
  -- Calculate wealth circulation (spending * multiplier effect of 2.3)
  v_wealth_circulated := v_total_spending * 2.3;
  
  v_result := jsonb_build_object(
    'total_spending', v_total_spending,
    'businesses_supported', v_businesses_supported,
    'transactions_count', v_transactions_count,
    'estimated_jobs_created', ROUND(v_estimated_jobs_created, 2),
    'wealth_circulated', ROUND(v_wealth_circulated, 2),
    'circulation_multiplier', 2.3
  );
  
  RETURN v_result;
END;
$$;

-- Fix get_community_impact_summary - this doesn't need SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_community_impact_summary()
RETURNS jsonb
LANGUAGE plpgsql
STABLE  -- Removed SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_users INTEGER := 0;
  v_total_businesses INTEGER := 0;
  v_total_circulation NUMERIC := 0;
  v_total_transactions INTEGER := 0;
  v_active_this_month INTEGER := 0;
  v_result JSONB;
BEGIN
  -- This function now relies on RLS policies
  -- Only data the user has access to will be included
  
  -- Get total users (only if user has access)
  SELECT COUNT(*) INTO v_total_users
  FROM profiles
  WHERE user_type = 'customer';
  
  -- Get total businesses (respects RLS)
  SELECT COUNT(*) INTO v_total_businesses
  FROM businesses;
  
  -- Calculate total circulation (respects RLS)
  SELECT COALESCE(SUM(amount * 2.3), 0) INTO v_total_circulation
  FROM transactions;
  
  -- Get total transactions (respects RLS)
  SELECT COUNT(*) INTO v_total_transactions
  FROM transactions;
  
  -- Get users active this month (respects RLS)
  SELECT COUNT(DISTINCT customer_id) INTO v_active_this_month
  FROM transactions
  WHERE transaction_date >= DATE_TRUNC('month', CURRENT_DATE);
  
  v_result := jsonb_build_object(
    'total_users', v_total_users,
    'total_businesses', v_total_businesses,
    'total_circulation', ROUND(v_total_circulation, 2),
    'total_transactions', v_total_transactions,
    'active_this_month', v_active_this_month,
    'estimated_jobs_created', ROUND(v_total_circulation / 10000, 0)
  );
  
  RETURN v_result;
END;
$$;

-- Fix get_business_analytics_summary - this doesn't need SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_business_analytics_summary(p_business_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE  -- Removed SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  -- This function now relies on RLS policies on business_analytics table
  SELECT jsonb_build_object(
    'total_views', COALESCE(SUM(CASE WHEN metric_type = 'profile_views' THEN metric_value END), 0),
    'total_scans', COALESCE(SUM(CASE WHEN metric_type = 'qr_scans' THEN metric_value END), 0),
    'total_shares', COALESCE(SUM(CASE WHEN metric_type = 'social_shares' THEN metric_value END), 0),
    'avg_daily_views', COALESCE(AVG(CASE WHEN metric_type = 'profile_views' THEN metric_value END), 0),
    'recent_activity', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'date', date_recorded,
          'metric_type', metric_type,
          'value', metric_value
        )
        ORDER BY date_recorded DESC
      )
      FROM business_analytics 
      WHERE business_id = p_business_id 
        AND date_recorded >= CURRENT_DATE - INTERVAL '30 days'
      LIMIT 10
    )
  ) INTO result
  FROM business_analytics
  WHERE business_id = p_business_id;
  
  RETURN COALESCE(result, '{}'::jsonb);
END;
$$;

-- Fix get_qr_scan_metrics - this doesn't need SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_qr_scan_metrics(p_business_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE  -- Removed SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_scans INTEGER;
  v_unique_customers INTEGER;
  v_points_awarded BIGINT;
  v_avg_points_per_scan NUMERIC;
  v_result JSONB;
BEGIN
  -- This function now relies on RLS policies on qr_scans table
  -- Get total scans
  SELECT COUNT(*) INTO v_total_scans
  FROM qr_scans
  WHERE business_id = p_business_id;
  
  -- Get unique customers
  SELECT COUNT(DISTINCT customer_id) INTO v_unique_customers
  FROM qr_scans
  WHERE business_id = p_business_id;
  
  -- Get total points awarded
  SELECT COALESCE(SUM(points_awarded), 0) INTO v_points_awarded
  FROM qr_scans
  WHERE business_id = p_business_id;
  
  -- Calculate average points per scan
  IF v_total_scans > 0 THEN
    v_avg_points_per_scan := v_points_awarded::NUMERIC / v_total_scans;
  ELSE
    v_avg_points_per_scan := 0;
  END IF;
  
  -- Build result
  v_result := jsonb_build_object(
    'total_scans', v_total_scans,
    'unique_customers', v_unique_customers,
    'total_points_awarded', v_points_awarded,
    'average_points_per_scan', v_avg_points_per_scan
  );
  
  RETURN v_result;
END;
$$;

-- Fix check_business_access_rate_limit - this doesn't need SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.check_business_access_rate_limit(user_id_param uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE  -- Removed SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_accesses integer;
BEGIN
  -- This function now relies on RLS policies on business_access_log table
  -- Count business accesses in the last minute
  SELECT COUNT(*) INTO recent_accesses
  FROM public.business_access_log
  WHERE user_id = user_id_param
    AND accessed_at > now() - interval '1 minute';
  
  -- Allow max 30 business accesses per minute
  RETURN recent_accesses < 30;
END;
$$;