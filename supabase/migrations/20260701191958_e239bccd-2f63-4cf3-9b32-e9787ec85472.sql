
DROP VIEW IF EXISTS public.property_availability_public;

CREATE VIEW public.property_availability_public
WITH (security_invoker = on) AS
SELECT pa.id, pa.property_id, pa.date, pa.is_available, pa.created_at
FROM public.property_availability pa
JOIN public.vacation_properties vp ON vp.id = pa.property_id
WHERE vp.is_active = true;

GRANT SELECT ON public.property_availability_public TO anon, authenticated;
