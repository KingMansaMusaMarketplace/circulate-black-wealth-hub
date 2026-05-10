
-- Close privilege escalation: prevent regular users from creating/updating
-- b2b_external_leads rows (which would expose claim_token via SELECT policy).
-- Lead creation must go through admin-curated flows or service-role edge functions.

DROP POLICY IF EXISTS "Users can create leads" ON public.b2b_external_leads;
DROP POLICY IF EXISTS "Users can update their leads" ON public.b2b_external_leads;

-- Revoke column access to claim/invitation tokens from anon and authenticated.
-- Service role and admins (via SECURITY DEFINER functions) retain access.
REVOKE SELECT (claim_token, invitation_token, claim_token_expires_at)
  ON public.b2b_external_leads FROM anon, authenticated;
