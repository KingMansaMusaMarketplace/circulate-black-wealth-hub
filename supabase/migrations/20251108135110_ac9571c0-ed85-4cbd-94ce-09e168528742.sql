-- Create notification batching table
CREATE TABLE IF NOT EXISTS notification_batch_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  batch_key TEXT NOT NULL, -- Used to group similar notifications
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  batch_id UUID
);

-- Create index for efficient querying
CREATE INDEX idx_notification_batch_queue_unprocessed 
  ON notification_batch_queue(batch_key, created_at) 
  WHERE processed_at IS NULL;

CREATE INDEX idx_notification_batch_queue_created 
  ON notification_batch_queue(created_at) 
  WHERE processed_at IS NULL;

-- Create notification batches table to track sent batches
CREATE TABLE IF NOT EXISTS notification_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_key TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  event_count INTEGER NOT NULL DEFAULT 0,
  events JSONB NOT NULL DEFAULT '[]'::jsonb,
  recipients TEXT[] NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add batching preferences to admin_notification_preferences
ALTER TABLE admin_notification_preferences
ADD COLUMN IF NOT EXISTS enable_batching BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS batch_window_minutes INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS min_batch_size INTEGER DEFAULT 2;

-- Create function to clean up old batch queue entries
CREATE OR REPLACE FUNCTION cleanup_old_batch_queue()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Delete processed entries older than 7 days
  DELETE FROM notification_batch_queue
  WHERE processed_at IS NOT NULL 
  AND processed_at < now() - interval '7 days';
  
  -- Delete old batch records older than 30 days
  DELETE FROM notification_batches
  WHERE created_at < now() - interval '30 days';
END;
$$;

COMMENT ON TABLE notification_batch_queue IS 'Temporary queue for batching notifications before sending';
COMMENT ON TABLE notification_batches IS 'Record of sent notification batches for audit purposes';
