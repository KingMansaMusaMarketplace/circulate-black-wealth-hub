-- Create media kit access requests table
CREATE TABLE public.media_kit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  reason TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('partnership_guide', 'investor_analysis')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  download_token TEXT UNIQUE,
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.media_kit_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit access requests"
ON public.media_kit_requests
FOR INSERT
WITH CHECK (true);

-- Admins can view and manage all requests
CREATE POLICY "Admins can manage access requests"
ON public.media_kit_requests
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_media_kit_requests_status ON public.media_kit_requests(status);
CREATE INDEX idx_media_kit_requests_email ON public.media_kit_requests(email);
CREATE INDEX idx_media_kit_requests_document_type ON public.media_kit_requests(document_type);