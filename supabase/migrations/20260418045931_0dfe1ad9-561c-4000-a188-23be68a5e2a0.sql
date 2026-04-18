DROP POLICY IF EXISTS "Read invitation by exact token" ON public.business_invitations;

CREATE OR REPLACE FUNCTION public.get_invitation_by_token(p_token text)
RETURNS TABLE (
  id uuid,
  invitee_business_name text,
  message text,
  status text,
  expires_at timestamptz,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    bi.id,
    bi.invitee_business_name,
    bi.message,
    bi.status,
    bi.expires_at,
    bi.created_at
  FROM public.business_invitations bi
  WHERE bi.invitation_token = p_token
    AND bi.expires_at > now()
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_invitation_by_token(text) TO anon, authenticated;