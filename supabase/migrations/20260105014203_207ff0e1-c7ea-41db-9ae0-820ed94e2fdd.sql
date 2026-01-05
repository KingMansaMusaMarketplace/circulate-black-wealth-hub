-- Create a function to get community wealth metrics for the ticker
-- Uses existing data sources for real-time stats
CREATE OR REPLACE FUNCTION public.get_community_wealth_metrics()
RETURNS JSON
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  result JSON;
  total_transactions_amount NUMERIC;
  total_transactions_count INTEGER;
  total_businesses_count INTEGER;
  total_sponsors_count INTEGER;
  sponsor_investment_total NUMERIC;
  economic_multiplier CONSTANT NUMERIC := 6.0; -- Research shows $1 spent = ~$6 community impact
BEGIN
  -- Get total transaction amount from logged transactions
  SELECT COALESCE(SUM(amount), 0)
  INTO total_transactions_amount
  FROM transactions
  WHERE status = 'completed';
  
  -- Get transaction count
  SELECT COUNT(*)
  INTO total_transactions_count
  FROM transactions
  WHERE status = 'completed';
  
  -- Get verified business count
  SELECT COUNT(*)
  INTO total_businesses_count
  FROM businesses
  WHERE verified = true;
  
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
$$;