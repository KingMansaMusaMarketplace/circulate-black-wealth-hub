CREATE OR REPLACE FUNCTION public.enforce_sensitive_columns_admin_only()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_is_admin boolean; v_old jsonb; v_new jsonb; v_col text;
  v_sensitive text[] := ARRAY['is_verified','verified','verification_status','approved_at','approved_by','rejected_at','rejected_by','rejection_reason','commission_rate','commission_amount','commission_cents','priority_score','is_featured','featured_until','tier','subscription_tier','activated_at'];
BEGIN
  IF current_setting('role', true) = 'service_role' THEN RETURN NEW; END IF;
  -- Review-queue functions (already checked can_review_businesses) set this flag for their own transaction
  IF TG_TABLE_NAME = 'b2b_external_leads' AND current_setting('app.review_action', true) = 'on' AND public.can_review_businesses() THEN
    RETURN NEW;
  END IF;
  BEGIN v_is_admin := public.is_admin_secure(); EXCEPTION WHEN OTHERS THEN v_is_admin := false; END;
  IF v_is_admin THEN RETURN NEW; END IF;
  v_old := to_jsonb(OLD); v_new := to_jsonb(NEW);
  FOREACH v_col IN ARRAY v_sensitive LOOP
    IF v_old ? v_col AND (v_old -> v_col) IS DISTINCT FROM (v_new -> v_col) THEN
      RAISE EXCEPTION 'Permission denied: column % is admin-only', v_col USING ERRCODE = '42501';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_lead_review_status(_lead_id uuid, _status text)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF _status NOT IN ('rejected','pending','needs_review') THEN RAISE EXCEPTION 'Invalid status'; END IF;
  PERFORM set_config('app.review_action','on',true);
  UPDATE public.b2b_external_leads SET verification_status=_status, reviewed_by=auth.uid() WHERE id=_lead_id;
  PERFORM set_config('app.review_action','off',true);
END $function$;

CREATE OR REPLACE FUNCTION public.publish_reviewed_lead(_lead_id uuid)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE l record; _owner uuid; _bid uuid;
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT * INTO l FROM public.b2b_external_leads WHERE id = _lead_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead not found'; END IF;
  IF public.is_admin_secure() THEN _owner := auth.uid();
  ELSE SELECT user_id INTO _owner FROM public.user_roles WHERE role='admin' ORDER BY id LIMIT 1; END IF;
  INSERT INTO public.businesses (owner_id, name, business_name, category, city, state, website, phone, description, logo_url, banner_url, address, is_verified, listing_status)
  VALUES (_owner, l.business_name, l.business_name, l.category, l.city, l.state, l.website_url,
          COALESCE(l.verified_phone, l.phone_number), l.business_description, l.logo_url, l.banner_url,
          l.verified_address, true, 'live')
  RETURNING id INTO _bid;
  PERFORM set_config('app.review_action','on',true);
  UPDATE public.b2b_external_leads SET verification_status='promoted', verified_at=now(), reviewed_by=auth.uid() WHERE id=_lead_id;
  PERFORM set_config('app.review_action','off',true);
  RETURN _bid;
END $function$;

CREATE OR REPLACE FUNCTION public.unpublish_reviewed_lead(_lead_id uuid, _business_id uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  UPDATE public.businesses SET listing_status='draft', is_verified=false WHERE id=_business_id;
  PERFORM set_config('app.review_action','on',true);
  UPDATE public.b2b_external_leads SET verification_status='needs_review', reviewed_by=auth.uid() WHERE id=_lead_id;
  PERFORM set_config('app.review_action','off',true);
END $function$;