
-- Create action taken enum
CREATE TYPE public.answering_action AS ENUM ('answered_faq', 'took_message', 'forwarded');

-- Create business_answering_config table
CREATE TABLE public.business_answering_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  greeting_message TEXT NOT NULL DEFAULT 'Thanks for reaching out! How can I help you today?',
  business_hours JSONB NOT NULL DEFAULT '{"monday":{"open":"09:00","close":"17:00"},"tuesday":{"open":"09:00","close":"17:00"},"wednesday":{"open":"09:00","close":"17:00"},"thursday":{"open":"09:00","close":"17:00"},"friday":{"open":"09:00","close":"17:00"},"saturday":null,"sunday":null}'::jsonb,
  faq_entries JSONB NOT NULL DEFAULT '[]'::jsonb,
  forwarding_number TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  voice_id TEXT DEFAULT 'default',
  max_call_duration_seconds INTEGER NOT NULL DEFAULT 300,
  twilio_phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id)
);

-- Create answering_call_logs table
CREATE TABLE public.answering_call_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  caller_number TEXT NOT NULL,
  call_duration INTEGER DEFAULT 0,
  channel TEXT NOT NULL DEFAULT 'sms',
  transcript TEXT,
  summary TEXT,
  action_taken public.answering_action NOT NULL DEFAULT 'answered_faq',
  sentiment TEXT DEFAULT 'neutral',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_answering_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answering_call_logs ENABLE ROW LEVEL SECURITY;

-- RLS for business_answering_config: owners only
CREATE POLICY "Owners can view own answering config"
ON public.business_answering_config FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Owners can create answering config"
ON public.business_answering_config FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own answering config"
ON public.business_answering_config FOR UPDATE
TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete own answering config"
ON public.business_answering_config FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- RLS for answering_call_logs: owners can view logs for their businesses
CREATE POLICY "Owners can view own call logs"
ON public.answering_call_logs FOR SELECT
TO authenticated
USING (business_id IN (
  SELECT business_id FROM public.business_answering_config WHERE owner_id = auth.uid()
));

CREATE POLICY "Service can insert call logs"
ON public.answering_call_logs FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Indexes
CREATE INDEX idx_answering_config_business ON public.business_answering_config(business_id);
CREATE INDEX idx_answering_config_owner ON public.business_answering_config(owner_id);
CREATE INDEX idx_answering_config_phone ON public.business_answering_config(twilio_phone_number);
CREATE INDEX idx_call_logs_business ON public.answering_call_logs(business_id);
CREATE INDEX idx_call_logs_created ON public.answering_call_logs(created_at DESC);

-- Updated at trigger
CREATE TRIGGER update_answering_config_updated_at
BEFORE UPDATE ON public.business_answering_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
