-- Fix search_path for generate_api_key_prefix function
CREATE OR REPLACE FUNCTION public.generate_api_key_prefix(p_environment api_key_environment)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    RETURN CASE 
        WHEN p_environment = 'live' THEN '1325_live_'
        ELSE '1325_test_'
    END || substr(encode(gen_random_bytes(16), 'hex'), 1, 24);
END;
$$;