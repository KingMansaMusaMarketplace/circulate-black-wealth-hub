
CREATE OR REPLACE FUNCTION public.protect_featured_placements_privileged_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF public._is_admin_current_user() THEN RETURN NEW; END IF;
  NEW.status := OLD.status;
  NEW.priority_score := OLD.priority_score;
  NEW.starts_at := OLD.starts_at;
  NEW.ends_at := OLD.ends_at;
  NEW.tier := OLD.tier;
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS trg_protect_featured_placements_privileged_fields ON public.featured_placements;
CREATE TRIGGER trg_protect_featured_placements_privileged_fields
BEFORE UPDATE ON public.featured_placements
FOR EACH ROW EXECUTE FUNCTION public.protect_featured_placements_privileged_fields();

CREATE OR REPLACE FUNCTION public.protect_job_postings_privileged_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF public._is_admin_current_user() THEN RETURN NEW; END IF;
  NEW.status := OLD.status;
  NEW.amount_cents := OLD.amount_cents;
  NEW.paid_at := OLD.paid_at;
  NEW.expires_at := OLD.expires_at;
  NEW.rejection_reason := OLD.rejection_reason;
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS trg_protect_job_postings_privileged_fields ON public.job_postings;
CREATE TRIGGER trg_protect_job_postings_privileged_fields
BEFORE UPDATE ON public.job_postings
FOR EACH ROW EXECUTE FUNCTION public.protect_job_postings_privileged_fields();
