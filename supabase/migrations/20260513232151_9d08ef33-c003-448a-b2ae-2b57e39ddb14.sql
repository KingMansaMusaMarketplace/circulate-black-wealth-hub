CREATE OR REPLACE VIEW public.business_owner_bookings
WITH (security_invoker = true) AS
SELECT
  id, business_id, customer_id, service_id,
  customer_name, customer_email, customer_phone,
  booking_date, duration_minutes, status, notes,
  amount, platform_fee, business_amount,
  cancellation_reason, cancelled_at,
  created_at, updated_at
FROM public.bookings;

GRANT SELECT ON public.business_owner_bookings TO authenticated;

COMMENT ON VIEW public.business_owner_bookings IS
  'Safe view of bookings for business owners; excludes Stripe payment_intent_id and stripe_charge_id.';

CREATE OR REPLACE VIEW public.host_vacation_bookings
WITH (security_invoker = true) AS
SELECT
  id, property_id, guest_id,
  guest_name, guest_email, guest_phone,
  check_in_date, check_out_date, num_nights, num_guests, num_pets,
  nightly_rate, cleaning_fee, pet_fee, subtotal,
  platform_fee, host_payout, total_amount,
  status, payout_status, payout_date,
  special_requests, confirmed_at,
  cancellation_policy, cancelled_at, cancelled_by, cancellation_reason,
  refund_amount, refund_status,
  created_at, updated_at
FROM public.vacation_bookings;

GRANT SELECT ON public.host_vacation_bookings TO authenticated;

COMMENT ON VIEW public.host_vacation_bookings IS
  'Safe view of vacation_bookings for hosts; excludes Stripe payment_intent_id and stripe_charge_id.';