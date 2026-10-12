CREATE OR REPLACE FUNCTION public.set_business_submission_ip()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE h json; ip text;
BEGIN
  BEGIN h := current_setting('request.headers', true)::json; EXCEPTION WHEN others THEN h := NULL; END;
  ip := split_part(coalesce(h->>'x-forwarded-for', h->>'cf-connecting-ip', ''), ',', 1);
  NEW.submitter_ip := NULLIF(trim(ip), '');
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_set_business_submission_ip ON public.business_submissions;
CREATE TRIGGER trg_set_business_submission_ip BEFORE INSERT ON public.business_submissions
FOR EACH ROW EXECUTE FUNCTION public.set_business_submission_ip();