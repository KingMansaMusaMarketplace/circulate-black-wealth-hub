-- Fix: Split the ALL policy on ticket_resolution_templates
-- so business owners can only READ global templates (business_id IS NULL)
-- but can fully manage their own templates.

DROP POLICY IF EXISTS "Business owners can manage resolution templates" ON ticket_resolution_templates;

-- 1. Business owners can READ all templates (their own + global)
CREATE POLICY "Business owners can read templates"
  ON ticket_resolution_templates FOR SELECT TO authenticated
  USING (
    (business_id IS NULL)
    OR (EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = ticket_resolution_templates.business_id
        AND b.owner_id = auth.uid()
    ))
  );

-- 2. Business owners can INSERT/UPDATE/DELETE only their own templates (not global)
CREATE POLICY "Business owners can manage own templates"
  ON ticket_resolution_templates FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = ticket_resolution_templates.business_id
        AND b.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    business_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = ticket_resolution_templates.business_id
        AND b.owner_id = auth.uid()
    )
  );

-- 3. Admins can fully manage global templates
CREATE POLICY "Admins can manage global templates"
  ON ticket_resolution_templates FOR ALL TO authenticated
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());