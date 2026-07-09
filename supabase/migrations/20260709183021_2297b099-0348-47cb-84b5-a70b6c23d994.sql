
-- 1) businesses: stop exposing email/phone (and address) to anon/authenticated via public SELECT.
--    Sensitive contact PII already lives in public.businesses_private (owner/admin-only).
--    First, backfill businesses_private from businesses so owners don't lose access.
INSERT INTO public.businesses_private (business_id, owner_id, email, phone)
SELECT b.id, b.owner_id, b.email, b.phone
FROM public.businesses b
WHERE (b.email IS NOT NULL OR b.phone IS NOT NULL)
  AND NOT EXISTS (SELECT 1 FROM public.businesses_private bp WHERE bp.business_id = b.id)
ON CONFLICT (business_id) DO NOTHING;

UPDATE public.businesses_private bp
SET email = COALESCE(bp.email, b.email),
    phone = COALESCE(bp.phone, b.phone),
    updated_at = now()
FROM public.businesses b
WHERE bp.business_id = b.id
  AND ((bp.email IS NULL AND b.email IS NOT NULL) OR (bp.phone IS NULL AND b.phone IS NOT NULL));

-- Revoke column-level SELECT on email/phone from anon and authenticated on businesses.
-- PostgREST enforces column privileges before RLS, so public listings will no longer return these fields.
-- Owners/admins access their own contact info via public.businesses_private (already policy-guarded).
REVOKE SELECT (email, phone) ON public.businesses FROM anon;
REVOKE SELECT (email, phone) ON public.businesses FROM authenticated;

-- 2) email_notifications: remove overly permissive user INSERT policy.
--    Notifications must be system-generated (service role bypasses RLS).
DROP POLICY IF EXISTS "System can insert email notifications" ON public.email_notifications;

-- 3) profiles: defense-in-depth trigger to lock sensitive fields on self-update,
--    independent of the RLS WITH CHECK subquery.
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admins may change anything.
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- For self-updates, block changes to protected/privileged columns.
  IF auth.uid() = OLD.id THEN
    NEW.user_type          := OLD.user_type;
    NEW.wallet_balance     := OLD.wallet_balance;
    NEW.subscription_status := OLD.subscription_status;
    NEW.subscription_tier   := OLD.subscription_tier;
    NEW.is_founding_member  := OLD.is_founding_member;
    NEW.is_verified_host    := OLD.is_verified_host;
    NEW.economic_karma      := OLD.economic_karma;
    NEW.identity_status     := OLD.identity_status;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_privilege_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_profile_privilege_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_privilege_escalation();
