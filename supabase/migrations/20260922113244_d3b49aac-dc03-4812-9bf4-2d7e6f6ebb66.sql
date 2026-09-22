-- 1. social_shares: stop exposing every user's sharing activity publicly
DROP POLICY IF EXISTS "Anyone can view social shares" ON public.social_shares;

CREATE POLICY "Users business owners and admins can view social shares"
ON public.social_shares
FOR SELECT
TO authenticated
USING (
  auth.uid() = shared_by
  OR EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = social_shares.business_id AND b.owner_id = auth.uid()
  )
  OR public.zzz_is_priv_actor()
);

-- 2. sponsor_agreements: public submissions allowed, but no self-set payment/approval fields
DROP POLICY IF EXISTS "Anyone can submit a signed sponsor agreement" ON public.sponsor_agreements;

CREATE POLICY "Anyone can submit a signed sponsor agreement"
ON public.sponsor_agreements
FOR INSERT
TO anon, authenticated
WITH CHECK (
  coalesce(status, 'pending') = 'pending'
  AND stripe_customer_id IS NULL
  AND stripe_invoice_id IS NULL
  AND stripe_invoice_url IS NULL
  AND stripe_invoice_number IS NULL
  AND invoice_sent_at IS NULL
  AND paid_at IS NULL
  AND admin_notes IS NULL
  AND agreed_terms IS TRUE
  AND signature_typed_name IS NOT NULL
  AND contact_email IS NOT NULL
);

-- 3. investor_access_requests: public submissions allowed, but no self-approval
DROP POLICY IF EXISTS "Anyone can submit an investor access request" ON public.investor_access_requests;

CREATE POLICY "Anyone can submit an investor access request"
ON public.investor_access_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  coalesce(status, 'pending') = 'pending'
  AND reviewed_by IS NULL
  AND reviewed_at IS NULL
  AND admin_notes IS NULL
  AND approval_email_sent_at IS NULL
  AND name IS NOT NULL
  AND email IS NOT NULL
);
