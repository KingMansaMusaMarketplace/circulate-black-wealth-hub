
-- =============================================================
-- FIX 1: Revoke anonymous/authenticated SELECT on email & phone
-- =============================================================

-- Revoke column-level SELECT on sensitive contact fields
REVOKE SELECT (email, phone) ON public.businesses FROM anon;
REVOKE SELECT (email, phone) ON public.businesses FROM authenticated;

-- Grant email/phone SELECT back only through the existing safe views and RPCs
-- (businesses_public_safe view already excludes these columns)

-- Re-grant SELECT on all OTHER columns to preserve existing access
-- We do this by granting on the table then revoking the sensitive columns
GRANT SELECT (
  id, business_name, name, description, category, address, city, state, zip_code,
  website, logo_url, banner_url, is_verified, average_rating, review_count,
  location_type, location_name, parent_business_id, created_at, updated_at,
  latitude, longitude, listing_status, subscription_status,
  subscription_start_date, subscription_end_date, qr_code_id, qr_code_url,
  owner_id, location_manager_id, is_founding_member, is_founding_sponsor,
  founding_sponsor_since, founding_joined_at, founding_order,
  onboarding_completed_at, referred_at, referral_commission_paid
) ON public.businesses TO anon, authenticated;


-- =============================================================
-- FIX 2: Prevent location managers from changing owner_id
-- =============================================================

CREATE OR REPLACE FUNCTION public.prevent_ownership_takeover()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If owner_id is not being changed, allow the update
  IF NEW.owner_id = OLD.owner_id THEN
    RETURN NEW;
  END IF;

  -- Only the current owner or an admin can change owner_id
  IF auth.uid() = OLD.owner_id THEN
    RETURN NEW;
  END IF;

  -- Check if caller is admin
  IF public.is_admin_secure() THEN
    RETURN NEW;
  END IF;

  -- Block the ownership change
  RAISE EXCEPTION 'Only the current business owner or an admin can transfer ownership';
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS prevent_ownership_takeover_trigger ON public.businesses;
CREATE TRIGGER prevent_ownership_takeover_trigger
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_ownership_takeover();
