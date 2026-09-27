CREATE OR REPLACE FUNCTION public.list_lead_claim_requests()
RETURNS TABLE(id uuid, lead_id uuid, business_name text, city text, state text, website_url text, requester_email text, requester_name text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized' USING ERRCODE='42501'; END IF;
  RETURN QUERY SELECT q.id, q.lead_id, l.business_name::text, l.city::text, l.state::text, l.website_url::text,
    u.email::text, p.full_name::text, q.created_at
  FROM public.lead_claim_requests q
  JOIN public.b2b_external_leads l ON l.id = q.lead_id
  LEFT JOIN auth.users u ON u.id = q.user_id
  LEFT JOIN public.profiles p ON p.id = q.user_id
  WHERE q.status = 'pending' ORDER BY q.created_at;
END $$;