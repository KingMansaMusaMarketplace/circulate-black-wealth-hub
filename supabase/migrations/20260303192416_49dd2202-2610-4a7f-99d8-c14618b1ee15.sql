
-- Security Fix: Address all 3 error-level findings
-- 1. Remove anon access to businesses table (use secure function instead)
DROP POLICY IF EXISTS "Public can view live businesses" ON public.businesses;

-- 2. Restrict susu_circles: authenticated only, not public
DROP POLICY IF EXISTS "Anyone can view active susu circles" ON public.susu_circles;
CREATE POLICY "Authenticated users can view active susu circles"
ON public.susu_circles FOR SELECT TO authenticated
USING (status IN ('forming', 'active'));

-- 3. Restrict vacation_properties: authenticated only, not public
DROP POLICY IF EXISTS "Anyone can view active properties" ON public.vacation_properties;
CREATE POLICY "Authenticated users can view active properties"
ON public.vacation_properties FOR SELECT TO authenticated
USING (is_active = true);
