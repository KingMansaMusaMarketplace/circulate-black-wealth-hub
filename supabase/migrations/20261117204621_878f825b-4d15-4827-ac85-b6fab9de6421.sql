CREATE OR REPLACE FUNCTION public._is_trusted_claim()
 RETURNS boolean LANGUAGE sql STABLE SET search_path TO 'public'
AS $$ SELECT COALESCE(current_setting('app.trusted_claim', true), '') = 'on'; $$;

CREATE OR REPLACE FUNCTION public.prevent_ownership_takeover()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF public._is_trusted_claim() THEN RETURN NEW; END IF;
  IF NEW.owner_id = OLD.owner_id THEN RETURN NEW; END IF;
  IF auth.uid() = OLD.owner_id THEN RETURN NEW; END IF;
  IF public.is_admin_secure() THEN RETURN NEW; END IF;
  RAISE EXCEPTION 'Only the current business owner or an admin can transfer ownership';
END;
$function$;

CREATE OR REPLACE FUNCTION public.protect_business_ownership()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF public._is_trusted_claim() THEN RETURN NEW; END IF;
  IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
    IF NOT is_admin_secure() THEN
      IF OLD.owner_id != auth.uid() THEN
        RAISE EXCEPTION 'Only the business owner or an admin can transfer ownership';
      END IF;
    END IF;
  END IF;
  IF NEW.location_manager_id IS DISTINCT FROM OLD.location_manager_id THEN
    IF NOT is_admin_secure() AND auth.uid() != OLD.owner_id THEN
      RAISE EXCEPTION 'Only the business owner or an admin can change the location manager';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.protect_businesses_privileged_columns()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF public._is_trusted_claim() THEN RETURN NEW; END IF;
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
END; $function$;

CREATE OR REPLACE FUNCTION public.guard_businesses_privileged_columns()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF public._is_trusted_claim() THEN RETURN NEW; END IF;
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
END; $function$;

CREATE OR REPLACE FUNCTION public.protect_businesses_privileged_cols_v2()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_old jsonb := to_jsonb(OLD); v_new jsonb := to_jsonb(NEW); c text;
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF current_setting('app.review_action', true) = 'on' AND public.can_review_businesses() THEN RETURN NEW; END IF;
  FOREACH c IN ARRAY ARRAY['is_verified','subscription_status','is_founding_member','founding_order','is_founding_sponsor','founding_sponsor_since','referral_commission_paid','average_rating','review_count','transaction_count','total_revenue_tracked','black_owned_confidence','ownership_flagged','claim_status','claimed_at'] LOOP
    -- A verified invite claim may change only claim_status and claimed_at.
    IF public._is_trusted_claim() AND c IN ('claim_status','claimed_at') THEN CONTINUE; END IF;
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

CREATE OR REPLACE FUNCTION public.claim_directory_business(p_token text)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_biz record; v_uid uuid := auth.uid(); v_email text; v_match boolean;
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('success',false,'error','You must be signed in to claim a listing'); END IF;
  SELECT b.id, b.business_name INTO v_biz FROM public.businesses_claim_tokens t JOIN public.businesses b ON b.id=t.business_id
   WHERE t.claim_token=p_token AND t.claim_token_expires_at>now() AND b.claim_status IS DISTINCT FROM 'claimed'
   FOR UPDATE OF b;
  IF NOT FOUND THEN RETURN jsonb_build_object('success',false,'error','This claim link is invalid, expired, or already used'); END IF;

  SELECT lower(email) INTO v_email FROM auth.users WHERE id=v_uid AND email_confirmed_at IS NOT NULL;
  SELECT EXISTS (SELECT 1 FROM public.business_claim_invites i
                  WHERE i.business_id=v_biz.id AND i.status='sent' AND lower(trim(i.email))=v_email) INTO v_match;

  IF v_email IS NOT NULL AND v_match THEN
    PERFORM set_config('app.trusted_claim','on',true);
    PERFORM set_config('app.review_action','on',true);
    UPDATE public.businesses SET owner_id=v_uid, claim_status='claimed', claimed_at=now() WHERE id=v_biz.id;
    PERFORM set_config('app.review_action','off',true);
    PERFORM set_config('app.trusted_claim','off',true);
    DELETE FROM public.businesses_claim_tokens WHERE business_id=v_biz.id;
    UPDATE public.business_claim_invites SET claimed_at=now() WHERE business_id=v_biz.id AND claimed_at IS NULL;
    UPDATE public.business_claim_campaigns c SET total_claimed=coalesce(c.total_claimed,0)+1
     WHERE c.id IN (SELECT campaign_id FROM public.business_claim_invites WHERE business_id=v_biz.id AND campaign_id IS NOT NULL LIMIT 1);
    UPDATE public.lead_claim_requests SET status='rejected', decided_at=now()
     WHERE business_id=v_biz.id AND status='pending' AND user_id<>v_uid;
    RETURN jsonb_build_object('success',true,'claimed',true,'business_id',v_biz.id,'business_name',v_biz.business_name);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.lead_claim_requests WHERE business_id=v_biz.id AND user_id=v_uid AND status='pending') THEN
    INSERT INTO public.lead_claim_requests(business_id,user_id,status) VALUES (v_biz.id,v_uid,'pending');
  END IF;
  RETURN jsonb_build_object('success',true,'pending',true,'business_id',v_biz.id,'business_name',v_biz.business_name);
END $function$;

REVOKE ALL ON FUNCTION public.claim_directory_business(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_directory_business(text) TO authenticated, service_role;