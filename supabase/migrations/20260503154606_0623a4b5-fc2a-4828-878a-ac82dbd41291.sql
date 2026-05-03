-- Add explicit service_role INSERT/UPDATE/DELETE policies for ai_agent_actions
-- and other Kayla tables that the event processor writes to but currently
-- have no service_role policy. Service role normally bypasses RLS, but
-- explicit policies make intent visible and protect against future RLS changes.

CREATE POLICY "Service role manages ai_agent_actions"
ON public.ai_agent_actions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- kayla_run_log — append-only audit log for Kayla agent runs
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid = 'public.kayla_run_log'::regclass AND polname = 'Service role manages run log') THEN
    EXECUTE $sql$
      CREATE POLICY "Service role manages run log"
      ON public.kayla_run_log
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
    $sql$;
  END IF;
END $$;

-- kayla_learning_signals
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid = 'public.kayla_learning_signals'::regclass AND polname = 'Service role manages learning signals') THEN
    EXECUTE $sql$
      CREATE POLICY "Service role manages learning signals"
      ON public.kayla_learning_signals
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
    $sql$;
  END IF;
END $$;

-- kayla_learnings
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid = 'public.kayla_learnings'::regclass AND polname = 'Service role manages learnings') THEN
    EXECUTE $sql$
      CREATE POLICY "Service role manages learnings"
      ON public.kayla_learnings
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
    $sql$;
  END IF;
END $$;

-- kayla_outcome_feedback
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid = 'public.kayla_outcome_feedback'::regclass AND polname = 'Service role manages outcome feedback') THEN
    EXECUTE $sql$
      CREATE POLICY "Service role manages outcome feedback"
      ON public.kayla_outcome_feedback
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
    $sql$;
  END IF;
END $$;

-- ai_chat_sessions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid = 'public.ai_chat_sessions'::regclass AND polname = 'Service role manages chat sessions') THEN
    EXECUTE $sql$
      CREATE POLICY "Service role manages chat sessions"
      ON public.ai_chat_sessions
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
    $sql$;
  END IF;
END $$;

-- ai_agent_feedback
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid = 'public.ai_agent_feedback'::regclass AND polname = 'Service role manages agent feedback') THEN
    EXECUTE $sql$
      CREATE POLICY "Service role manages agent feedback"
      ON public.ai_agent_feedback
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
    $sql$;
  END IF;
END $$;

-- notifications
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid = 'public.notifications'::regclass AND polname = 'Service role manages notifications') THEN
    EXECUTE $sql$
      CREATE POLICY "Service role manages notifications"
      ON public.notifications
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
    $sql$;
  END IF;
END $$;