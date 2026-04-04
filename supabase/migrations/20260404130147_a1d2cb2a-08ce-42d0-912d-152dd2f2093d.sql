
-- Add conditional logic and delay support to workflow_actions
ALTER TABLE public.workflow_actions 
ADD COLUMN IF NOT EXISTS condition_config jsonb DEFAULT null,
ADD COLUMN IF NOT EXISTS delay_seconds integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_condition boolean DEFAULT false;

-- Create execution steps table to track individual action results
CREATE TABLE IF NOT EXISTS public.workflow_execution_steps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_id uuid NOT NULL REFERENCES public.workflow_executions(id) ON DELETE CASCADE,
  action_id uuid NOT NULL REFERENCES public.workflow_actions(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')),
  input_data jsonb DEFAULT null,
  output_data jsonb DEFAULT null,
  error_message text DEFAULT null,
  started_at timestamptz DEFAULT null,
  completed_at timestamptz DEFAULT null,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create workflow schedules for delayed actions
CREATE TABLE IF NOT EXISTS public.workflow_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_id uuid NOT NULL REFERENCES public.workflow_executions(id) ON DELETE CASCADE,
  action_id uuid NOT NULL REFERENCES public.workflow_actions(id) ON DELETE CASCADE,
  scheduled_for timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 3,
  last_error text DEFAULT null,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz DEFAULT null
);

-- Index for fast status lookups
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON public.workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_steps_execution ON public.workflow_execution_steps(execution_id);
CREATE INDEX IF NOT EXISTS idx_workflow_schedules_pending ON public.workflow_schedules(scheduled_for) WHERE status = 'pending';

-- Enable RLS
ALTER TABLE public.workflow_execution_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_schedules ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view execution steps for their business workflows
CREATE POLICY "Users can view their workflow execution steps"
ON public.workflow_execution_steps FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workflow_executions we
    JOIN public.workflows w ON w.id = we.workflow_id
    WHERE we.id = workflow_execution_steps.execution_id
    AND w.business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can view their workflow schedules"
ON public.workflow_schedules FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workflow_executions we
    JOIN public.workflows w ON w.id = we.workflow_id
    WHERE we.id = workflow_schedules.execution_id
    AND w.business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  )
);

-- Service role can manage all execution data
CREATE POLICY "Service role manages execution steps"
ON public.workflow_execution_steps FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Service role manages schedules"
ON public.workflow_schedules FOR ALL
USING (auth.role() = 'service_role');

-- Function to claim pending schedules (prevents concurrent processing)
CREATE OR REPLACE FUNCTION public.claim_workflow_schedules(batch_size integer DEFAULT 10)
RETURNS SETOF public.workflow_schedules
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE public.workflow_schedules
  SET status = 'processing', attempts = attempts + 1
  WHERE id IN (
    SELECT id FROM public.workflow_schedules
    WHERE status = 'pending'
    AND scheduled_for <= now()
    AND attempts < max_attempts
    ORDER BY scheduled_for ASC
    LIMIT batch_size
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
END;
$$;
