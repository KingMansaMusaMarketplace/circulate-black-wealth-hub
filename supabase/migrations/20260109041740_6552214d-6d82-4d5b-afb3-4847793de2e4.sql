-- Create scheduled searches table for automated recurring discovery
CREATE TABLE public.scheduled_discovery_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_name TEXT NOT NULL,
  query TEXT NOT NULL,
  category TEXT,
  location TEXT,
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('hourly', 'daily', 'weekly')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  leads_found_total INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scheduled_discovery_searches ENABLE ROW LEVEL SECURITY;

-- Only admins can manage scheduled searches (using user_type = 'admin')
CREATE POLICY "Admins can manage scheduled searches"
ON public.scheduled_discovery_searches
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_scheduled_discovery_searches_updated_at
  BEFORE UPDATE ON public.scheduled_discovery_searches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add priority_rank column to b2b_external_leads if it doesn't exist
ALTER TABLE public.b2b_external_leads ADD COLUMN IF NOT EXISTS priority_rank TEXT DEFAULT 'normal';

-- Add last_enriched_at column if it doesn't exist  
ALTER TABLE public.b2b_external_leads ADD COLUMN IF NOT EXISTS last_enriched_at TIMESTAMP WITH TIME ZONE;

-- Create index for priority leads queries
CREATE INDEX IF NOT EXISTS idx_b2b_external_leads_priority 
ON public.b2b_external_leads (priority_rank, lead_score DESC NULLS LAST)
WHERE priority_rank = 'high' OR lead_score >= 70;