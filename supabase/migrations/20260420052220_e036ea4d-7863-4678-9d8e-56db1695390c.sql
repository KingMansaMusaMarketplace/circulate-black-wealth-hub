-- Create investor access log table
CREATE TABLE public.investor_access_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_name TEXT NOT NULL,
  investor_email TEXT NOT NULL,
  investor_firm TEXT,
  action_type TEXT NOT NULL,
  document_requested TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.investor_access_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Admins can view investor access logs"
ON public.investor_access_log
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only edge functions (service role) can insert
CREATE POLICY "Service role can insert access logs"
ON public.investor_access_log
FOR INSERT
WITH CHECK (false);

-- Index for fast lookups
CREATE INDEX idx_investor_access_log_email ON public.investor_access_log(investor_email);
CREATE INDEX idx_investor_access_log_created_at ON public.investor_access_log(created_at DESC);

-- Create private storage bucket for investor materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('investor-materials', 'investor-materials', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: only admins can manage; edge functions use service role for signed URLs
CREATE POLICY "Admins can manage investor materials"
ON storage.objects
FOR ALL
USING (bucket_id = 'investor-materials' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'investor-materials' AND public.has_role(auth.uid(), 'admin'));