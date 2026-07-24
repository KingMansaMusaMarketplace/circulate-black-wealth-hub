-- Add enrichment tracking columns to b2b_external_leads
ALTER TABLE public.b2b_external_leads
  ADD COLUMN IF NOT EXISTS enrichment_attempts integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS enrichment_source text,
  ADD COLUMN IF NOT EXISTS enrichment_details jsonb DEFAULT '{}'::jsonb;

-- Create enrichment log table for audit and debugging
CREATE TABLE IF NOT EXISTS public.kayla_enrichment_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.b2b_external_leads(id) ON DELETE CASCADE,
  run_id text,
  source_url text,
  emails_found text[],
  owner_name text,
  owner_email text,
  confidence_score numeric,
  extraction_method text,
  error_message text,
  created_at timestamp with time zone DEFAULT now()
);

-- Grants required for PostgREST access
GRANT SELECT, INSERT, UPDATE ON public.b2b_external_leads TO authenticated;
GRANT SELECT, INSERT ON public.kayla_enrichment_log TO authenticated;
GRANT ALL ON public.b2b_external_leads TO service_role;
GRANT ALL ON public.kayla_enrichment_log TO service_role;

-- Enable RLS on the new log table
ALTER TABLE public.kayla_enrichment_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read enrichment logs
CREATE POLICY "Admins can read enrichment logs"
  ON public.kayla_enrichment_log
  FOR SELECT
  TO authenticated
  USING (public.is_admin_secure());

CREATE POLICY "Service role can manage enrichment logs"
  ON public.kayla_enrichment_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);