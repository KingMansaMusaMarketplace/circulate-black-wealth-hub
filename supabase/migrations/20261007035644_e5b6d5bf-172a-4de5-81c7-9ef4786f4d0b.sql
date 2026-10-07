CREATE OR REPLACE FUNCTION public.get_public_profile_info(user_ids uuid[])
RETURNS TABLE(id uuid, display_name text, avatar_url text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $function$
  -- Public display: first name + last initial only (e.g. "Thomas B.").
  SELECT p.id,
    CASE
      WHEN p.full_name IS NULL OR btrim(p.full_name) = '' THEN NULL
      WHEN array_length(regexp_split_to_array(btrim(p.full_name), '\s+'), 1) = 1 THEN btrim(p.full_name)
      ELSE split_part(btrim(p.full_name), ' ', 1) || ' ' ||
           upper(left((regexp_split_to_array(btrim(p.full_name), '\s+'))[array_length(regexp_split_to_array(btrim(p.full_name), '\s+'), 1)], 1)) || '.'
    END AS display_name,
    p.avatar_url
  FROM profiles p
  WHERE p.id = ANY(user_ids);
$function$;