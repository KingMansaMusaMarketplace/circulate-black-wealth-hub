GRANT SELECT ON TABLE public.businesses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.businesses TO authenticated;
GRANT ALL ON TABLE public.businesses TO service_role;