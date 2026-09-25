CREATE OR REPLACE FUNCTION public.set_lead_review_status(_lead_id uuid, _status text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF _status NOT IN ('rejected','pending','needs_review') THEN RAISE EXCEPTION 'Invalid status'; END IF;
  UPDATE public.b2b_external_leads SET verification_status=_status, reviewed_by=auth.uid() WHERE id=_lead_id;
END $$;
REVOKE ALL ON FUNCTION public.set_lead_review_status(uuid,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_lead_review_status(uuid,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_reviewed_lead(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unpublish_reviewed_lead(uuid,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_review_businesses() TO authenticated;