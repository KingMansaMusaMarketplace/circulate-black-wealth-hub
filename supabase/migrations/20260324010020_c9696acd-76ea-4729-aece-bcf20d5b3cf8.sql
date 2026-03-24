-- RPC for SKIP LOCKED event claiming (prevents concurrent worker contention)
CREATE OR REPLACE FUNCTION public.claim_kayla_events(batch_size int DEFAULT 50)
RETURNS SETOF kayla_event_queue
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE kayla_event_queue
  SET status = 'processing'
  WHERE id IN (
    SELECT id FROM kayla_event_queue
    WHERE status IN ('pending', 'failed')
      AND retry_count < 3
    ORDER BY created_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT batch_size
  )
  RETURNING *;
$$;

-- Add version tracking columns to kayla_legal_templates
ALTER TABLE kayla_legal_templates 
  ADD COLUMN IF NOT EXISTS version integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS jurisdiction text,
  ADD COLUMN IF NOT EXISTS generated_at timestamptz DEFAULT now();