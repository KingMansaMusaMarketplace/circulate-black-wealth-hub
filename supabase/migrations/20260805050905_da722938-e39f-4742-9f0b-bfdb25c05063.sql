
-- Force safe defaults on INSERT for non-admin users (UPDATE already protected by *_v2 triggers)

CREATE OR REPLACE FUNCTION public.force_safe_defaults_businesses()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.is_verified := false;
  NEW.ownership_flagged := COALESCE(NEW.ownership_flagged, false);
  NEW.is_founding_sponsor := false;
  NEW.is_founding_member := false;
  NEW.founding_order := NULL;
  NEW.founding_joined_at := NULL;
  NEW.founding_sponsor_since := NULL;
  NEW.average_rating := 0;
  IF NEW.listing_status IS NULL OR NEW.listing_status NOT IN ('draft','pending_review') THEN
    NEW.listing_status := 'pending_review';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_force_safe_defaults_businesses ON public.businesses;
CREATE TRIGGER trg_force_safe_defaults_businesses BEFORE INSERT ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.force_safe_defaults_businesses();

CREATE OR REPLACE FUNCTION public.force_safe_defaults_vacation_properties()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.is_verified := false;
  NEW.average_rating := 0;
  NEW.moderation_status := 'pending';
  IF NEW.listing_status IS NULL OR NEW.listing_status NOT IN ('draft','pending_review') THEN
    NEW.listing_status := 'pending_review';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_force_safe_defaults_vacation_properties ON public.vacation_properties;
CREATE TRIGGER trg_force_safe_defaults_vacation_properties BEFORE INSERT ON public.vacation_properties
FOR EACH ROW EXECUTE FUNCTION public.force_safe_defaults_vacation_properties();

CREATE OR REPLACE FUNCTION public.force_safe_defaults_corporate_subscriptions()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.approval_status := 'pending';
  NEW.approved_at := NULL;
  NEW.approved_by := NULL;
  NEW.is_visible := false;
  NEW.is_founding_sponsor := false;
  NEW.logo_approved := false;
  NEW.display_priority := 0;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_force_safe_defaults_corporate_subscriptions ON public.corporate_subscriptions;
CREATE TRIGGER trg_force_safe_defaults_corporate_subscriptions BEFORE INSERT ON public.corporate_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.force_safe_defaults_corporate_subscriptions();

CREATE OR REPLACE FUNCTION public.force_safe_defaults_directory_partners()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.status := 'pending';
  NEW.approved_at := NULL;
  NEW.approved_by := NULL;
  NEW.total_earnings := 0;
  NEW.pending_earnings := 0;
  NEW.monthly_bonus_earned := 0;
  NEW.total_referrals := 0;
  NEW.lifetime_referrals := 0;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_force_safe_defaults_directory_partners ON public.directory_partners;
CREATE TRIGGER trg_force_safe_defaults_directory_partners BEFORE INSERT ON public.directory_partners
FOR EACH ROW EXECUTE FUNCTION public.force_safe_defaults_directory_partners();

CREATE OR REPLACE FUNCTION public.force_safe_defaults_featured_placements()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.status := 'pending';
  NEW.priority_score := 0;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_force_safe_defaults_featured_placements ON public.featured_placements;
CREATE TRIGGER trg_force_safe_defaults_featured_placements BEFORE INSERT ON public.featured_placements
FOR EACH ROW EXECUTE FUNCTION public.force_safe_defaults_featured_placements();

CREATE OR REPLACE FUNCTION public.force_safe_defaults_noir_drivers()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.is_approved := false;
  NEW.application_status := 'draft';
  NEW.rating_average := 0;
  NEW.total_earnings := 0;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_force_safe_defaults_noir_drivers ON public.noir_drivers;
CREATE TRIGGER trg_force_safe_defaults_noir_drivers BEFORE INSERT ON public.noir_drivers
FOR EACH ROW EXECUTE FUNCTION public.force_safe_defaults_noir_drivers();

CREATE OR REPLACE FUNCTION public.force_safe_defaults_sales_agents()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.tier := 'bronze';
  NEW.commission_rate := 0.10;
  NEW.total_earned := 0;
  NEW.lifetime_referrals := 0;
  NEW.monthly_referrals := 0;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_force_safe_defaults_sales_agents ON public.sales_agents;
CREATE TRIGGER trg_force_safe_defaults_sales_agents BEFORE INSERT ON public.sales_agents
FOR EACH ROW EXECUTE FUNCTION public.force_safe_defaults_sales_agents();
