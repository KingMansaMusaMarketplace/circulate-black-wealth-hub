-- Restrict anonymous read access to sensitive contact columns on businesses
REVOKE SELECT (email, phone) ON public.businesses FROM anon;

-- Lock down search_path on user-defined function
ALTER FUNCTION public.normalize_business_name(text) SET search_path = public, pg_temp;