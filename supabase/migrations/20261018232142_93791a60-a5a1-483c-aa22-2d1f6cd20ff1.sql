CREATE OR REPLACE FUNCTION public.hc_add_member(_clinic uuid, _email text, _role text DEFAULT 'staff') RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE target uuid; saved uuid;
BEGIN
 IF NOT public.hc_is_owner(_clinic) THEN RAISE EXCEPTION 'Only the clinic owner can add team members'; END IF;
 IF _role NOT IN ('doctor','staff') OR _role IS NULL THEN RAISE EXCEPTION 'Role must be doctor or staff'; END IF;
 SELECT id INTO target FROM auth.users WHERE lower(email)=lower(trim(_email)) LIMIT 1;
 IF target IS NULL THEN RETURN 'not_found'; END IF;
 IF target=auth.uid() OR EXISTS (SELECT 1 FROM public.hc_clinics WHERE id=_clinic AND created_by=target) OR EXISTS (SELECT 1 FROM public.hc_members WHERE clinic_id=_clinic AND user_id=target AND role='owner') THEN RAISE EXCEPTION 'Clinic ownership cannot be changed by adding a team member'; END IF;
 INSERT INTO public.hc_members(clinic_id,user_id,role,email) VALUES (_clinic,target,_role,lower(trim(_email))) ON CONFLICT (clinic_id,user_id) DO UPDATE SET role=EXCLUDED.role WHERE hc_members.role <> 'owner' RETURNING id INTO saved;
 IF saved IS NULL THEN RAISE EXCEPTION 'Clinic ownership cannot be changed by adding a team member'; END IF;
 RETURN 'added';
END $$;
CREATE OR REPLACE FUNCTION public.hc_create_clinic(_name text, _specialty text DEFAULT NULL) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE c uuid; uid uuid := auth.uid();
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 IF NOT clinical_private.hc_has_preview_access() THEN RAISE EXCEPTION 'Current owner-approved viewing required'; END IF;
 IF coalesce(length(trim(_name)),0)<2 OR length(_name)>120 THEN RAISE EXCEPTION 'Clinic name required'; END IF;
 INSERT INTO public.hc_clinics(name,specialty,created_by) VALUES (trim(_name),_specialty,uid) RETURNING id INTO c;
 INSERT INTO public.hc_members(clinic_id,user_id,role,email) VALUES (c,uid,'owner',(SELECT email FROM auth.users WHERE id=uid));
 INSERT INTO public.hc_patients(clinic_id,first_name,last_name,dob,sex,mrn,payer,conditions,allergies,risk,notes,is_sample) VALUES
 (c,'Avery','Example',NULL,NULL,NULL,NULL,ARRAY[]::text[],ARRAY[]::text[],'Unknown','Source: visit-back-pain-v1; fictional transcript only; demographics, allergies, medication reconciliation and current clinical status unknown.',true),
 (c,'Sam','Placeholder',NULL,NULL,NULL,NULL,ARRAY[]::text[],ARRAY[]::text[],'Unknown','Source: visit-blood-pressure-v1; fictional transcript only; demographics, allergies, medication reconciliation and current clinical status unknown.',true),
 (c,'Riley','Demo',NULL,NULL,NULL,NULL,ARRAY[]::text[],ARRAY[]::text[],'Unknown','Source: visit-knee-v1; fictional transcript only; demographics, allergies, medication reconciliation and current clinical status unknown.',true);
 RETURN c;
END $$;
-- Existing function grants and approval-aware policies are retained. No existing records are changed.
