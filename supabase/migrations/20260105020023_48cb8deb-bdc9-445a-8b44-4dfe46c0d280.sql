-- Fix the get_community_wealth_metrics function to use correct column names
CREATE OR REPLACE FUNCTION public.get_community_wealth_metrics()
RETURNS json
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = 'public'
AS $function$
DECLARE
  result JSON;
  total_transactions_amount NUMERIC;
  total_transactions_count INTEGER;
  total_businesses_count INTEGER;
  total_sponsors_count INTEGER;
  sponsor_investment_total NUMERIC;
  economic_multiplier CONSTANT NUMERIC := 6.0; -- Research shows $1 spent = ~$6 community impact
BEGIN
  -- Get total transaction amount from logged transactions (no status column, count all)
  SELECT COALESCE(SUM(amount), 0)
  INTO total_transactions_amount
  FROM transactions;
  
  -- Get transaction count
  SELECT COUNT(*)
  INTO total_transactions_count
  FROM transactions;
  
  -- Get verified business count (correct column name is is_verified)
  SELECT COUNT(*)
  INTO total_businesses_count
  FROM businesses
  WHERE is_verified = true;
  
  -- Get active sponsor count
  SELECT COUNT(DISTINCT user_id)
  INTO total_sponsors_count
  FROM corporate_subscriptions
  WHERE status = 'active';
  
  -- Calculate sponsor investment (monthly values)
  SELECT COALESCE(SUM(
    CASE tier
      WHEN 'bronze' THEN 500
      WHEN 'silver' THEN 1500
      WHEN 'gold' THEN 5000
      WHEN 'platinum' THEN 15000
      ELSE 0
    END
  ), 0)
  INTO sponsor_investment_total
  FROM corporate_subscriptions
  WHERE status = 'active';
  
  -- Build result JSON
  result := json_build_object(
    'total_spent', total_transactions_amount,
    'transaction_count', total_transactions_count,
    'businesses_supported', total_businesses_count,
    'sponsor_count', total_sponsors_count,
    'sponsor_investment', sponsor_investment_total,
    'economic_impact', total_transactions_amount * economic_multiplier,
    'multiplier', economic_multiplier
  );
  
  RETURN result;
END;
$function$;