REVOKE ALL ON public.hc_pilot_requests FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.hc_pilot_requests TO authenticated;
GRANT ALL ON public.hc_pilot_requests TO service_role;
REVOKE ALL ON FUNCTION public.hc_validate_pilot_request() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hc_validate_pilot_request() TO service_role;