
DROP POLICY IF EXISTS "Org leaders can complete their own tasks" ON public.enterprise_org_onboarding_tasks;
CREATE POLICY "Org leaders can complete their own tasks"
ON public.enterprise_org_onboarding_tasks
FOR UPDATE
TO authenticated
USING (is_org_leader(auth.uid(), org_id) AND owner_side <> '1325')
WITH CHECK (is_org_leader(auth.uid(), org_id) AND owner_side <> '1325');
