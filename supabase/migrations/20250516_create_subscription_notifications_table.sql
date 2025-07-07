
-- Create subscription_notifications table to track webhook events
CREATE TABLE IF NOT EXISTS public.subscription_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type TEXT NOT NULL,
  subtype TEXT,
  source TEXT NOT NULL, -- 'stripe', 'apple', 'apple_sandbox'
  environment TEXT DEFAULT 'production',
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_affected UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscription_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all notifications
CREATE POLICY "Admins can view all notifications" ON public.subscription_notifications
FOR SELECT
USING (is_admin());

-- Create policy for webhook functions to insert notifications
CREATE POLICY "Webhook functions can insert notifications" ON public.subscription_notifications
FOR INSERT
WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS subscription_notifications_source_idx ON public.subscription_notifications(source);
CREATE INDEX IF NOT EXISTS subscription_notifications_type_idx ON public.subscription_notifications(notification_type);
CREATE INDEX IF NOT EXISTS subscription_notifications_processed_at_idx ON public.subscription_notifications(processed_at);

-- Enable realtime for notifications
ALTER TABLE public.subscription_notifications REPLICA IDENTITY FULL;
