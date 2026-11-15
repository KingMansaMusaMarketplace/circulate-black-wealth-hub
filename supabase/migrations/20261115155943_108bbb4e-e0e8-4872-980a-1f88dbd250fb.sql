-- 1) Claim approvals: a reviewer with no assigned letter range can no longer
--    approve or reject claims for every business (only admins see all).
CREATE OR REPLACE FUNCTION public.decide_lead_claim_request(_request_id uuid, _approve boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE r record; _range text; _name text;
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized' USING ERRCODE='42501'; END IF;
  SELECT * INTO r FROM public.lead_claim_requests WHERE id=_request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found'; END IF;
  IF r.status <> 'pending' THEN RAISE EXCEPTION 'Request already decided'; END IF;
  IF NOT public.is_admin_secure() THEN
    SELECT name_range INTO _range FROM public.reviewer_letter_ranges WHERE user_id=auth.uid();
    IF _range IS NULL OR _range NOT IN ('ah','ip','qz') THEN
      RAISE EXCEPTION 'No review range is assigned to you yet. Ask an administrator to assign one.' USING ERRCODE='42501';
    END IF;
    SELECT coalesce((SELECT business_name FROM public.b2b_external_leads WHERE id=r.lead_id),
                    (SELECT business_name FROM public.businesses WHERE id=r.business_id)) INTO _name;
    IF NOT public._review_range_match(_name, _range) THEN
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
END $function$;

-- 2) Developer API keys: on creation, ordinary developers always get the
--    standard permissions and rate limit; only admins or the server set others.
CREATE OR REPLACE FUNCTION public.protect_api_keys_insert_defaults()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.is_privileged_writer() THEN
    NEW.scopes := ARRAY['cmal','voice','susu','fraud','loyalty']::text[];
    NEW.rate_limit_per_minute := 60;
    NEW.revoked_at := NULL;
    NEW.last_used_at := NULL;
  END IF;
  RETURN NEW;
END;
$function$;
REVOKE EXECUTE ON FUNCTION public.protect_api_keys_insert_defaults() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS protect_api_keys_insert_defaults ON public.api_keys;
CREATE TRIGGER protect_api_keys_insert_defaults
  BEFORE INSERT ON public.api_keys
  FOR EACH ROW EXECUTE FUNCTION public.protect_api_keys_insert_defaults();