CREATE OR REPLACE FUNCTION public.hc_has_preview_access() RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
DECLARE h jsonb; tok text; dev text; email text;
BEGIN
 IF auth.uid() IS NULL THEN RETURN false; END IF;
 IF public.has_role(auth.uid(),'admin'::public.app_role) THEN RETURN true; END IF;
 BEGIN h := coalesce(nullif(current_setting('request.headers',true),''),'{}')::jsonb; EXCEPTION WHEN others THEN RETURN false; END;
 tok := h->>'x-hc-preview-token'; dev := h->>'x-hc-preview-device';
 IF tok IS NULL OR dev IS NULL OR tok !~ '^[a-f0-9]{48}$' OR dev !~ '^[a-f0-9]{32}$' THEN RETURN false; END IF;
 SELECT lower(u.email) INTO email FROM auth.users u WHERE u.id=auth.uid();
 RETURN EXISTS(SELECT 1 FROM public.hc_access_requests r WHERE r.access_token=tok AND r.device_id=dev AND r.status='approved' AND lower(r.work_email)=email AND r.first_entered_at IS NOT NULL AND r.viewing_expires_at>statement_timestamp());
END $$;
REVOKE ALL ON FUNCTION public.hc_has_preview_access() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.hc_has_preview_access() TO authenticated,service_role;
CREATE OR REPLACE FUNCTION public.hc_is_member(_clinic uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT public.hc_has_preview_access() AND EXISTS(SELECT 1 FROM public.hc_members WHERE clinic_id=_clinic AND user_id=auth.uid()) $$;
CREATE OR REPLACE FUNCTION public.hc_is_owner(_clinic uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT public.hc_has_preview_access() AND EXISTS(SELECT 1 FROM public.hc_members WHERE clinic_id=_clinic AND user_id=auth.uid() AND role='owner') $$;
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['hc_patients','hc_vitals','hc_medications','hc_encounters','hc_appointments','hc_prior_auths','hc_claims','hc_documents','hc_reviews'] LOOP
 EXECUTE format('REVOKE INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER ON TABLE public.%I FROM anon,authenticated',t);
 EXECUTE format('DROP POLICY IF EXISTS "Clinic members manage" ON public.%I',t);
 EXECUTE format('CREATE POLICY "Approved members read samples" ON public.%I FOR SELECT TO authenticated USING (public.hc_is_member(clinic_id))',t);
 END LOOP;
END $$;
DO $$ DECLARE definition text; BEGIN
 SELECT pg_get_functiondef(oid) INTO definition FROM pg_proc WHERE pronamespace='public'::regnamespace AND proname='hc_create_clinic';
 IF definition IS NULL THEN RAISE EXCEPTION 'Clinic creation function missing'; END IF;
 definition := replace(definition,'IF uid IS NULL THEN RAISE EXCEPTION ''Sign in required''; END IF;','IF uid IS NULL THEN RAISE EXCEPTION ''Sign in required''; END IF; IF NOT public.hc_has_preview_access() THEN RAISE EXCEPTION ''Current owner-approved viewing required''; END IF;');
 IF position('Current owner-approved viewing required' IN definition)=0 THEN RAISE EXCEPTION 'Clinic creation guard not applied'; END IF;
 EXECUTE definition;
END $$;
DO $$ BEGIN
 IF EXISTS(SELECT note_id FROM public.hc_note_signoffs GROUP BY note_id HAVING count(*)>1) THEN RAISE EXCEPTION 'Conflicting note decisions need separate owner review; no decisions removed'; END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS hc_note_signoffs_one_decision ON public.hc_note_signoffs(note_id);
CREATE POLICY "Approved clinical storage access" ON storage.objects AS RESTRICTIVE FOR ALL TO authenticated USING (bucket_id<>'hc-sample-docs' OR public.hc_has_preview_access()) WITH CHECK (bucket_id<>'hc-sample-docs' OR public.hc_has_preview_access());