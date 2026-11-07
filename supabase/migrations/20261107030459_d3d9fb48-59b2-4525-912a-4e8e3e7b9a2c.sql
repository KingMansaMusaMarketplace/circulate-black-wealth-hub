-- 1) Sponsor pipeline summary: admins / system only
CREATE OR REPLACE FUNCTION public.get_sponsor_pipeline_summary()
 RETURNS TABLE(stage text, count bigint, total_value numeric, weighted_value numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public._is_admin_or_service() THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT 
    p.pipeline_stage AS stage,
    COUNT(*) AS count,
    COALESCE(SUM(p.deal_value), 0) AS total_value,
    COALESCE(SUM(p.weighted_value), 0) AS weighted_value
  FROM public.sponsor_prospects p
  GROUP BY p.pipeline_stage
  ORDER BY 
    CASE p.pipeline_stage
      WHEN 'research' THEN 1
      WHEN 'outreach' THEN 2
      WHEN 'contacted' THEN 3
      WHEN 'meeting_scheduled' THEN 4
      WHEN 'meeting_completed' THEN 5
      WHEN 'proposal_sent' THEN 6
      WHEN 'negotiation' THEN 7
      WHEN 'closed_won' THEN 8
      WHEN 'closed_lost' THEN 9
      WHEN 'on_hold' THEN 10
    END;
END;
$function$;

-- 2) Referral commission processing: admins / system only
CREATE OR REPLACE FUNCTION public.process_pending_referrals()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  processed_count integer := 0;
  tier1_count integer := 0;
  tier2_count integer := 0;
  result jsonb;
  referral_record RECORD;
  tier1_points numeric := 8;
  tier2_points numeric;
  parent_agent_id uuid;
  parent_referral_id uuid;
BEGIN
  IF NOT public._is_admin_or_service() THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  FOR referral_record IN 
    SELECT r.id, r.sales_agent_id, r.referred_user_id, r.subscription_amount,
           p.referred_by_agent_id
    FROM referrals r
    LEFT JOIN profiles p ON p.id = r.referred_user_id
    WHERE r.commission_status = 'pending'
    AND EXISTS (
      SELECT 1 FROM profiles prof 
      WHERE prof.id = r.referred_user_id 
      AND prof.user_type IN ('customer', 'business_owner')
    )
  LOOP
    INSERT INTO agent_commissions (
      sales_agent_id, referral_id, amount, status, due_date
    ) VALUES (
      referral_record.sales_agent_id, referral_record.id, tier1_points, 'pending', NOW() + INTERVAL '30 days'
    );
    
    UPDATE referrals 
    SET commission_status = 'approved',
        commission_amount = tier1_points,
        tier = 1
    WHERE id = referral_record.id;
    
    tier1_count := tier1_count + 1;
    
    SELECT sa.id INTO parent_agent_id
    FROM sales_agents sa
    INNER JOIN profiles p ON p.id = sa.user_id
    WHERE p.id = (
      SELECT user_id FROM sales_agents WHERE id = referral_record.sales_agent_id
    )
    AND p.referred_by_agent_id IS NOT NULL;
    
    IF parent_agent_id IS NOT NULL THEN
      tier2_points := calculate_team_bonus(tier1_points);
      
      INSERT INTO referrals (
        sales_agent_id, referred_user_id, referred_user_type, commission_status,
        commission_amount, tier, parent_referral_id, subscription_amount
      ) VALUES (
        parent_agent_id, referral_record.referred_user_id, 'customer', 'approved',
        tier2_points, 2, referral_record.id, referral_record.subscription_amount
      ) RETURNING id INTO parent_referral_id;
      
      INSERT INTO agent_commissions (
        sales_agent_id, referral_id, amount, status, due_date
      ) VALUES (
        parent_agent_id, parent_referral_id, tier2_points, 'pending', NOW() + INTERVAL '30 days'
      );
      
      tier2_count := tier2_count + 1;
    END IF;
    
    processed_count := processed_count + 1;
  END LOOP;
  
  result := jsonb_build_object(
    'processed_count', processed_count,
    'tier1_commissions', tier1_count,
    'tier2_commissions', tier2_count,
    'tier1_points', tier1_points,
    'tier2_points', tier2_points
  );
  
  RETURN result;
END;
$function$;

-- 3) Developer monthly usage: own account, admins, or system only
CREATE OR REPLACE FUNCTION public.get_developer_monthly_usage(p_developer_id uuid)
 RETURNS TABLE(endpoint text, total_calls bigint, total_billed_units bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT (
    public._is_admin_or_service()
    OR EXISTS (
      SELECT 1 FROM public.developer_accounts da
      WHERE da.id = p_developer_id AND da.user_id = auth.uid()
    )
  ) THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    aul.endpoint,
    COUNT(*)::BIGINT AS total_calls,
    SUM(aul.billed_units)::BIGINT AS total_billed_units
  FROM public.api_usage_logs aul
  WHERE aul.developer_id = p_developer_id
    AND aul.request_timestamp >= date_trunc('month', now())
    AND aul.response_status BETWEEN 200 AND 299
  GROUP BY aul.endpoint;
END;
$function$;

-- 4) Review-mood (sentiment) trend recalculation: business owner/manager, admins, or system only
CREATE OR REPLACE FUNCTION public.update_sentiment_trends(p_business_id uuid, p_period_days integer DEFAULT 7)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_period_start DATE;
  v_period_end DATE;
  v_result JSONB;
BEGIN
  IF NOT (
    public._is_admin_or_service()
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = p_business_id
        AND public.is_business_owner_or_manager(b.owner_id, b.location_manager_id, b.parent_business_id)
    )
  ) THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  v_period_end := CURRENT_DATE;
  v_period_start := v_period_end - (p_period_days || ' days')::INTERVAL;
  
  INSERT INTO public.business_sentiment_trends (
    business_id, period_start, period_end, total_reviews, positive_count,
    negative_count, neutral_count, average_sentiment_score, urgent_issues_count
  )
  SELECT
    p_business_id,
    v_period_start,
    v_period_end,
    COUNT(*),
    COUNT(*) FILTER (WHERE sentiment = 'positive'),
    COUNT(*) FILTER (WHERE sentiment = 'negative'),
    COUNT(*) FILTER (WHERE sentiment = 'neutral'),
    AVG(sentiment_score),
    COUNT(*) FILTER (WHERE urgency_level IN ('high', 'critical'))
  FROM public.review_sentiment_analysis
  WHERE business_id = p_business_id
    AND created_at >= v_period_start
    AND created_at <= v_period_end
  ON CONFLICT (business_id, period_start, period_end)
  DO UPDATE SET
    total_reviews = EXCLUDED.total_reviews,
    positive_count = EXCLUDED.positive_count,
    negative_count = EXCLUDED.negative_count,
    neutral_count = EXCLUDED.neutral_count,
    average_sentiment_score = EXCLUDED.average_sentiment_score,
    urgent_issues_count = EXCLUDED.urgent_issues_count,
    created_at = NOW();
  
  v_result := jsonb_build_object(
    'success', true,
    'period_start', v_period_start,
    'period_end', v_period_end
  );
  
  RETURN v_result;
END;
$function$;

-- Explicitly block signed-out visitors; keep signed-in + system access (guards above decide who passes)
REVOKE EXECUTE ON FUNCTION public.get_sponsor_pipeline_summary() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.process_pending_referrals() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_developer_monthly_usage(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.update_sentiment_trends(uuid, integer) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.get_sponsor_pipeline_summary() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.process_pending_referrals() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_developer_monthly_usage(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_sentiment_trends(uuid, integer) TO authenticated, service_role;