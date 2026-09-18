CREATE OR REPLACE FUNCTION public.protect_businesses_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_privileged_writer() THEN
    NEW.is_verified := OLD.is_verified;
    NEW.listing_status := OLD.listing_status;
    NEW.claim_status := OLD.claim_status;
    NEW.subscription_status := OLD.subscription_status;
    NEW.is_founding_member := OLD.is_founding_member;
    NEW.is_founding_sponsor := OLD.is_founding_sponsor;
    NEW.average_rating := OLD.average_rating;
    NEW.review_count := OLD.review_count;
  END IF;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.protect_corporate_subscriptions_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_privileged_writer() THEN
    NEW.approval_status := OLD.approval_status;
    NEW.is_visible := OLD.is_visible;
    NEW.display_priority := OLD.display_priority;
    NEW.featured_until := OLD.featured_until;
    NEW.status := OLD.status;
    NEW.tier := OLD.tier;
    NEW.is_founding_sponsor := OLD.is_founding_sponsor;
    NEW.logo_approved := OLD.logo_approved;
  END IF;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.protect_directory_partners_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_privileged_writer() THEN
    NEW.status := OLD.status;
    NEW.tier := OLD.tier;
    NEW.revenue_share_percent := OLD.revenue_share_percent;
    NEW.total_earnings := OLD.total_earnings;
    NEW.commission_tier := OLD.commission_tier;
  END IF;
  RETURN NEW;
END; $$;

REVOKE EXECUTE ON FUNCTION public.protect_businesses_privileged_columns() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_corporate_subscriptions_privileged_columns() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_directory_partners_privileged_columns() FROM PUBLIC, anon, authenticated;