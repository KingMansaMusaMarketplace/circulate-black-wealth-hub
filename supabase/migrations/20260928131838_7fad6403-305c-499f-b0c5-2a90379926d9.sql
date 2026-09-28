CREATE TABLE public.review_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL,
  business_name text,
  decision text NOT NULL,
  reviewer_id uuid,
  reviewer_email text,
  business_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  backfilled boolean NOT NULL DEFAULT false
);
GRANT SELECT ON public.review_decisions TO authenticated;
GRANT ALL ON public.review_decisions TO service_role;
ALTER TABLE public.review_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviewers see own, admins see all" ON public.review_decisions
FOR SELECT TO authenticated
USING (reviewer_id = auth.uid() OR public.is_admin_secure());
CREATE INDEX review_decisions_reviewer_idx ON public.review_decisions(reviewer_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.log_review_decision(_lead_id uuid, _decision text, _business_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.review_decisions(lead_id, business_name, decision, reviewer_id, reviewer_email, business_id)
  SELECT _lead_id, l.business_name, _decision, auth.uid(), (SELECT email FROM auth.users WHERE id = auth.uid()), _business_id
  FROM public.b2b_external_leads l WHERE l.id = _lead_id;
END $$;
REVOKE ALL ON FUNCTION public.log_review_decision(uuid, text, uuid) FROM PUBLIC, anon, authenticated;

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
  PERFORM public.log_review_decision(_lead_id, 'approved', _bid);
  RETURN _bid;
END $function$;

CREATE OR REPLACE FUNCTION public.set_lead_review_status(_lead_id uuid, _status text)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF _status NOT IN ('rejected','pending','needs_review') THEN RAISE EXCEPTION 'Invalid status'; END IF;
  PERFORM set_config('app.review_action','on',true);
  UPDATE public.b2b_external_leads SET verification_status=_status, reviewed_by=auth.uid() WHERE id=_lead_id;
  PERFORM set_config('app.review_action','off',true);
  PERFORM public.log_review_decision(_lead_id, CASE WHEN _status='rejected' THEN 'rejected' ELSE 'sent_back' END, NULL);
END $function$;