
CREATE OR REPLACE FUNCTION public.protect_directory_partners_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.commission_tier IS DISTINCT FROM OLD.commission_tier
     OR NEW.revenue_share_percent IS DISTINCT FROM OLD.revenue_share_percent
     OR NEW.flat_fee_per_signup IS DISTINCT FROM OLD.flat_fee_per_signup
     OR NEW.total_earnings IS DISTINCT FROM OLD.total_earnings
     OR NEW.pending_earnings IS DISTINCT FROM OLD.pending_earnings
     OR NEW.total_referrals IS DISTINCT FROM OLD.total_referrals
     OR NEW.total_conversions IS DISTINCT FROM OLD.total_conversions
     OR NEW.lifetime_referrals IS DISTINCT FROM OLD.lifetime_referrals
     OR NEW.monthly_bonus_earned IS DISTINCT FROM OLD.monthly_bonus_earned
     OR NEW.payout_frequency IS DISTINCT FROM OLD.payout_frequency
     OR NEW.minimum_payout_threshold IS DISTINCT FROM OLD.minimum_payout_threshold
     OR NEW.last_payout_date IS DISTINCT FROM OLD.last_payout_date
     OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by
     OR NEW.referral_code IS DISTINCT FROM OLD.referral_code
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.tier IS DISTINCT FROM OLD.tier THEN
    RAISE EXCEPTION 'Not authorized to modify partner commission/earnings/payout/status fields';
  END IF;
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.protect_featured_placements_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.priority_score IS DISTINCT FROM OLD.priority_score
     OR NEW.start_date IS DISTINCT FROM OLD.start_date
     OR NEW.end_date IS DISTINCT FROM OLD.end_date
     OR NEW.amount_paid IS DISTINCT FROM OLD.amount_paid THEN
    RAISE EXCEPTION 'Not authorized to modify placement status/tier/priority/term fields';
  END IF;
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.protect_noir_drivers_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved
     OR NEW.is_active IS DISTINCT FROM OLD.is_active
     OR NEW.rating_average IS DISTINCT FROM OLD.rating_average
     OR NEW.total_rides IS DISTINCT FROM OLD.total_rides
     OR NEW.total_earnings IS DISTINCT FROM OLD.total_earnings
     OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by THEN
    RAISE EXCEPTION 'Not authorized to modify driver approval/earnings fields';
  END IF;
  IF NEW.application_status IS DISTINCT FROM OLD.application_status THEN
    IF NOT (OLD.application_status = 'draft' AND NEW.application_status = 'submitted') THEN
      RAISE EXCEPTION 'Not authorized to change application_status';
    END IF;
  END IF;
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.protect_sales_agents_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.commission_rate IS DISTINCT FROM OLD.commission_rate
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.total_earned IS DISTINCT FROM OLD.total_earned
     OR NEW.total_pending IS DISTINCT FROM OLD.total_pending
     OR NEW.is_active IS DISTINCT FROM OLD.is_active
     OR NEW.referral_code IS DISTINCT FROM OLD.referral_code
     OR NEW.lifetime_referrals IS DISTINCT FROM OLD.lifetime_referrals
     OR NEW.recruited_by_agent_id IS DISTINCT FROM OLD.recruited_by_agent_id
     OR NEW.team_override_end_date IS DISTINCT FROM OLD.team_override_end_date THEN
    RAISE EXCEPTION 'Not authorized to modify agent commission/tier/totals/referral fields';
  END IF;
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.protect_vacation_properties_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified
     OR NEW.moderation_status IS DISTINCT FROM OLD.moderation_status
     OR NEW.average_rating IS DISTINCT FROM OLD.average_rating
     OR NEW.review_count IS DISTINCT FROM OLD.review_count THEN
    RAISE EXCEPTION 'Not authorized to modify verification/rating fields';
  END IF;
  IF NEW.listing_status IS DISTINCT FROM OLD.listing_status THEN
    IF NOT (OLD.listing_status IN ('draft','rejected') AND NEW.listing_status = 'pending_review') THEN
      RAISE EXCEPTION 'Not authorized to change listing_status';
    END IF;
  END IF;
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.protect_corporate_subs_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.approval_status IS DISTINCT FROM OLD.approval_status
     OR NEW.is_founding_sponsor IS DISTINCT FROM OLD.is_founding_sponsor
     OR NEW.featured_until IS DISTINCT FROM OLD.featured_until
     OR NEW.is_visible IS DISTINCT FROM OLD.is_visible
     OR NEW.display_priority IS DISTINCT FROM OLD.display_priority
     OR NEW.logo_approved IS DISTINCT FROM OLD.logo_approved THEN
    RAISE EXCEPTION 'Not authorized to modify sponsor tier/status/approval/visibility fields';
  END IF;
  RETURN NEW;
END;$function$;
