DROP POLICY "Signed-in users can see review claims" ON public.listing_review_claims;
DROP POLICY "Users create own claims" ON public.listing_review_claims;
DROP POLICY "Users update own or expired claims" ON public.listing_review_claims;
DROP POLICY "Users delete own claims" ON public.listing_review_claims;
CREATE POLICY "Admins see review claims" ON public.listing_review_claims FOR SELECT TO authenticated USING (public.is_admin_secure());
CREATE POLICY "Admins create own claims" ON public.listing_review_claims FOR INSERT TO authenticated WITH CHECK (public.is_admin_secure() AND claimed_by = auth.uid());
CREATE POLICY "Admins update own or expired claims" ON public.listing_review_claims FOR UPDATE TO authenticated
  USING (public.is_admin_secure() AND (claimed_by = auth.uid() OR claimed_at < now() - interval '10 minutes'))
  WITH CHECK (public.is_admin_secure() AND claimed_by = auth.uid());
CREATE POLICY "Admins delete claims" ON public.listing_review_claims FOR DELETE TO authenticated USING (public.is_admin_secure());