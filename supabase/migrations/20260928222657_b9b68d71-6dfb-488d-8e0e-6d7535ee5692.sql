CREATE TABLE public.reviewer_letter_ranges (
  user_id uuid PRIMARY KEY,
  name_range text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviewer_letter_ranges TO authenticated;
GRANT ALL ON public.reviewer_letter_ranges TO service_role;
ALTER TABLE public.reviewer_letter_ranges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviewers see own range, admins see all" ON public.reviewer_letter_ranges
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin_secure());
CREATE POLICY "Admins manage ranges" ON public.reviewer_letter_ranges
  FOR ALL TO authenticated USING (public.is_admin_secure()) WITH CHECK (public.is_admin_secure());

INSERT INTO public.reviewer_letter_ranges(user_id, name_range) VALUES
 ('baf018a6-3f50-4545-8de8-37db7c8e36f0','ah'),
 ('d182f52d-0f01-498c-8f4a-5aa327b0ded1','ip'),
 ('c78df213-3721-4c0e-a140-be050ab1edac','qz');

CREATE OR REPLACE FUNCTION public.list_lead_claim_requests()
RETURNS TABLE(id uuid, lead_id uuid, business_id uuid, business_name text, city text, state text, website_url text, requester_email text, requester_name text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _range text := 'all';
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized' USING ERRCODE='42501'; END IF;
  IF NOT public.is_admin_secure() THEN
    SELECT name_range INTO _range FROM public.reviewer_letter_ranges WHERE user_id = auth.uid();
    _range := coalesce(_range, 'all');
  END IF;
  RETURN QUERY SELECT q.id, q.lead_id, q.business_id,
    coalesce(l.business_name, b.business_name)::text, coalesce(l.city,b.city)::text, coalesce(l.state,b.state)::text,
    coalesce(l.website_url,b.website)::text, u.email::text, p.full_name::text, q.created_at
  FROM public.lead_claim_requests q
  LEFT JOIN public.b2b_external_leads l ON l.id=q.lead_id
  LEFT JOIN public.businesses b ON b.id=q.business_id
  LEFT JOIN auth.users u ON u.id=q.user_id
  LEFT JOIN public.profiles p ON p.id=q.user_id
  WHERE q.status='pending'
    AND public._review_range_match(coalesce(l.business_name, b.business_name), _range)
  ORDER BY q.created_at;
END $$;

-- reviewers may only decide claims in their own letters
CREATE OR REPLACE FUNCTION public.decide_lead_claim_request(_request_id uuid, _approve boolean)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE r record; _range text; _name text;
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized' USING ERRCODE='42501'; END IF;
  SELECT * INTO r FROM public.lead_claim_requests WHERE id=_request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found'; END IF;
  IF r.status <> 'pending' THEN RAISE EXCEPTION 'Request already decided'; END IF;
  IF NOT public.is_admin_secure() THEN
    SELECT name_range INTO _range FROM public.reviewer_letter_ranges WHERE user_id=auth.uid();
    SELECT coalesce((SELECT business_name FROM public.b2b_external_leads WHERE id=r.lead_id),
                    (SELECT business_name FROM public.businesses WHERE id=r.business_id)) INTO _name;
    IF NOT public._review_range_match(_name, coalesce(_range,'all')) THEN
      RAISE EXCEPTION 'This claim belongs to another reviewer''s letters';
    END IF;
  END IF;
  IF _approve THEN
    PERFORM set_config('app.review_action','on',true);
    IF r.business_id IS NOT NULL THEN
      IF EXISTS (SELECT 1 FROM public.businesses WHERE id=r.business_id AND claim_status='claimed') THEN
        RAISE EXCEPTION 'This listing was already claimed'; END IF;
      UPDATE public.businesses SET owner_id=r.user_id, claim_status='claimed', claimed_at=now() WHERE id=r.business_id;
      DELETE FROM public.businesses_claim_tokens WHERE business_id=r.business_id;
      UPDATE public.lead_claim_requests SET status='rejected', decided_by=auth.uid(), decided_at=now()
       WHERE business_id=r.business_id AND id<>r.id AND status='pending';
    ELSE
      UPDATE public.b2b_external_leads SET claimed_by_user_id=r.user_id, claimed_at=now(), claim_status='verified',
             claim_token=NULL, claim_token_expires_at=NULL WHERE id=r.lead_id;
      UPDATE public.lead_claim_requests SET status='rejected', decided_by=auth.uid(), decided_at=now()
       WHERE lead_id=r.lead_id AND id<>r.id AND status='pending';
    END IF;
    PERFORM set_config('app.review_action','off',true);
  END IF;
  UPDATE public.lead_claim_requests SET status=CASE WHEN _approve THEN 'approved' ELSE 'rejected' END,
    decided_by=auth.uid(), decided_at=now() WHERE id=_request_id;
  RETURN jsonb_build_object('success',true);
END $$;