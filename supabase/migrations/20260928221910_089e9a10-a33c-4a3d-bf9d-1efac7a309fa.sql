CREATE OR REPLACE FUNCTION public.publish_reviewed_lead(_lead_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
DECLARE l record; _owner uuid; _bid uuid;
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT * INTO l FROM public.b2b_external_leads WHERE id = _lead_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead not found'; END IF;
  IF l.verification_status NOT IN ('needs_review','pending') THEN
    RAISE EXCEPTION 'This business was already decided (%). Refresh your list.', l.verification_status;
  END IF;
  -- reuse an existing live listing with the same name + city instead of creating a copy
  SELECT id INTO _bid FROM public.businesses
   WHERE lower(trim(business_name)) = lower(trim(l.business_name))
     AND lower(trim(coalesce(city,''))) = lower(trim(coalesce(l.city,'')))
   LIMIT 1;
  IF _bid IS NULL THEN
    IF public.is_admin_secure() THEN _owner := auth.uid();
    ELSE SELECT user_id INTO _owner FROM public.user_roles WHERE role='admin' ORDER BY id LIMIT 1; END IF;
    INSERT INTO public.businesses (owner_id, name, business_name, category, city, state, website, phone, description, logo_url, banner_url, address, is_verified, listing_status)
    VALUES (_owner, l.business_name, l.business_name, l.category, l.city, l.state, l.website_url,
            COALESCE(l.verified_phone, l.phone_number), l.business_description, l.logo_url, l.banner_url,
            l.verified_address, true, 'live')
    RETURNING id INTO _bid;
  END IF;
  PERFORM set_config('app.review_action','on',true);
  UPDATE public.b2b_external_leads SET verification_status='promoted', verified_at=now(), reviewed_by=auth.uid() WHERE id=_lead_id;
  PERFORM set_config('app.review_action','off',true);
  PERFORM public.log_review_decision(_lead_id, 'approved', _bid);
  RETURN _bid;
END $function$;

CREATE OR REPLACE FUNCTION public.set_lead_review_status(_lead_id uuid, _status text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
DECLARE cur text;
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF _status NOT IN ('rejected','pending','needs_review') THEN RAISE EXCEPTION 'Invalid status'; END IF;
  SELECT verification_status INTO cur FROM public.b2b_external_leads WHERE id=_lead_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead not found'; END IF;
  IF cur = 'promoted' AND NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'This business is already live. Ask an admin to take it down.';
  END IF;
  IF cur = _status THEN RETURN; END IF;
  PERFORM set_config('app.review_action','on',true);
  UPDATE public.b2b_external_leads SET verification_status=_status, reviewed_by=auth.uid(), verified_at=now() WHERE id=_lead_id;
  PERFORM set_config('app.review_action','off',true);
  PERFORM public.log_review_decision(_lead_id, CASE WHEN _status='rejected' THEN 'rejected' ELSE 'sent_back' END, NULL);
END $function$;

CREATE OR REPLACE FUNCTION public.unpublish_reviewed_lead(_lead_id uuid, _business_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.review_decisions
                 WHERE lead_id=_lead_id AND business_id=_business_id AND decision='approved'
                   AND (reviewer_id=auth.uid() OR public.is_admin_secure())) THEN
    RAISE EXCEPTION 'You can only undo your own approvals.';
  END IF;
  PERFORM set_config('app.review_action','on',true);
  UPDATE public.businesses SET listing_status='draft', is_verified=false WHERE id=_business_id;
  UPDATE public.b2b_external_leads SET verification_status='needs_review', reviewed_by=auth.uid() WHERE id=_lead_id;
  PERFORM set_config('app.review_action','off',true);
  PERFORM public.log_review_decision(_lead_id, 'undone', _business_id);
END $function$;