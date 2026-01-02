-- Create table for storing externally discovered B2B leads from Perplexity web search
CREATE TABLE public.b2b_external_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discovered_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  discovered_by_business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  source_query TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_description TEXT,
  category TEXT,
  contact_info JSONB DEFAULT '{}'::jsonb,
  website_url TEXT,
  location TEXT,
  source_citations TEXT[] DEFAULT '{}',
  is_invited BOOLEAN DEFAULT FALSE,
  invited_at TIMESTAMPTZ,
  is_converted BOOLEAN DEFAULT FALSE,
  converted_business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.b2b_external_leads ENABLE ROW LEVEL SECURITY;

-- Users can view leads they discovered
CREATE POLICY "Users can view their discovered leads"
ON public.b2b_external_leads
FOR SELECT
USING (auth.uid() = discovered_by_user_id);

-- Users can insert leads they discover
CREATE POLICY "Users can create leads"
ON public.b2b_external_leads
FOR INSERT
WITH CHECK (auth.uid() = discovered_by_user_id);

-- Users can update their own leads
CREATE POLICY "Users can update their leads"
ON public.b2b_external_leads
FOR UPDATE
USING (auth.uid() = discovered_by_user_id);

-- Admins can view all leads
CREATE POLICY "Admins can view all leads"
ON public.b2b_external_leads
FOR SELECT
USING (public.is_admin_secure());

-- Create index for faster queries
CREATE INDEX idx_b2b_external_leads_user ON public.b2b_external_leads(discovered_by_user_id);
CREATE INDEX idx_b2b_external_leads_category ON public.b2b_external_leads(category);
CREATE INDEX idx_b2b_external_leads_created ON public.b2b_external_leads(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_b2b_external_leads_updated_at
BEFORE UPDATE ON public.b2b_external_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();