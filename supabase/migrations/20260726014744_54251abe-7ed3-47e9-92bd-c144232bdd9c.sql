
-- 1) Hide correct_answer column from authenticated/anon on sales_agent_tests
REVOKE SELECT (correct_answer) ON public.sales_agent_tests FROM authenticated;
REVOKE SELECT (correct_answer) ON public.sales_agent_tests FROM anon;
REVOKE SELECT (correct_answer) ON public.sales_agent_tests FROM PUBLIC;

-- 2) Prevent self-approval on sales_agent_applications
CREATE OR REPLACE FUNCTION public.protect_sales_agent_applications_privileged()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public._sec_is_admin_or_system() THEN
    RETURN NEW;
  END IF;

  IF NEW.application_status IS DISTINCT FROM OLD.application_status
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.test_passed IS DISTINCT FROM OLD.test_passed
     OR NEW.test_score IS DISTINCT FROM OLD.test_score
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
     OR NEW.notes IS DISTINCT FROM OLD.notes THEN
    RAISE EXCEPTION 'Only administrators can modify application review fields';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_sales_agent_applications_privileged ON public.sales_agent_applications;
CREATE TRIGGER trg_protect_sales_agent_applications_privileged
BEFORE UPDATE ON public.sales_agent_applications
FOR EACH ROW
EXECUTE FUNCTION public.protect_sales_agent_applications_privileged();
