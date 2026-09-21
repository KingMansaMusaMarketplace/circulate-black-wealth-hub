
CREATE OR REPLACE FUNCTION public._sec_priv_actor()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(auth.role(), '') IN ('service_role','supabase_admin')
      OR (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'::app_role));
$$;

-- businesses
CREATE OR REPLACE FUNCTION public.enforce_businesses_trust_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_priv_actor() THEN RETURN NEW; END IF;
  NEW.is_verified := OLD.is_verified;
  NEW.is_founding_sponsor := OLD.is_founding_sponsor;
  NEW.founding_sponsor_since := OLD.founding_sponsor_since;
  NEW.is_founding_member := OLD.is_founding_member;
  NEW.founding_order := OLD.founding_order;
  NEW.founding_joined_at := OLD.founding_joined_at;
  NEW.claim_status := OLD.claim_status;
  NEW.claimed_at := OLD.claimed_at;
  NEW.listing_status := OLD.listing_status;
  NEW.listing_rejection_reason := OLD.listing_rejection_reason;
  NEW.listing_reviewed_by := OLD.listing_reviewed_by;
  NEW.listing_reviewed_at := OLD.listing_reviewed_at;
  NEW.black_owned_confidence := OLD.black_owned_confidence;
  NEW.ownership_flagged := OLD.ownership_flagged;
  NEW.ownership_reviewed_at := OLD.ownership_reviewed_at;
  NEW.average_rating := OLD.average_rating;
  NEW.review_count := OLD.review_count;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS zz_enforce_businesses_trust_columns ON public.businesses;
CREATE TRIGGER zz_enforce_businesses_trust_columns
BEFORE UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.enforce_businesses_trust_columns();

-- corporate_subscriptions
CREATE OR REPLACE FUNCTION public.enforce_corporate_subscriptions_admin_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_priv_actor() THEN RETURN NEW; END IF;
  NEW.approval_status := OLD.approval_status;
  NEW.approved_by := OLD.approved_by;
  NEW.approved_at := OLD.approved_at;
  NEW.rejected_at := OLD.rejected_at;
  NEW.rejection_reason := OLD.rejection_reason;
  NEW.admin_notes := OLD.admin_notes;
  NEW.is_founding_sponsor := OLD.is_founding_sponsor;
  NEW.display_priority := OLD.display_priority;
  NEW.featured_until := OLD.featured_until;
  NEW.logo_approved := OLD.logo_approved;
  NEW.placement_override := OLD.placement_override;
  NEW.tier := OLD.tier;
  NEW.status := OLD.status;
  NEW.stripe_subscription_id := OLD.stripe_subscription_id;
  NEW.stripe_customer_id := OLD.stripe_customer_id;
  NEW.current_period_start := OLD.current_period_start;
  NEW.current_period_end := OLD.current_period_end;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS zz_enforce_corporate_subscriptions_admin_columns ON public.corporate_subscriptions;
CREATE TRIGGER zz_enforce_corporate_subscriptions_admin_columns
BEFORE UPDATE ON public.corporate_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.enforce_corporate_subscriptions_admin_columns();

-- directory_partners
CREATE OR REPLACE FUNCTION public.enforce_directory_partners_admin_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_priv_actor() THEN RETURN NEW; END IF;
  NEW.status := OLD.status;
  NEW.tier := OLD.tier;
  NEW.commission_tier := OLD.commission_tier;
  NEW.tier_updated_at := OLD.tier_updated_at;
  NEW.revenue_share_percent := OLD.revenue_share_percent;
  NEW.flat_fee_per_signup := OLD.flat_fee_per_signup;
  NEW.total_earnings := OLD.total_earnings;
  NEW.pending_earnings := OLD.pending_earnings;
  NEW.total_referrals := OLD.total_referrals;
  NEW.total_conversions := OLD.total_conversions;
  NEW.lifetime_referrals := OLD.lifetime_referrals;
  NEW.monthly_bonus_earned := OLD.monthly_bonus_earned;
  NEW.last_payout_date := OLD.last_payout_date;
  NEW.approved_at := OLD.approved_at;
  NEW.approved_by := OLD.approved_by;
  NEW.referral_code := OLD.referral_code;
  NEW.embed_token := OLD.embed_token;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS zz_enforce_directory_partners_admin_columns ON public.directory_partners;
CREATE TRIGGER zz_enforce_directory_partners_admin_columns
BEFORE UPDATE ON public.directory_partners
FOR EACH ROW EXECUTE FUNCTION public.enforce_directory_partners_admin_columns();

-- featured_placements
CREATE OR REPLACE FUNCTION public.enforce_featured_placements_owner_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_priv_actor() THEN RETURN NEW; END IF;
  NEW.status := OLD.status;
  NEW.priority_score := OLD.priority_score;
  NEW.tier := OLD.tier;
  NEW.starts_at := OLD.starts_at;
  NEW.ends_at := OLD.ends_at;
  NEW.business_id := OLD.business_id;
  NEW.owner_user_id := OLD.owner_user_id;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS zz_enforce_featured_placements_owner_columns ON public.featured_placements;
CREATE TRIGGER zz_enforce_featured_placements_owner_columns
BEFORE UPDATE ON public.featured_placements
FOR EACH ROW EXECUTE FUNCTION public.enforce_featured_placements_owner_columns();

-- noir_drivers
CREATE OR REPLACE FUNCTION public.enforce_noir_drivers_approval_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_priv_actor() THEN RETURN NEW; END IF;
  NEW.is_approved := OLD.is_approved;
  NEW.application_status := OLD.application_status;
  NEW.reviewed_at := OLD.reviewed_at;
  NEW.reviewed_by := OLD.reviewed_by;
  NEW.rejection_reason := OLD.rejection_reason;
  NEW.admin_notes := OLD.admin_notes;
  NEW.rating_average := OLD.rating_average;
  NEW.total_rides := OLD.total_rides;
  NEW.total_earnings := OLD.total_earnings;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS zz_enforce_noir_drivers_approval_columns ON public.noir_drivers;
CREATE TRIGGER zz_enforce_noir_drivers_approval_columns
BEFORE UPDATE ON public.noir_drivers
FOR EACH ROW EXECUTE FUNCTION public.enforce_noir_drivers_approval_columns();

-- sales_agents
CREATE OR REPLACE FUNCTION public.enforce_sales_agents_payout_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_priv_actor() THEN RETURN NEW; END IF;
  NEW.commission_rate := OLD.commission_rate;
  NEW.tier := OLD.tier;
  NEW.total_earned := OLD.total_earned;
  NEW.total_pending := OLD.total_pending;
  NEW.is_active := OLD.is_active;
  NEW.lifetime_referrals := OLD.lifetime_referrals;
  NEW.monthly_referrals := OLD.monthly_referrals;
  NEW.last_tier_update := OLD.last_tier_update;
  NEW.referral_code := OLD.referral_code;
  NEW.recruited_by_agent_id := OLD.recruited_by_agent_id;
  NEW.recruitment_date := OLD.recruitment_date;
  NEW.team_override_end_date := OLD.team_override_end_date;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS zz_enforce_sales_agents_payout_columns ON public.sales_agents;
CREATE TRIGGER zz_enforce_sales_agents_payout_columns
BEFORE UPDATE ON public.sales_agents
FOR EACH ROW EXECUTE FUNCTION public.enforce_sales_agents_payout_columns();

-- vacation_properties
CREATE OR REPLACE FUNCTION public.enforce_vacation_properties_review_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_priv_actor() THEN RETURN NEW; END IF;
  NEW.is_verified := OLD.is_verified;
  NEW.moderation_status := OLD.moderation_status;
  NEW.listing_status := OLD.listing_status;
  NEW.rejection_reason := OLD.rejection_reason;
  NEW.reviewed_at := OLD.reviewed_at;
  NEW.reviewed_by := OLD.reviewed_by;
  NEW.average_rating := OLD.average_rating;
  NEW.review_count := OLD.review_count;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS zz_enforce_vacation_properties_review_columns ON public.vacation_properties;
CREATE TRIGGER zz_enforce_vacation_properties_review_columns
BEFORE UPDATE ON public.vacation_properties
FOR EACH ROW EXECUTE FUNCTION public.enforce_vacation_properties_review_columns();

REVOKE ALL ON FUNCTION public._sec_priv_actor() FROM public, anon, authenticated;
