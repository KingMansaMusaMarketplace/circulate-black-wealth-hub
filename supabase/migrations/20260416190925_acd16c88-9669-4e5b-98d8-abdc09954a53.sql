
-- Atomic, secure QR scan + loyalty points award function
CREATE OR REPLACE FUNCTION public.award_qr_scan(
  p_qr_code_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_qr record;
  v_points integer;
  v_business_name text;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'auth_required');
  END IF;

  SELECT qc.id, qc.business_id, qc.is_active, qc.scan_limit, qc.current_scans,
         qc.points_value, qc.discount_percentage, qc.expiration_date,
         b.business_name
  INTO v_qr
  FROM public.qr_codes qc
  JOIN public.businesses b ON b.id = qc.business_id
  WHERE qc.id = p_qr_code_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'qr_not_found');
  END IF;

  IF COALESCE(v_qr.is_active, false) = false THEN
    RETURN jsonb_build_object('success', false, 'error', 'qr_inactive');
  END IF;

  IF v_qr.expiration_date IS NOT NULL AND v_qr.expiration_date < now() THEN
    RETURN jsonb_build_object('success', false, 'error', 'qr_expired');
  END IF;

  IF v_qr.scan_limit IS NOT NULL AND COALESCE(v_qr.current_scans, 0) >= v_qr.scan_limit THEN
    RETURN jsonb_build_object('success', false, 'error', 'scan_limit_reached');
  END IF;

  v_points := COALESCE(v_qr.points_value, 0);

  INSERT INTO public.qr_scans (qr_code_id, customer_id, business_id, points_awarded, discount_applied, scan_date)
  VALUES (p_qr_code_id, v_user_id, v_qr.business_id, v_points, COALESCE(v_qr.discount_percentage, 0), now());

  UPDATE public.qr_codes
  SET current_scans = COALESCE(current_scans, 0) + 1,
      updated_at = now()
  WHERE id = p_qr_code_id;

  IF v_points > 0 THEN
    INSERT INTO public.loyalty_points (customer_id, business_id, points)
    VALUES (v_user_id, v_qr.business_id, v_points)
    ON CONFLICT (customer_id, business_id)
    DO UPDATE SET points = public.loyalty_points.points + EXCLUDED.points,
                  updated_at = now();
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'business_id', v_qr.business_id,
    'business_name', v_qr.business_name,
    'points_earned', v_points,
    'discount_applied', COALESCE(v_qr.discount_percentage, 0)
  );
END;
$$;

-- Ensure required unique index exists for the upsert above
CREATE UNIQUE INDEX IF NOT EXISTS loyalty_points_customer_business_unique
ON public.loyalty_points (customer_id, business_id);

REVOKE ALL ON FUNCTION public.award_qr_scan(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.award_qr_scan(uuid) TO authenticated;
