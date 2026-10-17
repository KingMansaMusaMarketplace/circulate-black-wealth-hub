ALTER TABLE public.hc_members ADD COLUMN display_name text;
ALTER TABLE public.hc_note_signoffs ADD COLUMN signer_name text;
CREATE OR REPLACE FUNCTION public.hc_set_my_display_name(_clinic_id uuid, _name text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n text := btrim(coalesce(_name,''));
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  IF length(n) < 2 OR length(n) > 100 THEN RAISE EXCEPTION 'Name must be 2-100 characters'; END IF;
  UPDATE public.hc_members SET display_name = n WHERE clinic_id = _clinic_id AND user_id = auth.uid();
  IF NOT FOUND THEN RAISE EXCEPTION 'Not a member of this clinic'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.hc_set_my_display_name(uuid, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.hc_set_my_display_name(uuid, text) TO authenticated;