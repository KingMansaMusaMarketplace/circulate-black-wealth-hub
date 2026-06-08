
-- Fix 1: Restrict sales_agents INSERT to admin only (prevent self-promotion)
DROP POLICY IF EXISTS "Agents can insert own data" ON public.sales_agents;
CREATE POLICY "Only admins can insert sales agents"
ON public.sales_agents
FOR INSERT
TO authenticated
WITH CHECK (is_admin_secure());

-- Fix 2: Restrict sales_agent_test_attempts INSERT to service_role only (prevent fake scores)
DROP POLICY IF EXISTS "Users can insert their own test attempts" ON public.sales_agent_test_attempts;
-- No INSERT policy for authenticated users; service_role bypasses RLS.
-- Test attempts must be created via SECURITY DEFINER RPC / edge function that scores authoritatively.

-- Fix 3: Block non-admins from changing protected fields on sales_agent_applications
-- WITH CHECK alone can't compare OLD vs NEW, so use a BEFORE UPDATE trigger.
CREATE OR REPLACE FUNCTION public.protect_sales_agent_application_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admins can change anything
  IF public.is_admin_secure() THEN
    RETURN NEW;
  END IF;

  -- Non-admins: block changes to protected/review fields
  IF NEW.application_status IS DISTINCT FROM OLD.application_status
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.test_passed IS DISTINCT FROM OLD.test_passed
     OR NEW.test_score IS DISTINCT FROM OLD.test_score
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
     OR NEW.notes IS DISTINCT FROM OLD.notes
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
  THEN
    RAISE EXCEPTION 'Not allowed to modify protected application fields';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_sales_agent_application_fields ON public.sales_agent_applications;
CREATE TRIGGER trg_protect_sales_agent_application_fields
BEFORE UPDATE ON public.sales_agent_applications
FOR EACH ROW
EXECUTE FUNCTION public.protect_sales_agent_application_fields();

-- Also tighten the user UPDATE policy with a WITH CHECK so RLS contributes defense-in-depth
DROP POLICY IF EXISTS "Users can update their own applications" ON public.sales_agent_applications;
CREATE POLICY "Users can update their own applications"
ON public.sales_agent_applications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
