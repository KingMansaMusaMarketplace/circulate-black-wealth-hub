CREATE OR REPLACE FUNCTION public.close_duplicate_leads_on_decision()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF pg_trigger_depth() > 1 THEN RETURN NEW; END IF;
  IF NEW.verification_status IN ('promoted','rejected')
     AND OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
    UPDATE public.b2b_external_leads d
       SET verification_status = 'rejected'
     WHERE d.id <> NEW.id
       AND d.verification_status IN ('needs_review','pending')
       AND lower(trim(d.business_name)) = lower(trim(NEW.business_name))
       AND lower(trim(coalesce(d.city,''))) = lower(trim(coalesce(NEW.city,'')));
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.close_duplicate_leads_on_decision() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_close_duplicate_leads ON public.b2b_external_leads;
CREATE TRIGGER trg_close_duplicate_leads
AFTER UPDATE OF verification_status ON public.b2b_external_leads
FOR EACH ROW EXECUTE FUNCTION public.close_duplicate_leads_on_decision();

-- one-time cleanup: waiting copies of businesses already decided
SET LOCAL ROLE service_role;
UPDATE public.b2b_external_leads d
   SET verification_status = 'rejected'
 WHERE d.verification_status IN ('needs_review','pending')
   AND EXISTS (SELECT 1 FROM public.b2b_external_leads x
               WHERE x.id <> d.id AND x.verification_status IN ('promoted','rejected')
                 AND x.reviewed_by IS NOT NULL
                 AND lower(trim(x.business_name)) = lower(trim(d.business_name))
                 AND lower(trim(coalesce(x.city,''))) = lower(trim(coalesce(d.city,''))));
RESET ROLE;