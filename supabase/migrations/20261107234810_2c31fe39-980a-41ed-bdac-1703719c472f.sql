CREATE OR REPLACE FUNCTION public.hc_go_live_status(_clinic uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.hc_is_member(_clinic) THEN
    RAISE EXCEPTION 'Not a member of this clinic' USING ERRCODE = '42501';
  END IF;
  -- Read-only paperwork status. Real patient data is never switched on here:
  -- hc_pilot_patients still refuses any patient not confirmed as made-up.
  RETURN jsonb_build_object(
    'real_patients_allowed', false,
    'vendors', coalesce((
      SELECT jsonb_agg(jsonb_build_object(
        'vendor_name', v.vendor_name,
        'baa_category', v.baa_category,
        'status', v.status,
        'attorney_approved', v.attorney_approved
      ) ORDER BY v.sort_order)
      FROM public.hc_vendor_baas v
    ), '[]'::jsonb)
  );
END $function$;

REVOKE ALL ON FUNCTION public.hc_go_live_status(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.hc_go_live_status(uuid) TO authenticated, service_role;