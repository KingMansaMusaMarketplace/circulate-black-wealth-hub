
CREATE OR REPLACE FUNCTION public.submit_business(
  p_business_name text,
  p_website text,
  p_email text,
  p_phone text,
  p_owner_name text,
  p_city text,
  p_state text,
  p_category text,
  p_user_agent text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  -- Length + basic checks (mirror the RLS WITH CHECK constraints)
  IF length(coalesce(p_business_name,'')) < 2 OR length(p_business_name) > 200 THEN
    RAISE EXCEPTION 'Invalid business name';
  END IF;
  IF length(coalesce(p_website,'')) < 4 OR length(p_website) > 500 THEN
    RAISE EXCEPTION 'Invalid website';
  END IF;
  IF length(coalesce(p_email,'')) < 5 OR length(p_email) > 255 THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;
  IF length(coalesce(p_phone,'')) < 7 OR length(p_phone) > 30 THEN
    RAISE EXCEPTION 'Invalid phone';
  END IF;
  IF length(coalesce(p_owner_name,'')) < 2 OR length(p_owner_name) > 200 THEN
    RAISE EXCEPTION 'Invalid owner name';
  END IF;
  IF length(coalesce(p_category,'')) < 1 THEN
    RAISE EXCEPTION 'Category required';
  END IF;

  INSERT INTO public.business_submissions (
    business_name, website, email, phone, owner_name, city, state, category,
    attests_ownership, attests_black_owned, submitter_user_agent
  ) VALUES (
    trim(p_business_name), trim(p_website), trim(p_email), trim(p_phone),
    trim(p_owner_name), trim(p_city), trim(p_state), trim(p_category),
    true, true, left(coalesce(p_user_agent,''), 500)
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_business(text,text,text,text,text,text,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_business(text,text,text,text,text,text,text,text,text) TO anon, authenticated;
