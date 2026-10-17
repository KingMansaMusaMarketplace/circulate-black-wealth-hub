CREATE OR REPLACE FUNCTION public._sec_priv_actor()
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT COALESCE(auth.role(), '') IN ('service_role','supabase_admin')
      OR (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'::app_role))
      OR COALESCE(current_setting('app.review_action', true), '') = 'on';
$$;

CREATE OR REPLACE FUNCTION public.zzz_is_priv_actor()
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT coalesce(auth.role() = 'service_role', false)
      OR coalesce(public.has_role(auth.uid(), 'admin'), false)
      OR COALESCE(current_setting('app.review_action', true), '') = 'on';
$$;

CREATE OR REPLACE FUNCTION public.claim_directory_business(p_token text)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_biz record; v_uid uuid := auth.uid(); v_email text; v_match boolean;
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('success',false,'error','You must be signed in to claim a listing'); END IF;
  SELECT b.id, b.business_name INTO v_biz FROM public.businesses_claim_tokens t JOIN public.businesses b ON b.id=t.business_id
   WHERE t.claim_token=p_token AND t.claim_token_expires_at>now() AND b.claim_status IS DISTINCT FROM 'claimed'
   FOR UPDATE OF b;
  IF NOT FOUND THEN RETURN jsonb_build_object('success',false,'error','This claim link is invalid, expired, or already used'); END IF;

  -- Instant claim only when the signed-in account's confirmed email is the address the invite was sent to.
  SELECT lower(email) INTO v_email FROM auth.users WHERE id=v_uid AND email_confirmed_at IS NOT NULL;
  SELECT EXISTS (SELECT 1 FROM public.business_claim_invites i
                  WHERE i.business_id=v_biz.id AND i.status='sent' AND lower(trim(i.email))=v_email) INTO v_match;

  IF v_email IS NOT NULL AND v_match THEN
    PERFORM set_config('app.review_action','on',true);
    UPDATE public.businesses SET owner_id=v_uid, claim_status='claimed', claimed_at=now() WHERE id=v_biz.id;
    PERFORM set_config('app.review_action','off',true);
    DELETE FROM public.businesses_claim_tokens WHERE business_id=v_biz.id;
    UPDATE public.business_claim_invites SET claimed_at=now() WHERE business_id=v_biz.id AND claimed_at IS NULL;
    UPDATE public.business_claim_campaigns c SET total_claimed=coalesce(c.total_claimed,0)+1
     WHERE c.id IN (SELECT campaign_id FROM public.business_claim_invites WHERE business_id=v_biz.id AND campaign_id IS NOT NULL LIMIT 1);
    UPDATE public.lead_claim_requests SET status='rejected', decided_at=now()
     WHERE business_id=v_biz.id AND status='pending' AND user_id<>v_uid;
    RETURN jsonb_build_object('success',true,'claimed',true,'business_id',v_biz.id,'business_name',v_biz.business_name);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.lead_claim_requests WHERE business_id=v_biz.id AND user_id=v_uid AND status='pending') THEN
    INSERT INTO public.lead_claim_requests(business_id,user_id,status) VALUES (v_biz.id,v_uid,'pending');
  END IF;
  RETURN jsonb_build_object('success',true,'pending',true,'business_id',v_biz.id,'business_name',v_biz.business_name);
END $function$;

REVOKE ALL ON FUNCTION public.claim_directory_business(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_directory_business(text) TO authenticated, service_role;