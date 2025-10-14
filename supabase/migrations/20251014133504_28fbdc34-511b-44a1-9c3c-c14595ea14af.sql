-- Fix search_path for the new validation functions

CREATE OR REPLACE FUNCTION public.validate_uuid_input(input_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN input_uuid IS NOT NULL;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.sanitize_text_input(input_text text, max_length integer DEFAULT 500)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Trim and limit length
  RETURN substring(trim(input_text), 1, max_length);
END;
$$;