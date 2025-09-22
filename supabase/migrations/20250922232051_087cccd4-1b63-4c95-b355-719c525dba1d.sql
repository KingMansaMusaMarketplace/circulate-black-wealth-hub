-- Fix sales agent applications table structure and enhance security
-- Add missing columns that the API expects
ALTER TABLE public.sales_agent_applications 
ADD COLUMN IF NOT EXISTS why_join TEXT,
ADD COLUMN IF NOT EXISTS business_experience TEXT, 
ADD COLUMN IF NOT EXISTS marketing_ideas TEXT;

-- Ensure user_id is NOT NULL for proper RLS security
ALTER TABLE public.sales_agent_applications 
ALTER COLUMN user_id SET NOT NULL;

-- Add an index on user_id for performance
CREATE INDEX IF NOT EXISTS idx_sales_agent_applications_user_id 
ON public.sales_agent_applications(user_id);

-- Add updated_at column and trigger for proper auditing
ALTER TABLE public.sales_agent_applications 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_sales_agent_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sales_agent_applications_updated_at
    BEFORE UPDATE ON public.sales_agent_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_sales_agent_applications_updated_at();