
-- 1. sales_agent_applications: block self-approval via column-locked UPDATE policy + trigger
CREATE OR REPLACE FUNCTION public.protect_sales_agent_application_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.application_status IS DISTINCT FROM OLD.application_status
     OR NEW.test_passed      IS DISTINCT FROM OLD.test_passed
     OR NEW.test_score       IS DISTINCT FROM OLD.test_score
     OR NEW.reviewed_by      IS DISTINCT FROM OLD.reviewed_by
     OR NEW.reviewed_at      IS DISTINCT FROM OLD.reviewed_at
     OR NEW.notes            IS DISTINCT FROM OLD.notes THEN
    RAISE EXCEPTION 'Only administrators can modify review or status fields on sales_agent_applications';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_sales_agent_application_fields_trg ON public.sales_agent_applications;
CREATE TRIGGER protect_sales_agent_application_fields_trg
  BEFORE UPDATE ON public.sales_agent_applications
  FOR EACH ROW EXECUTE FUNCTION public.protect_sales_agent_application_fields();


-- 2. user_milestone_progress: only allow claiming a reward that is already unlocked;
-- block edits to unlocked_at / current_progress / milestone_id / user_id from the user policy.
CREATE OR REPLACE FUNCTION public.protect_user_milestone_progress_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Users may never change identity / progress / unlock fields directly
  IF NEW.user_id         IS DISTINCT FROM OLD.user_id
     OR NEW.milestone_id IS DISTINCT FROM OLD.milestone_id
     OR NEW.unlocked_at  IS DISTINCT FROM OLD.unlocked_at
     OR NEW.current_progress IS DISTINCT FROM OLD.current_progress THEN
    RAISE EXCEPTION 'Only administrators or server-side processes can modify milestone progress fields';
  END IF;

  -- reward_claimed may only transition false -> true, and only when milestone is unlocked
  IF NEW.reward_claimed IS DISTINCT FROM OLD.reward_claimed THEN
    IF OLD.reward_claimed = true THEN
      RAISE EXCEPTION 'Reward has already been claimed';
    END IF;
    IF NEW.reward_claimed = true AND OLD.unlocked_at IS NULL THEN
      RAISE EXCEPTION 'Cannot claim a reward for a milestone that has not been unlocked';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_user_milestone_progress_fields_trg ON public.user_milestone_progress;
CREATE TRIGGER protect_user_milestone_progress_fields_trg
  BEFORE UPDATE ON public.user_milestone_progress
  FOR EACH ROW EXECUTE FUNCTION public.protect_user_milestone_progress_fields();
