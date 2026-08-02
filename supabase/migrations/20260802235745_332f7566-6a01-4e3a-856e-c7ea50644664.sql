REVOKE EXECUTE ON FUNCTION public.is_org_leader(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.protect_enterprise_org_member_cols() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_org_leader(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid, uuid) TO authenticated, service_role;