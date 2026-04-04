
-- OTP: remove user-facing SELECT policy
DROP POLICY IF EXISTS "Users can view their own OTPs" ON public.phone_verification_otps;

-- Ticket resolution templates: split ALL policy
DROP POLICY IF EXISTS "Business owners can manage resolution templates" ON public.ticket_resolution_templates;

CREATE POLICY "Business owners can read resolution templates"
  ON public.ticket_resolution_templates FOR SELECT TO authenticated
  USING (
    (business_id IS NULL)
    OR EXISTS (SELECT 1 FROM businesses b WHERE b.id = ticket_resolution_templates.business_id AND b.owner_id = auth.uid())
  );

CREATE POLICY "Business owners can manage own resolution templates"
  ON public.ticket_resolution_templates FOR INSERT TO authenticated
  WITH CHECK (
    business_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM businesses b WHERE b.id = ticket_resolution_templates.business_id AND b.owner_id = auth.uid())
  );

CREATE POLICY "Business owners can update own resolution templates"
  ON public.ticket_resolution_templates FOR UPDATE TO authenticated
  USING (
    business_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM businesses b WHERE b.id = ticket_resolution_templates.business_id AND b.owner_id = auth.uid())
  )
  WITH CHECK (
    business_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM businesses b WHERE b.id = ticket_resolution_templates.business_id AND b.owner_id = auth.uid())
  );

CREATE POLICY "Business owners can delete own resolution templates"
  ON public.ticket_resolution_templates FOR DELETE TO authenticated
  USING (
    business_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM businesses b WHERE b.id = ticket_resolution_templates.business_id AND b.owner_id = auth.uid())
  );

CREATE POLICY "Admins can manage global resolution templates"
  ON public.ticket_resolution_templates FOR ALL TO authenticated
  USING (public.is_admin_secure())
  WITH CHECK (public.is_admin_secure());
