ALTER TABLE public.b2b_external_leads ADD COLUMN IF NOT EXISTS reviewed_by uuid;

CREATE OR REPLACE FUNCTION public.can_review_businesses()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_admin_secure() OR public.has_role(auth.uid(), 'reviewer'::app_role)
$$;
REVOKE EXECUTE ON FUNCTION public.can_review_businesses() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.can_review_businesses() TO authenticated;

CREATE POLICY "Reviewers can view leads" ON public.b2b_external_leads
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'reviewer'::app_role));
CREATE POLICY "Reviewers can update leads" ON public.b2b_external_leads
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'reviewer'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'reviewer'::app_role));

-- Record who made each review decision
CREATE OR REPLACE FUNCTION public.stamp_lead_reviewer()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND (NEW.verification_status IS DISTINCT FROM OLD.verification_status
     OR NEW.black_owned_confidence IS DISTINCT FROM OLD.black_owned_confidence) THEN
    NEW.reviewed_by := auth.uid();
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_stamp_lead_reviewer ON public.b2b_external_leads;
CREATE TRIGGER trg_stamp_lead_reviewer BEFORE UPDATE ON public.b2b_external_leads
  FOR EACH ROW EXECUTE FUNCTION public.stamp_lead_reviewer();

-- Publish a lead as a live business, owned by the main admin (not the reviewer)
CREATE OR REPLACE FUNCTION public.publish_reviewed_lead(_lead_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
  UPDATE public.b2b_external_leads SET verification_status='promoted', verified_at=now() WHERE id=_lead_id;
  RETURN _bid;
END $$;
REVOKE EXECUTE ON FUNCTION public.publish_reviewed_lead(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.publish_reviewed_lead(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.unpublish_reviewed_lead(_lead_id uuid, _business_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  UPDATE public.businesses SET listing_status='draft', is_verified=false WHERE id=_business_id;
  UPDATE public.b2b_external_leads SET verification_status='needs_review' WHERE id=_lead_id;
END $$;
REVOKE EXECUTE ON FUNCTION public.unpublish_reviewed_lead(uuid, uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.unpublish_reviewed_lead(uuid, uuid) TO authenticated;