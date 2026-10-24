ALTER TABLE public.hc_access_requests ADD COLUMN viewing_duration_minutes integer NOT NULL DEFAULT 40;
ALTER TABLE public.hc_access_requests ALTER COLUMN nda_accepted_at DROP NOT NULL;
ALTER TABLE public.hc_access_requests ADD CONSTRAINT hc_viewing_duration_allowed CHECK (viewing_duration_minutes IN (40,60));
GRANT SELECT ON public.hc_access_requests TO authenticated;
GRANT ALL ON public.hc_access_requests TO service_role;
CREATE OR REPLACE FUNCTION public.hc_verify_preview_access(p_token text, p_device text, p_end boolean DEFAULT false)
RETURNS jsonb LANGUAGE plpgsql SET search_path TO 'public' AS $function$
DECLARE r public.hc_access_requests%ROWTYPE; t timestamptz := clock_timestamp();
BEGIN
 IF p_token IS NULL OR p_device IS NULL OR p_token !~ '^[a-f0-9]{48}$' OR p_device !~ '^[a-f0-9]{32}$' THEN RETURN jsonb_build_object('ok',false,'reason','invalid'); END IF;
 SELECT * INTO r FROM public.hc_access_requests WHERE access_token=p_token FOR UPDATE;
 IF NOT FOUND OR r.status <> 'approved' OR r.revoked_at IS NOT NULL THEN RETURN jsonb_build_object('ok',false,'reason','invalid'); END IF;
 IF r.device_id IS NOT NULL AND r.device_id <> p_device THEN RETURN jsonb_build_object('ok',false,'reason','device'); END IF;
 IF (r.viewing_expires_at IS NOT NULL AND t >= r.viewing_expires_at) OR (r.viewing_expires_at IS NULL AND (r.expires_at IS NULL OR t >= r.expires_at)) THEN
 UPDATE public.hc_access_requests SET status='expired', access_token=NULL WHERE id=r.id;
 RETURN jsonb_build_object('ok',false,'reason','expired');
 END IF;
 IF p_end THEN
 UPDATE public.hc_access_requests SET status='expired',access_token=NULL,viewing_expires_at=t WHERE id=r.id;
 RETURN jsonb_build_object('ok',false,'reason','expired');
 END IF;
 IF r.nda_accepted_at IS NULL THEN RETURN jsonb_build_object('ok',false,'reason','confidentiality'); END IF;
 IF r.first_entered_at IS NULL THEN
 UPDATE public.hc_access_requests SET first_entered_at=t,viewing_expires_at=t+make_interval(mins => r.viewing_duration_minutes),device_id=p_device WHERE id=r.id RETURNING * INTO r;
 END IF;
 RETURN jsonb_build_object('ok',true,'request_id',r.id,'name',r.full_name,'email',r.work_email,'viewing_duration_minutes',r.viewing_duration_minutes,'viewing_expires_at',r.viewing_expires_at,'server_now',t);
END; $function$;
REVOKE ALL ON FUNCTION public.hc_verify_preview_access(text,text,boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hc_verify_preview_access(text,text,boolean) TO service_role;