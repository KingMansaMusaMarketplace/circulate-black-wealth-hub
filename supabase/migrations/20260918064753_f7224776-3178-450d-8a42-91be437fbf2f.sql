-- businesses
CREATE OR REPLACE FUNCTION public.guard_businesses_privileged_columns() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  NEW.is_verified := OLD.is_verified;
  NEW.claim_status := OLD.claim_status;
  NEW.listing_status := OLD.listing_status;
  NEW.subscription_status := OLD.subscription_status;
  NEW.ownership_flagged := OLD.ownership_flagged;
  NEW.black_owned_confidence := OLD.black_owned_confidence;
  NEW.is_founding_member := OLD.is_founding_member;
  NEW.is_founding_sponsor := OLD.is_founding_sponsor;
  NEW.founding_order := OLD.founding_order;
  NEW.listing_reviewed_by := OLD.listing_reviewed_by;
  NEW.listing_reviewed_at := OLD.listing_reviewed_at;
  NEW.ownership_reviewed_at := OLD.ownership_reviewed_at;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_businesses_privileged_columns ON public.businesses;
CREATE TRIGGER trg_guard_businesses_privileged_columns BEFORE UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.guard_businesses_privileged_columns();

-- corporate_subscriptions
CREATE OR REPLACE FUNCTION public.guard_corporate_subscriptions_privileged_columns() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  NEW.approval_status := OLD.approval_status;
  NEW.is_visible := OLD.is_visible;
  NEW.display_priority := OLD.display_priority;
  NEW.featured_until := OLD.featured_until;
  NEW.approved_at := OLD.approved_at;
  NEW.approved_by := OLD.approved_by;
  NEW.rejected_at := OLD.rejected_at;
  NEW.rejection_reason := OLD.rejection_reason;
  NEW.logo_approved := OLD.logo_approved;
  NEW.placement_override := OLD.placement_override;
  NEW.is_founding_sponsor := OLD.is_founding_sponsor;
  NEW.admin_notes := OLD.admin_notes;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_corporate_subscriptions_privileged_columns ON public.corporate_subscriptions;
CREATE TRIGGER trg_guard_corporate_subscriptions_privileged_columns BEFORE UPDATE ON public.corporate_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.guard_corporate_subscriptions_privileged_columns();

-- directory_partners
CREATE OR REPLACE FUNCTION public.guard_directory_partners_privileged_columns() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  NEW.commission_tier := OLD.commission_tier;
  NEW.tier := OLD.tier;
  NEW.tier_updated_at := OLD.tier_updated_at;
  NEW.revenue_share_percent := OLD.revenue_share_percent;
  NEW.flat_fee_per_signup := OLD.flat_fee_per_signup;
  NEW.total_earnings := OLD.total_earnings;
  NEW.pending_earnings := OLD.pending_earnings;
  NEW.monthly_bonus_earned := OLD.monthly_bonus_earned;
  NEW.total_conversions := OLD.total_conversions;
  NEW.total_referrals := OLD.total_referrals;
  NEW.lifetime_referrals := OLD.lifetime_referrals;
  NEW.last_payout_date := OLD.last_payout_date;
  NEW.status := OLD.status;
  NEW.approved_at := OLD.approved_at;
  NEW.approved_by := OLD.approved_by;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_directory_partners_privileged_columns ON public.directory_partners;
CREATE TRIGGER trg_guard_directory_partners_privileged_columns BEFORE UPDATE ON public.directory_partners
FOR EACH ROW EXECUTE FUNCTION public.guard_directory_partners_privileged_columns();

-- featured_placements
CREATE OR REPLACE FUNCTION public.guard_featured_placements_privileged_columns() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  NEW.priority_score := OLD.priority_score;
  NEW.status := OLD.status;
  NEW.tier := OLD.tier;
  NEW.starts_at := OLD.starts_at;
  NEW.ends_at := OLD.ends_at;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_featured_placements_privileged_columns ON public.featured_placements;
CREATE TRIGGER trg_guard_featured_placements_privileged_columns BEFORE UPDATE ON public.featured_placements
FOR EACH ROW EXECUTE FUNCTION public.guard_featured_placements_privileged_columns();

-- noir_drivers
CREATE OR REPLACE FUNCTION public.guard_noir_drivers_privileged_columns() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  NEW.is_approved := OLD.is_approved;
  NEW.is_active := OLD.is_active;
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
DROP TRIGGER IF EXISTS trg_guard_noir_drivers_privileged_columns ON public.noir_drivers;
CREATE TRIGGER trg_guard_noir_drivers_privileged_columns BEFORE UPDATE ON public.noir_drivers
FOR EACH ROW EXECUTE FUNCTION public.guard_noir_drivers_privileged_columns();

-- sales_agents
CREATE OR REPLACE FUNCTION public.guard_sales_agents_privileged_columns() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  NEW.commission_rate := OLD.commission_rate;
  NEW.tier := OLD.tier;
  NEW.last_tier_update := OLD.last_tier_update;
  NEW.total_earned := OLD.total_earned;
  NEW.total_pending := OLD.total_pending;
  NEW.monthly_referrals := OLD.monthly_referrals;
  NEW.lifetime_referrals := OLD.lifetime_referrals;
  NEW.is_active := OLD.is_active;
  NEW.team_override_end_date := OLD.team_override_end_date;
  NEW.recruited_by_agent_id := OLD.recruited_by_agent_id;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_sales_agents_privileged_columns ON public.sales_agents;
CREATE TRIGGER trg_guard_sales_agents_privileged_columns BEFORE UPDATE ON public.sales_agents
FOR EACH ROW EXECUTE FUNCTION public.guard_sales_agents_privileged_columns();

-- vacation_properties
CREATE OR REPLACE FUNCTION public.guard_vacation_properties_privileged_columns() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN RETURN NEW; END IF;
  NEW.is_verified := OLD.is_verified;
  NEW.listing_status := OLD.listing_status;
  NEW.moderation_status := OLD.moderation_status;
  NEW.average_rating := OLD.average_rating;
  NEW.review_count := OLD.review_count;
  NEW.reviewed_at := OLD.reviewed_at;
  NEW.reviewed_by := OLD.reviewed_by;
  NEW.rejection_reason := OLD.rejection_reason;
  NEW.service_fee_percent := OLD.service_fee_percent;
  NEW.service_tier := OLD.service_tier;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_guard_vacation_properties_privileged_columns ON public.vacation_properties;
CREATE TRIGGER trg_guard_vacation_properties_privileged_columns BEFORE UPDATE ON public.vacation_properties
FOR EACH ROW EXECUTE FUNCTION public.guard_vacation_properties_privileged_columns();