CREATE OR REPLACE FUNCTION public.protect_businesses_privileged_cols_v2()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified
     OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.is_founding_member IS DISTINCT FROM OLD.is_founding_member
     OR NEW.founding_order IS DISTINCT FROM OLD.founding_order
     OR NEW.is_founding_sponsor IS DISTINCT FROM OLD.is_founding_sponsor
     OR NEW.founding_sponsor_since IS DISTINCT FROM OLD.founding_sponsor_since
     OR NEW.referral_commission_paid IS DISTINCT FROM OLD.referral_commission_paid
     OR NEW.average_rating IS DISTINCT FROM OLD.average_rating
     OR NEW.review_count IS DISTINCT FROM OLD.review_count
     OR NEW.transaction_count IS DISTINCT FROM OLD.transaction_count
     OR NEW.total_revenue_tracked IS DISTINCT FROM OLD.total_revenue_tracked
     OR NEW.black_owned_confidence IS DISTINCT FROM OLD.black_owned_confidence
     OR NEW.ownership_flagged IS DISTINCT FROM OLD.ownership_flagged
     OR NEW.claim_status IS DISTINCT FROM OLD.claim_status
     OR NEW.claimed_at IS DISTINCT FROM OLD.claimed_at THEN
    RAISE EXCEPTION 'Not authorized to modify privileged business fields';
  END IF;
  IF NEW.listing_status IS DISTINCT FROM OLD.listing_status THEN
    IF NOT (OLD.listing_status IN ('draft','rejected') AND NEW.listing_status = 'pending_review') THEN
      RAISE EXCEPTION 'Not authorized to change listing_status';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;