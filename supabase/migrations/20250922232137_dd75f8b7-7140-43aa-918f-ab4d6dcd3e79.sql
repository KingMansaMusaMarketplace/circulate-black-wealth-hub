-- Fix the function search path security warning
DROP FUNCTION IF EXISTS update_sales_agent_applications_updated_at();

-- Recreate the function with proper security settings
CREATE OR REPLACE FUNCTION update_sales_agent_applications_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;