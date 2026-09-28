CREATE OR REPLACE FUNCTION public.get_user_role(user_id_param uuid)
RETURNS app_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $function$
  SELECT role FROM public.user_roles
  WHERE user_id = user_id_param
    AND (user_id_param = auth.uid() OR public.is_admin_secure())
  ORDER BY CASE role WHEN 'admin'::app_role THEN 1 WHEN 'sales_agent'::app_role THEN 2 WHEN 'business'::app_role THEN 3 ELSE 4 END
  LIMIT 1;
$function$;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.redeem_beta_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_beta_code(text) TO authenticated, service_role;