REVOKE ALL ON public.hc_pilot_patients, public.hc_pilot_records, public.hc_pilot_audit FROM anon;
REVOKE ALL ON public.hc_pilot_patients, public.hc_pilot_records, public.hc_pilot_audit FROM authenticated;
GRANT SELECT, INSERT, UPDATE ON public.hc_pilot_patients TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.hc_pilot_records TO authenticated;
GRANT SELECT ON public.hc_pilot_audit TO authenticated;
GRANT ALL ON public.hc_pilot_patients, public.hc_pilot_records, public.hc_pilot_audit TO service_role;