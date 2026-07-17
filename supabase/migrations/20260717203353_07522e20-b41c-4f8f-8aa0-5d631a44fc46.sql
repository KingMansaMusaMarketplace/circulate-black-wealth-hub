-- Allow business owners to self-publish (draft <-> live) while keeping
-- verification, subscription, and founding-sponsor status admin-only.
CREATE OR REPLACE FUNCTION public.protect_businesses_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_owner boolean;
BEGIN
  IF public._is_admin_current_user() THEN
    RETURN NEW;
  END IF;

  -- These fields remain admin-only, always.
  NEW.is_verified := OLD.is_verified;
  NEW.subscription_status := OLD.subscription_status;
  NEW.is_founding_sponsor := OLD.is_founding_sponsor;

  -- Owners may toggle their own listing_status between 'draft' and 'live'
  -- (e.g. finishing onboarding or temporarily unpublishing).
  -- Any other transition (suspended, removed, etc.) stays admin-only.
  is_owner := (auth.uid() IS NOT NULL AND OLD.owner_id = auth.uid());

  IF NEW.listing_status IS DISTINCT FROM OLD.listing_status THEN
    IF is_owner
       AND COALESCE(OLD.listing_status, 'draft') IN ('draft', 'live')
       AND NEW.listing_status IN ('draft', 'live')
    THEN
      -- allow
      NULL;
    ELSE
      NEW.listing_status := OLD.listing_status;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;