GRANT SELECT ON public.businesses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.businesses_private TO authenticated;
GRANT ALL ON public.businesses_private TO service_role;