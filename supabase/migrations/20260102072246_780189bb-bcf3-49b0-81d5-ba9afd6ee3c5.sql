-- Create email_events table for tracking Resend webhook events
CREATE TABLE public.email_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT,
  from_email TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  lead_id UUID REFERENCES public.b2b_external_leads(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for fast querying
CREATE INDEX idx_email_events_email_id ON public.email_events(email_id);
CREATE INDEX idx_email_events_event_type ON public.email_events(event_type);
CREATE INDEX idx_email_events_recipient ON public.email_events(recipient_email);
CREATE INDEX idx_email_events_lead_id ON public.email_events(lead_id);
CREATE INDEX idx_email_events_timestamp ON public.email_events(timestamp DESC);

-- Enable RLS
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

-- Admin-only read access
CREATE POLICY "Admins can view all email events"
  ON public.email_events
  FOR SELECT
  USING (public.is_admin_secure());

-- Service role can insert (for webhook)
CREATE POLICY "Service role can insert email events"
  ON public.email_events
  FOR INSERT
  WITH CHECK (true);

-- Add invitation_opened_at column to b2b_external_leads if not exists
ALTER TABLE public.b2b_external_leads 
ADD COLUMN IF NOT EXISTS invitation_opened_at TIMESTAMP WITH TIME ZONE;

-- Add comment for documentation
COMMENT ON TABLE public.email_events IS 'Stores email delivery events from Resend webhooks for tracking opens, clicks, bounces, etc.';