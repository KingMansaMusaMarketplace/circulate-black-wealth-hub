CREATE OR REPLACE FUNCTION public.get_business_locations(p_parent_business_id uuid)
 RETURNS TABLE(id uuid, business_name character varying, location_name character varying, city character varying, state character varying, location_manager_id uuid, is_verified boolean, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT (
    EXISTS (SELECT 1 FROM businesses p WHERE p.id = p_parent_business_id AND p.owner_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  ) THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
  SELECT b.id, b.business_name, b.location_name, b.city, b.state, b.location_manager_id, b.is_verified, b.created_at
  FROM businesses b
  WHERE b.parent_business_id = p_parent_business_id
  ORDER BY b.location_name;
END;
$function$;