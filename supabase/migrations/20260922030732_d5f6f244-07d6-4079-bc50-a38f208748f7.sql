CREATE OR REPLACE FUNCTION public.zzz_is_priv_actor()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(auth.role() = 'service_role', false)
      OR coalesce(public.has_role(auth.uid(), 'admin'), false);
$$;
REVOKE ALL ON FUNCTION public.zzz_is_priv_actor() FROM public, anon, authenticated;

-- businesses
CREATE OR REPLACE FUNCTION public.zzz_lock_businesses_trust()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.zzz_is_priv_actor() THEN RETURN NEW; END IF;
  NEW.is_verified := OLD.is_verified;
  NEW.subscription_status := OLD.subscription_status;
  NEW.listing_status := OLD.listing_status;
  NEW.claim_status := OLD.claim_status;
  NEW.is_founding_member := OLD.is_founding_member;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.zzz_lock_businesses_trust() FROM public, anon, authenticated;
DROP TRIGGER IF EXISTS zzz_lock_businesses_trust ON public.businesses;
CREATE TRIGGER zzz_lock_businesses_trust BEFORE UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.zzz_lock_businesses_trust();

-- corporate_subscriptions
CREATE OR REPLACE FUNCTION public.zzz_lock_corporate_subscriptions()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.zzz_is_priv_actor() THEN RETURN NEW; END IF;
  NEW.approval_status := OLD.approval_status;
  NEW.approved_at := OLD.approved_at;
  NEW.approved_by := OLD.approved_by;
  NEW.tier := OLD.tier;
  NEW.status := OLD.status;
  NEW.is_founding_sponsor := OLD.is_founding_sponsor;
  NEW.display_priority := OLD.display_priority;
  NEW.placement_override := OLD.placement_override;
  NEW.logo_approved := OLD.logo_approved;
  NEW.featured_until := OLD.featured_until;
  NEW.stripe_customer_id := OLD.stripe_customer_id;
  NEW.stripe_subscription_id := OLD.stripe_subscription_id;
  NEW.current_period_start := OLD.current_period_start;
  NEW.current_period_end := OLD.current_period_end;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.zzz_lock_corporate_subscriptions() FROM public, anon, authenticated;
DROP TRIGGER IF EXISTS zzz_lock_corporate_subscriptions ON public.corporate_subscriptions;
CREATE TRIGGER zzz_lock_corporate_subscriptions BEFORE UPDATE ON public.corporate_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.zzz_lock_corporate_subscriptions();

-- directory_partners
CREATE OR REPLACE FUNCTION public.zzz_lock_directory_partners()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.zzz_is_priv_actor() THEN RETURN NEW; END IF;
  NEW.status := OLD.status;
  NEW.tier := OLD.tier;
  NEW.tier_updated_at := OLD.tier_updated_at;
  NEW.commission_tier := OLD.commission_tier;
  NEW.revenue_share_percent := OLD.revenue_share_percent;
  NEW.flat_fee_per_signup := OLD.flat_fee_per_signup;
  NEW.total_earnings := OLD.total_earnings;
  NEW.pending_earnings := OLD.pending_earnings;
  NEW.monthly_bonus_earned := OLD.monthly_bonus_earned;
  NEW.total_referrals := OLD.total_referrals;
  NEW.lifetime_referrals := OLD.lifetime_referrals;
  NEW.total_conversions := OLD.total_conversions;
  NEW.last_payout_date := OLD.last_payout_date;
  NEW.approved_at := OLD.approved_at;
  NEW.approved_by := OLD.approved_by;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.zzz_lock_directory_partners() FROM public, anon, authenticated;
DROP TRIGGER IF EXISTS zzz_lock_directory_partners ON public.directory_partners;
CREATE TRIGGER zzz_lock_directory_partners BEFORE UPDATE ON public.directory_partners
FOR EACH ROW EXECUTE FUNCTION public.zzz_lock_directory_partners();

