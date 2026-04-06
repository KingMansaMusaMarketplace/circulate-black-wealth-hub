
-- FIX 1: Corporate subscriptions privilege escalation
-- The existing WITH CHECK is broken: NOT (x IS DISTINCT FROM x) is always TRUE
-- Replace with a trigger that blocks non-admin modifications to sensitive fields

DROP POLICY IF EXISTS "Sponsors can update their display info" ON corporate_subscriptions;

-- New policy: sponsors can update their own row (the trigger will enforce field restrictions)
CREATE POLICY "Sponsors can update their display info"
ON corporate_subscriptions FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger to prevent sponsors from modifying admin-controlled fields
CREATE OR REPLACE FUNCTION protect_corporate_subscription_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If user is admin, allow all changes
  IF is_admin_secure() THEN
    RETURN NEW;
  END IF;

  -- Non-admins: block changes to sensitive fields
  IF NEW.approval_status IS DISTINCT FROM OLD.approval_status THEN
    RAISE EXCEPTION 'Cannot modify approval_status';
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Cannot modify status';
  END IF;
  IF NEW.is_founding_sponsor IS DISTINCT FROM OLD.is_founding_sponsor THEN
    RAISE EXCEPTION 'Cannot modify is_founding_sponsor';
  END IF;
  IF NEW.logo_approved IS DISTINCT FROM OLD.logo_approved THEN
    RAISE EXCEPTION 'Cannot modify logo_approved';
  END IF;
  IF NEW.is_visible IS DISTINCT FROM OLD.is_visible THEN
    RAISE EXCEPTION 'Cannot modify is_visible';
  END IF;
  IF NEW.tier IS DISTINCT FROM OLD.tier THEN
    RAISE EXCEPTION 'Cannot modify tier';
  END IF;
  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Cannot modify user_id';
  END IF;

  RETURN NEW;
END;
$$;

-- Drop if exists to avoid duplicate
DROP TRIGGER IF EXISTS protect_corporate_subscription_fields_trigger ON corporate_subscriptions;

CREATE TRIGGER protect_corporate_subscription_fields_trigger
BEFORE UPDATE ON corporate_subscriptions
FOR EACH ROW
EXECUTE FUNCTION protect_corporate_subscription_fields();

-- FIX 2: Knowledge base articles - drafts exposed to anonymous users
DROP POLICY IF EXISTS "Anyone can view published knowledge base articles" ON knowledge_base_articles;

-- Anonymous users: only see published platform-wide articles
CREATE POLICY "Anon can view published platform articles"
ON knowledge_base_articles FOR SELECT TO anon
USING (is_published = true AND business_id IS NULL);

-- Authenticated users: see published articles + their own business articles (including drafts)
CREATE POLICY "Authenticated can view knowledge base articles"
ON knowledge_base_articles FOR SELECT TO authenticated
USING (
  is_published = true
  OR business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  )
);
