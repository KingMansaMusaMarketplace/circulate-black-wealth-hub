-- Fix: Business Invitations public SELECT policy exposes all records to unauthenticated users
-- Replace overly broad USING(true) with token-scoped lookup + owner access

DROP POLICY IF EXISTS "Anyone can read invitation by token" ON business_invitations;

CREATE POLICY "Read invitation by exact token" ON business_invitations
  FOR SELECT TO public
  USING (
    invitation_token = coalesce(current_setting('request.headers', true)::json->>'x-invitation-token', '')
  );

CREATE POLICY "Inviter can read own invitations" ON business_invitations
  FOR SELECT TO authenticated
  USING (inviter_user_id = auth.uid());