-- featured_placements
CREATE OR REPLACE FUNCTION public.zzz_lock_featured_placements()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.zzz_is_priv_actor() THEN RETURN NEW; END IF;
  NEW.status := OLD.status;
  NEW.tier := OLD.tier;
  NEW.priority_score := OLD.priority_score;
  NEW.starts_at := OLD.starts_at;
  NEW.ends_at := OLD.ends_at;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.zzz_lock_featured_placements() FROM public, anon, authenticated;
DROP TRIGGER IF EXISTS zzz_lock_featured_placements ON public.featured_placements;
CREATE TRIGGER zzz_lock_featured_placements BEFORE UPDATE ON public.featured_placements
FOR EACH ROW EXECUTE FUNCTION public.zzz_lock_featured_placements();

-- noir_drivers
CREATE OR REPLACE FUNCTION public.zzz_lock_noir_drivers()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.zzz_is_priv_actor() THEN RETURN NEW; END IF;
  NEW.is_approved := OLD.is_approved;
  NEW.application_status := OLD.application_status;
  NEW.rating_average := OLD.rating_average;
  NEW.total_earnings := OLD.total_earnings;
  NEW.total_rides := OLD.total_rides;
  NEW.reviewed_at := OLD.reviewed_at;
  NEW.reviewed_by := OLD.reviewed_by;
  NEW.rejection_reason := OLD.rejection_reason;
  NEW.admin_notes := OLD.admin_notes;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.zzz_lock_noir_drivers() FROM public, anon, authenticated;
DROP TRIGGER IF EXISTS zzz_lock_noir_drivers ON public.noir_drivers;
CREATE TRIGGER zzz_lock_noir_drivers BEFORE UPDATE ON public.noir_drivers
FOR EACH ROW EXECUTE FUNCTION public.zzz_lock_noir_drivers();

-- sales_agents
CREATE OR REPLACE FUNCTION public.zzz_lock_sales_agents()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.zzz_is_priv_actor() THEN RETURN NEW; END IF;
  NEW.commission_rate := OLD.commission_rate;
  NEW.tier := OLD.tier;
  NEW.last_tier_update := OLD.last_tier_update;
  NEW.total_earned := OLD.total_earned;
  NEW.total_pending := OLD.total_pending;
  NEW.lifetime_referrals := OLD.lifetime_referrals;
  NEW.monthly_referrals := OLD.monthly_referrals;
  NEW.is_active := OLD.is_active;
  NEW.recruited_by_agent_id := OLD.recruited_by_agent_id;
  NEW.team_override_end_date := OLD.team_override_end_date;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.zzz_lock_sales_agents() FROM public, anon, authenticated;
DROP TRIGGER IF EXISTS zzz_lock_sales_agents ON public.sales_agents;
CREATE TRIGGER zzz_lock_sales_agents BEFORE UPDATE ON public.sales_agents
FOR EACH ROW EXECUTE FUNCTION public.zzz_lock_sales_agents();

-- vacation_properties
CREATE OR REPLACE FUNCTION public.zzz_lock_vacation_properties()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.zzz_is_priv_actor() THEN RETURN NEW; END IF;
  NEW.is_verified := OLD.is_verified;
  NEW.listing_status := OLD.listing_status;
  NEW.moderation_status := OLD.moderation_status;
  NEW.reviewed_at := OLD.reviewed_at;
  NEW.reviewed_by := OLD.reviewed_by;
  NEW.rejection_reason := OLD.rejection_reason;
  NEW.service_tier := OLD.service_tier;
  NEW.service_fee_percent := OLD.service_fee_percent;
  NEW.average_rating := OLD.average_rating;
  NEW.review_count := OLD.review_count;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.zzz_lock_vacation_properties() FROM public, anon, authenticated;
DROP TRIGGER IF EXISTS zzz_lock_vacation_properties ON public.vacation_properties;
CREATE TRIGGER zzz_lock_vacation_properties BEFORE UPDATE ON public.vacation_properties
FOR EACH ROW EXECUTE FUNCTION public.zzz_lock_vacation_properties();