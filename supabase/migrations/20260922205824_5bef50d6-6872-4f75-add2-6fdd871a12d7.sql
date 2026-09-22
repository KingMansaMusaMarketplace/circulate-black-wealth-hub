ALTER VIEW public.vacation_properties_public SET (security_invoker = off);
ALTER VIEW public.property_availability_public SET (security_invoker = off);
ALTER VIEW public.property_price_overrides_public SET (security_invoker = off);

GRANT SELECT ON public.vacation_properties_public TO anon, authenticated;
GRANT SELECT ON public.property_availability_public TO anon, authenticated;
GRANT SELECT ON public.property_price_overrides_public TO anon, authenticated;