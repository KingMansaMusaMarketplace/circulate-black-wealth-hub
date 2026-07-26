
CREATE OR REPLACE FUNCTION public.protect_sales_agent_application_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean := false;
BEGIN
  BEGIN
    SELECT public.has_role(auth.uid(), 'admin'::public.app_role) INTO is_admin;
  EXCEPTION WHEN OTHERS THEN
    is_admin := false;
  END;

  IF is_admin THEN
    RETURN NEW;
  END IF;

  IF NEW.application_status IS DISTINCT FROM OLD.application_status
     OR NEW.test_passed IS DISTINCT FROM OLD.test_passed
     OR NEW.test_score IS DISTINCT FROM OLD.test_score
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
     OR NEW.notes IS DISTINCT FROM OLD.notes THEN
    RAISE EXCEPTION 'Only admins can modify application status, test results, or review fields'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_sales_agent_application_fields_trg ON public.sales_agent_applications;
CREATE TRIGGER protect_sales_agent_application_fields_trg
BEFORE UPDATE ON public.sales_agent_applications
FOR EACH ROW
EXECUTE FUNCTION public.protect_sales_agent_application_fields();
