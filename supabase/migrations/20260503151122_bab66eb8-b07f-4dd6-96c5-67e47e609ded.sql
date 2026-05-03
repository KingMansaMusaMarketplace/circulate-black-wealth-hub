
-- Fix 1: Restrict service_role INSERT policies to actual service_role (not authenticated/anon)
DROP POLICY IF EXISTS "Service role can insert agent reports" ON public.kayla_agent_reports;
CREATE POLICY "Service role can insert agent reports" ON public.kayla_agent_reports
  FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert drafts" ON public.kayla_review_drafts;
CREATE POLICY "Service role can insert drafts" ON public.kayla_review_drafts
  FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert content" ON public.kayla_generated_content;
CREATE POLICY "Service role can insert content" ON public.kayla_generated_content
  FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert matches" ON public.kayla_b2b_matches;
CREATE POLICY "Service role can insert matches" ON public.kayla_b2b_matches
  FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can upsert scores" ON public.kayla_profile_scores;
CREATE POLICY "Service role can upsert scores" ON public.kayla_profile_scores
  FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert call logs" ON public.answering_call_logs;
CREATE POLICY "Service role can insert call logs" ON public.answering_call_logs
  FOR INSERT TO service_role WITH CHECK (true);

-- Fix 2: ai_agent_feedback UPDATE - prevent users from changing ownership of a row they don't own
DROP POLICY IF EXISTS "Users can rate their own agent feedback" ON public.ai_agent_feedback;
CREATE POLICY "Users can rate their own agent feedback" ON public.ai_agent_feedback
  FOR UPDATE TO authenticated
  USING (
    (user_id = auth.uid())
    OR ((business_id IS NOT NULL) AND (EXISTS (
      SELECT 1 FROM businesses b WHERE b.id = ai_agent_feedback.business_id AND b.owner_id = auth.uid()
    )))
  )
  WITH CHECK (
    (user_id = auth.uid())
    OR ((business_id IS NOT NULL) AND (EXISTS (
      SELECT 1 FROM businesses b WHERE b.id = ai_agent_feedback.business_id AND b.owner_id = auth.uid()
    )))
  );

-- Fix 3: Add deny-all policies to RLS-enabled tables with no policies (silences linter, behavior unchanged)
CREATE POLICY "Service role only" ON public.phone_verification_otps
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role only" ON public.auth_rate_limits_v2
  FOR ALL TO service_role USING (true) WITH CHECK (true);
