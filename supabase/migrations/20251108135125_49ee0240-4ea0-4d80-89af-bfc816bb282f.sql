-- Enable RLS on notification batching tables
ALTER TABLE notification_batch_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_batches ENABLE ROW LEVEL SECURITY;

-- RLS policies for notification_batch_queue (admin only)
CREATE POLICY "Admins can view notification batch queue"
ON notification_batch_queue
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "System can insert to batch queue"
ON notification_batch_queue
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "System can update batch queue"
ON notification_batch_queue
FOR UPDATE
TO authenticated
USING (true);

-- RLS policies for notification_batches (admin only)
CREATE POLICY "Admins can view notification batches"
ON notification_batches
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "System can insert batches"
ON notification_batches
FOR INSERT
TO authenticated
WITH CHECK (true);
