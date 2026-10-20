CREATE TABLE public.hc_founding_clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name text NOT NULL,
  country text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  practice_type text NOT NULL,
  clinician_count integer NOT NULL,
  letter_of_intent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.hc_founding_clinics TO anon, authenticated;
GRANT SELECT ON public.hc_founding_clinics TO authenticated;
GRANT ALL ON public.hc_founding_clinics TO service_role;
ALTER TABLE public.hc_founding_clinics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join founding clinic list" ON public.hc_founding_clinics FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(clinic_name)) BETWEEN 2 AND 160 AND length(trim(country)) BETWEEN 2 AND 80
    AND length(trim(contact_name)) BETWEEN 2 AND 120 AND length(email) <= 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND practice_type IN ('independent_practice','hospital_department','global_clinic')
    AND clinician_count BETWEEN 1 AND 100000);
CREATE POLICY "Admins read founding clinics" ON public.hc_founding_clinics FOR SELECT TO authenticated
  USING (public._is_admin_current_user());