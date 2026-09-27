CREATE OR REPLACE FUNCTION public.protect_businesses_privileged_cols_v2()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_old jsonb := to_jsonb(OLD); v_new jsonb := to_jsonb(NEW); c text;
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF current_setting('app.review_action', true) = 'on' AND public.can_review_businesses() THEN RETURN NEW; END IF;
  FOREACH c IN ARRAY ARRAY['is_verified','subscription_status','is_founding_member','founding_order','is_founding_sponsor','founding_sponsor_since','referral_commission_paid','average_rating','review_count','transaction_count','total_revenue_tracked','black_owned_confidence','ownership_flagged','claim_status','claimed_at'] LOOP
    IF v_old ? c AND (v_old -> c) IS DISTINCT FROM (v_new -> c) THEN
      RAISE EXCEPTION 'Not authorized to modify privileged business fields';
    END IF;
  END LOOP;
  IF NEW.listing_status IS DISTINCT FROM OLD.listing_status THEN
    IF NOT (OLD.listing_status IN ('draft','rejected') AND NEW.listing_status = 'pending_review') THEN
      RAISE EXCEPTION 'Not authorized to change listing_status';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.unpublish_reviewed_lead(_lead_id uuid, _business_id uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  PERFORM set_config('app.review_action','on',true);
  UPDATE public.businesses SET listing_status='draft', is_verified=false WHERE id=_business_id;
  UPDATE public.b2b_external_leads SET verification_status='needs_review', reviewed_by=auth.uid() WHERE id=_lead_id;
  PERFORM set_config('app.review_action','off',true);
END $function$;