ALTER TABLE public.hc_access_requests
  ADD COLUMN IF NOT EXISTS request_source text NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS specialty text,
  ADD COLUMN IF NOT EXISTS practice_location text,
  ADD COLUMN IF NOT EXISTS npi text,
  ADD COLUMN IF NOT EXISTS test_only_attested_at timestamptz;

CREATE OR REPLACE FUNCTION public.hc_access_requests_pilot_check()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.request_source NOT IN ('general','pilot') THEN
    RAISE EXCEPTION 'invalid request source';
  END IF;
  IF NEW.request_source = 'pilot' AND NEW.test_only_attested_at IS NULL THEN
    RAISE EXCEPTION 'pilot requests require the test-patients-only attestation';
  END IF;
  IF NEW.npi IS NOT NULL AND NEW.npi !~ '^[0-9]{10}$' THEN
    RAISE EXCEPTION 'NPI must be 10 digits';
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.request_source IS DISTINCT FROM OLD.request_source THEN
    RAISE EXCEPTION 'request source cannot change';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS hc_access_requests_pilot_check ON public.hc_access_requests;
CREATE TRIGGER hc_access_requests_pilot_check BEFORE INSERT OR UPDATE ON public.hc_access_requests
FOR EACH ROW EXECUTE FUNCTION public.hc_access_requests_pilot_check();