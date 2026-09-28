ALTER TABLE public.lead_claim_requests ALTER COLUMN lead_id DROP NOT NULL;
ALTER TABLE public.lead_claim_requests ADD COLUMN IF NOT EXISTS business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE;

-- Email link for a live listing: now only files a request
CREATE OR REPLACE FUNCTION public.claim_directory_business(p_token text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_biz record; v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('success',false,'error','You must be signed in to claim a listing'); END IF;
  SELECT b.id, b.business_name INTO v_biz FROM public.businesses_claim_tokens t JOIN public.businesses b ON b.id=t.business_id
   WHERE t.claim_token=p_token AND t.claim_token_expires_at>now() AND b.claim_status IS DISTINCT FROM 'claimed';
  IF NOT FOUND THEN RETURN jsonb_build_object('success',false,'error','This claim link is invalid, expired, or already used'); END IF;
  IF NOT EXISTS (SELECT 1 FROM public.lead_claim_requests WHERE business_id=v_biz.id AND user_id=v_uid AND status='pending') THEN
    INSERT INTO public.lead_claim_requests(business_id,user_id,status) VALUES (v_biz.id,v_uid,'pending');
  END IF;
  RETURN jsonb_build_object('success',true,'pending',true,'business_id',v_biz.id,'business_name',v_biz.business_name);
END $$;

-- Email link for a review-list business: now only files a request, always for the signed-in person
CREATE OR REPLACE FUNCTION public.claim_business_lead(p_token text, p_user_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_lead record; v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('success',false,'error','You must be signed in to claim a listing'); END IF;
  SELECT id, business_name INTO v_lead FROM public.b2b_external_leads
   WHERE claim_token=p_token AND claim_token_expires_at>now() AND claim_status='pending';
  IF NOT FOUND THEN RETURN jsonb_build_object('success',false,'error','Invalid or expired claim token'); END IF;
  IF NOT EXISTS (SELECT 1 FROM public.lead_claim_requests WHERE lead_id=v_lead.id AND user_id=v_uid AND status='pending') THEN
    INSERT INTO public.lead_claim_requests(lead_id,user_id,status) VALUES (v_lead.id,v_uid,'pending');
  END IF;
  RETURN jsonb_build_object('success',true,'pending',true,'lead_id',v_lead.id,'business_name',v_lead.business_name);
END $$;
REVOKE EXECUTE ON FUNCTION public.claim_business_lead(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_business_lead(text, uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.claim_b2b_lead(uuid, text) FROM PUBLIC, anon, authenticated;

-- Staff decision: the only place ownership moves
CREATE OR REPLACE FUNCTION public.decide_lead_claim_request(_request_id uuid, _approve boolean)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE r record;
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized' USING ERRCODE='42501'; END IF;
  SELECT * INTO r FROM public.lead_claim_requests WHERE id=_request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found'; END IF;
  IF r.status <> 'pending' THEN RAISE EXCEPTION 'Request already decided'; END IF;
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

DROP FUNCTION IF EXISTS public.list_lead_claim_requests();
CREATE FUNCTION public.list_lead_claim_requests()
RETURNS TABLE(id uuid, lead_id uuid, business_id uuid, business_name text, city text, state text, website_url text, requester_email text, requester_name text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized' USING ERRCODE='42501'; END IF;
  RETURN QUERY SELECT q.id, q.lead_id, q.business_id,
    coalesce(l.business_name, b.business_name)::text, coalesce(l.city,b.city)::text, coalesce(l.state,b.state)::text,
    coalesce(l.website_url,b.website)::text, u.email::text, p.full_name::text, q.created_at
  FROM public.lead_claim_requests q
  LEFT JOIN public.b2b_external_leads l ON l.id=q.lead_id
  LEFT JOIN public.businesses b ON b.id=q.business_id
  LEFT JOIN auth.users u ON u.id=q.user_id
  LEFT JOIN public.profiles p ON p.id=q.user_id
  WHERE q.status='pending' ORDER BY q.created_at;
END $$;
REVOKE EXECUTE ON FUNCTION public.list_lead_claim_requests() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_lead_claim_requests() TO authenticated;