REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.hc_review_decisions FROM authenticated;
REVOKE ALL ON public.hc_review_decisions FROM anon;
GRANT SELECT ON public.hc_review_decisions TO authenticated;
GRANT ALL ON public.hc_review_decisions TO service_role;