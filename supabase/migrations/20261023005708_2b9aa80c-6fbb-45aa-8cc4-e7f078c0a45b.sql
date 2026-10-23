CREATE OR REPLACE FUNCTION public.hc_verify_preview_access(p_token text, p_device text, p_end boolean DEFAULT false)
RETURNS jsonb LANGUAGE plpgsql SET search_path TO 'public' AS $function$
DECLARE r public.hc_access_requests%ROWTYPE; t timestamptz := clock_timestamp();
BEGIN
 IF p_token IS NULL OR p_device IS NULL OR p_token !~ '^[a-f0-9]{48}$' OR p_device !~ '^[a-f0-9]{32}$' THEN RETURN jsonb_build_object('ok',false,'reason','invalid'); END IF;
 SELECT * INTO r FROM public.hc_access_requests WHERE access_token=p_token FOR UPDATE;
 IF NOT FOUND OR r.status <> 'approved' THEN RETURN jsonb_build_object('ok',false,'reason','invalid'); END IF;
 IF r.device_id IS NOT NULL AND r.device_id <> p_device THEN RETURN jsonb_build_object('ok',false,'reason','device'); END IF;
 IF (r.viewing_expires_at IS NOT NULL AND t >= r.viewing_expires_at) OR (r.viewing_expires_at IS NULL AND (r.expires_at IS NULL OR t >= r.expires_at)) THEN
 UPDATE public.hc_access_requests SET status='expired', access_token=NULL WHERE id=r.id;
 RETURN jsonb_build_object('ok',false,'reason','expired');
 END IF;
 IF p_end THEN
 UPDATE public.hc_access_requests SET status='expired',access_token=NULL,viewing_expires_at=t WHERE id=r.id;
 RETURN jsonb_build_object('ok',false,'reason','expired');
 END IF;
 IF r.first_entered_at IS NULL THEN
 UPDATE public.hc_access_requests SET first_entered_at=t,viewing_expires_at=t+interval '40 minutes',device_id=p_device WHERE id=r.id RETURNING * INTO r;
 END IF;
 RETURN jsonb_build_object('ok',true,'request_id',r.id,'name',r.full_name,'email',r.work_email,'viewing_expires_at',r.viewing_expires_at,'server_now',t);
END; $function$;
REVOKE ALL ON FUNCTION public.hc_verify_preview_access(text,text,boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hc_verify_preview_access(text,text,boolean) TO service_role;