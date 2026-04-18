-- Restore email/phone column grants for authenticated users.
-- Privacy is enforced by RLS row policies + the businesses_public_safe view.
-- anon role still cannot read email/phone (only the safe columns granted previously).

GRANT SELECT (email, phone) ON public.businesses TO authenticated;