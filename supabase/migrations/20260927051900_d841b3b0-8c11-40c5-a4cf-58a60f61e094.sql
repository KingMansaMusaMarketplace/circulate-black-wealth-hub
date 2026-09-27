CREATE TABLE public.lead_claim_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.b2b_external_leads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  decided_by uuid,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lead_id, user_id)
);
GRANT SELECT, INSERT ON public.lead_claim_requests TO authenticated;
GRANT ALL ON public.lead_claim_requests TO service_role;
ALTER TABLE public.lead_claim_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners submit own claim requests" ON public.lead_claim_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending' AND decided_by IS NULL);
CREATE POLICY "Owners and reviewers read claim requests" ON public.lead_claim_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.can_review_businesses());

CREATE OR REPLACE FUNCTION public.decide_lead_claim_request(_request_id uuid, _approve boolean)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r record; v_token text; v_res jsonb;
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized' USING ERRCODE='42501'; END IF;
  SELECT * INTO r FROM public.lead_claim_requests WHERE id = _request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found'; END IF;
  IF r.status <> 'pending' THEN RAISE EXCEPTION 'Request already decided'; END IF;
  IF _approve THEN
    v_token := public.generate_claim_token(r.lead_id);
    v_res := public.claim_business_lead(v_token, r.user_id);
    IF NOT coalesce((v_res->>'success')::boolean, false) THEN RETURN v_res; END IF;
    UPDATE public.lead_claim_requests SET status='rejected', decided_by=auth.uid(), decided_at=now()
      WHERE lead_id = r.lead_id AND id <> r.id AND status='pending';
  END IF;
  UPDATE public.lead_claim_requests SET status = CASE WHEN _approve THEN 'approved' ELSE 'rejected' END,
    decided_by = auth.uid(), decided_at = now() WHERE id = _request_id;
  RETURN jsonb_build_object('success', true);
END $$;
REVOKE ALL ON FUNCTION public.decide_lead_claim_request(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.decide_lead_claim_request(uuid, boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.list_lead_claim_requests()
RETURNS TABLE(id uuid, lead_id uuid, business_name text, city text, state text, website_url text, requester_email text, requester_name text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized' USING ERRCODE='42501'; END IF;
  RETURN QUERY SELECT q.id, q.lead_id, l.business_name, l.city, l.state, l.website_url,
    u.email::text, p.full_name, q.created_at
  FROM public.lead_claim_requests q
  JOIN public.b2b_external_leads l ON l.id = q.lead_id
  LEFT JOIN auth.users u ON u.id = q.user_id
  LEFT JOIN public.profiles p ON p.id = q.user_id
  WHERE q.status = 'pending' ORDER BY q.created_at;
END $$;
REVOKE ALL ON FUNCTION public.list_lead_claim_requests() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_lead_claim_requests() TO authenticated;