-- Fix security issue: Set search_path for the function
CREATE OR REPLACE FUNCTION update_platform_transactions_updated_at()
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