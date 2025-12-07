-- Fix search_path on all 12 functions missing it

-- 1. calculate_commission (returns jsonb, has default param)
CREATE OR REPLACE FUNCTION public.calculate_commission(p_amount numeric, p_commission_rate numeric DEFAULT 7.5)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
DECLARE
  v_stripe_fee DECIMAL;
  v_commission_amount DECIMAL;
  v_net_commission DECIMAL;
  v_business_receives DECIMAL;
BEGIN
  -- Calculate Stripe fee (2.9% + $0.30)
  v_stripe_fee := (p_amount * 0.029) + 0.30;
  
  -- Calculate commission (7.5% of original amount)
  v_commission_amount := p_amount * (p_commission_rate / 100);
  
  -- Net commission (commission minus our portion of Stripe fee)
  v_net_commission := v_commission_amount - (v_stripe_fee * (p_commission_rate / 100));
  
  -- What business receives (amount - commission - stripe fee)
  v_business_receives := p_amount - v_commission_amount - v_stripe_fee;
  
  RETURN jsonb_build_object(
    'original_amount', p_amount,
    'commission_rate', p_commission_rate,
    'commission_amount', ROUND(v_commission_amount, 2),
    'stripe_fee', ROUND(v_stripe_fee, 2),
    'net_commission', ROUND(v_net_commission, 2),
    'business_receives', ROUND(v_business_receives, 2)
  );
END;
$function$;

-- 2. calculate_override_end_date (IMMUTABLE, 6 months)
CREATE OR REPLACE FUNCTION public.calculate_override_end_date(recruitment_date timestamp with time zone)
RETURNS timestamp with time zone
LANGUAGE plpgsql
IMMUTABLE
SET search_path = 'public'
AS $function$
BEGIN
  RETURN recruitment_date + interval '6 months';
END;
$function$;

-- 3. get_admin_notification_preferences
CREATE OR REPLACE FUNCTION public.get_admin_notification_preferences(p_admin_id uuid)
RETURNS admin_notification_preferences
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_preferences public.admin_notification_preferences;
  v_admin_email TEXT;
BEGIN
  SELECT * INTO v_preferences
  FROM public.admin_notification_preferences
  WHERE admin_user_id = p_admin_id;
  
  IF NOT FOUND THEN
    SELECT email INTO v_admin_email
    FROM auth.users
    WHERE id = p_admin_id;
    
    INSERT INTO public.admin_notification_preferences (
      admin_user_id,
      notification_email
    ) VALUES (
      p_admin_id,
      COALESCE(v_admin_email, '')
    )
    RETURNING * INTO v_preferences;
  END IF;
  
  RETURN v_preferences;
END;
$function$;

-- 4. get_agent_qr_analytics
CREATE OR REPLACE FUNCTION public.get_agent_qr_analytics(agent_referral_code text)
RETURNS TABLE(total_scans bigint, unique_scans bigint, total_conversions bigint, conversion_rate numeric, scans_last_7_days bigint, scans_last_30_days bigint, conversions_last_7_days bigint, conversions_last_30_days bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_scans,
    COUNT(DISTINCT ip_address)::BIGINT as unique_scans,
    COUNT(*) FILTER (WHERE converted = true)::BIGINT as total_conversions,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(*) FILTER (WHERE converted = true)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0
    END as conversion_rate,
    COUNT(*) FILTER (WHERE scanned_at >= NOW() - INTERVAL '7 days')::BIGINT as scans_last_7_days,
    COUNT(*) FILTER (WHERE scanned_at >= NOW() - INTERVAL '30 days')::BIGINT as scans_last_30_days,
    COUNT(*) FILTER (WHERE converted = true AND scanned_at >= NOW() - INTERVAL '7 days')::BIGINT as conversions_last_7_days,
    COUNT(*) FILTER (WHERE converted = true AND scanned_at >= NOW() - INTERVAL '30 days')::BIGINT as conversions_last_30_days
  FROM public.qr_code_scans
  WHERE referral_code = agent_referral_code;
END;
$function$;

-- 5. has_role (text version)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE 
      id = _user_id AND 
      user_type = _role
  );
$function$;

-- 6. insert_fraud_alerts_batch
CREATE OR REPLACE FUNCTION public.insert_fraud_alerts_batch(alerts json[])
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  inserted_count INTEGER := 0;
  alert JSON;
BEGIN
  FOREACH alert IN ARRAY alerts
  LOOP
    INSERT INTO fraud_alerts (
      alert_type,
      severity,
      user_id,
      business_id,
      related_entity_id,
      related_entity_type,
      description,
      evidence,
      ai_confidence_score
    ) VALUES (
      (alert->>'alert_type')::TEXT,
      (alert->>'severity')::TEXT,
      (alert->>'user_id')::UUID,
      (alert->>'business_id')::UUID,
      (alert->>'related_entity_id')::UUID,
      (alert->>'related_entity_type')::TEXT,
      (alert->>'description')::TEXT,
      (alert->'evidence')::JSON,
      (alert->>'ai_confidence_score')::DECIMAL
    );
    inserted_count := inserted_count + 1;
  END LOOP;
  
  RETURN inserted_count;
END;
$function$;

-- 7. mark_qr_scan_converted
CREATE OR REPLACE FUNCTION public.mark_qr_scan_converted(p_referral_code text, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_updated BOOLEAN;
BEGIN
  UPDATE public.qr_code_scans
  SET 
    converted = true,
    converted_user_id = p_user_id,
    converted_at = NOW()
  WHERE id = (
    SELECT id 
    FROM public.qr_code_scans 
    WHERE referral_code = p_referral_code 
      AND converted = false
    ORDER BY scanned_at DESC
    LIMIT 1
  );

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$function$;

-- 8. track_qr_scan
CREATE OR REPLACE FUNCTION public.track_qr_scan(p_referral_code text, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_scan_id UUID;
  v_agent_id UUID;
BEGIN
  SELECT id INTO v_agent_id
  FROM public.sales_agents
  WHERE referral_code = p_referral_code;

  INSERT INTO public.qr_code_scans (
    referral_code,
    sales_agent_id,
    ip_address,
    user_agent,
    scan_source
  ) VALUES (
    p_referral_code,
    v_agent_id,
    p_ip_address,
    p_user_agent,
    'qr_code'
  )
  RETURNING id INTO v_scan_id;

  RETURN v_scan_id;
END;
$function$;

-- 9. update_admin_preferences_timestamp
CREATE OR REPLACE FUNCTION public.update_admin_preferences_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 10. update_financial_updated_at
CREATE OR REPLACE FUNCTION public.update_financial_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 11. update_fraud_alerts_updated_at
CREATE OR REPLACE FUNCTION public.update_fraud_alerts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- 12. update_review_sentiment_updated_at
CREATE OR REPLACE FUNCTION public.update_review_sentiment_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;