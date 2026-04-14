-- Revoke anon SELECT on sensitive contact columns in the businesses table
-- This prevents unauthenticated users from reading email/phone even if they query the base table directly
REVOKE SELECT (email, phone) ON public.businesses FROM anon;

-- Also revoke from authenticated role to enforce access only through owner/admin policies
-- Owners/admins still get full access via their ALL policy (which runs as the policy definer)
REVOKE SELECT (email, phone) ON public.businesses FROM authenticated;

-- Grant email/phone SELECT back only to service_role (used by edge functions)
GRANT SELECT (email, phone) ON public.businesses TO service_role;