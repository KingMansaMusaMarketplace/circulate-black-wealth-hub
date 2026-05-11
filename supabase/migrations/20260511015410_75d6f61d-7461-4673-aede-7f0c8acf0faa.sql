-- Bulk refill expired marketing credit periods
CREATE OR REPLACE FUNCTION public.refill_expired_marketing_credits()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer := 0;
  r RECORD;
  v_alloc integer;
BEGIN
  FOR r IN
    SELECT business_id, current_tier
    FROM public.marketing_credits
    WHERE period_end < now()
    FOR UPDATE
  LOOP
    v_alloc := public.marketing_credits_monthly_allocation(coalesce(r.current_tier,'free'));
    UPDATE public.marketing_credits
      SET plan_credits_remaining = v_alloc,
          period_start = now(),
          period_end = now() + interval '30 days',
          updated_at = now()
      WHERE business_id = r.business_id;
    INSERT INTO public.marketing_credit_ledger (business_id, delta, bucket, reason)
      VALUES (r.business_id, v_alloc, 'plan', 'monthly_refill');
    v_count := v_count + 1;
  END LOOP;
  RETURN jsonb_build_object('refilled', v_count, 'at', now());
END;
$$;

REVOKE ALL ON FUNCTION public.refill_expired_marketing_credits() FROM public;
GRANT EXECUTE ON FUNCTION public.refill_expired_marketing_credits() TO service_role;

-- Admin grant credits
CREATE OR REPLACE FUNCTION public.admin_grant_marketing_credits(
  p_business_id uuid, p_credits integer, p_reason text DEFAULT 'admin_grant'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_total integer;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  IF p_credits <= 0 THEN
    RAISE EXCEPTION 'credits must be positive';
  END IF;

  INSERT INTO public.marketing_credits (business_id, topup_credits_remaining)
  VALUES (p_business_id, p_credits)
  ON CONFLICT (business_id) DO UPDATE
    SET topup_credits_remaining = public.marketing_credits.topup_credits_remaining + p_credits,
        updated_at = now();

  INSERT INTO public.marketing_credit_ledger (business_id, delta, bucket, reason, metadata)
  VALUES (p_business_id, p_credits, 'topup', p_reason, jsonb_build_object('granted_by', auth.uid()));

  SELECT topup_credits_remaining INTO v_total FROM public.marketing_credits WHERE business_id = p_business_id;
  RETURN jsonb_build_object('ok', true, 'topup_remaining', v_total);
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_grant_marketing_credits(uuid,integer,text) TO authenticated;