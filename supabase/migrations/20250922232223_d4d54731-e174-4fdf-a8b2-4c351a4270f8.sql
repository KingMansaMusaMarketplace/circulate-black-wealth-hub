-- Fix the function search path security warning by properly recreating the function and trigger
-- First drop the trigger
DROP TRIGGER IF EXISTS trigger_update_sales_agent_applications_updated_at ON public.sales_agent_applications;

-- Then drop the function
DROP FUNCTION IF EXISTS update_sales_agent_applications_updated_at();

-- Recreate the function with proper security settings
CREATE OR REPLACE FUNCTION public.update_sales_agent_applications_updated_at()
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

-- Recreate the trigger
CREATE TRIGGER trigger_update_sales_agent_applications_updated_at
    BEFORE UPDATE ON public.sales_agent_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_sales_agent_applications_updated_at();