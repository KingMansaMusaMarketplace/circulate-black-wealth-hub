
DROP POLICY IF EXISTS "Business owners can view their bookings" ON public.bookings;

DROP VIEW IF EXISTS public.business_owner_bookings;
CREATE VIEW public.business_owner_bookings
WITH (security_invoker = false) AS
SELECT
  b.id, b.business_id, b.customer_id, b.service_id,
  b.customer_name, b.customer_email, b.customer_phone,
  b.booking_date, b.duration_minutes, b.status, b.notes,
  b.amount, b.platform_fee, b.business_amount,
  b.cancellation_reason, b.cancelled_at, b.created_at, b.updated_at
FROM public.bookings b
WHERE b.business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid());

ALTER VIEW public.business_owner_bookings OWNER TO postgres;
GRANT SELECT ON public.business_owner_bookings TO authenticated;
REVOKE ALL ON public.business_owner_bookings FROM anon;

DROP POLICY IF EXISTS "Hosts can view bookings for their properties" ON public.vacation_bookings;

DROP VIEW IF EXISTS public.host_vacation_bookings;
CREATE VIEW public.host_vacation_bookings
WITH (security_invoker = false) AS
SELECT
  vb.id, vb.property_id, vb.guest_id,
  vb.guest_name, vb.guest_email, vb.guest_phone,
  vb.check_in_date, vb.check_out_date, vb.num_nights, vb.num_guests, vb.num_pets,
  vb.nightly_rate, vb.cleaning_fee, vb.pet_fee, vb.subtotal,
  vb.platform_fee, vb.host_payout, vb.total_amount,
  vb.status, vb.payout_status, vb.payout_date,
  vb.special_requests, vb.confirmed_at,
  vb.cancellation_policy, vb.cancelled_at, vb.cancelled_by,
  vb.cancellation_reason, vb.refund_amount, vb.refund_status,
  vb.created_at, vb.updated_at
FROM public.vacation_bookings vb
WHERE vb.property_id IN (SELECT id FROM public.vacation_properties WHERE host_id = auth.uid());

ALTER VIEW public.host_vacation_bookings OWNER TO postgres;
GRANT SELECT ON public.host_vacation_bookings TO authenticated;
REVOKE ALL ON public.host_vacation_bookings FROM anon;

DROP POLICY IF EXISTS "Business owners can view their transactions" ON public.platform_transactions;
DROP POLICY IF EXISTS "Customers can view their transactions" ON public.platform_transactions;

DROP VIEW IF EXISTS public.business_owner_platform_transactions;
CREATE VIEW public.business_owner_platform_transactions
WITH (security_invoker = false) AS
SELECT
  pt.id, pt.business_id, pt.customer_id,
  pt.amount_total, pt.amount_platform_fee, pt.amount_business,
  pt.platform_fee_percentage, pt.currency, pt.status,
  pt.description, pt.customer_name,
  pt.created_at, pt.updated_at
FROM public.platform_transactions pt
WHERE pt.business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid());

ALTER VIEW public.business_owner_platform_transactions OWNER TO postgres;
GRANT SELECT ON public.business_owner_platform_transactions TO authenticated;
REVOKE ALL ON public.business_owner_platform_transactions FROM anon;

DROP VIEW IF EXISTS public.customer_platform_transactions;
CREATE VIEW public.customer_platform_transactions
WITH (security_invoker = false) AS
SELECT
  pt.id, pt.business_id,
  pt.amount_total, pt.amount_platform_fee, pt.amount_business,
  pt.platform_fee_percentage, pt.currency, pt.status,
  pt.description,
  pt.created_at, pt.updated_at
FROM public.platform_transactions pt
WHERE pt.customer_id = auth.uid();

ALTER VIEW public.customer_platform_transactions OWNER TO postgres;
GRANT SELECT ON public.customer_platform_transactions TO authenticated;
REVOKE ALL ON public.customer_platform_transactions FROM anon;
