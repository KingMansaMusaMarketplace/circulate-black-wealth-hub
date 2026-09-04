
REVOKE ALL ON FUNCTION public.protect_sales_agent_application_fields() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_job_posting_fields() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_lease_agreement_fields() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_vacation_booking_fields() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_privileged_writer() FROM PUBLIC, anon, authenticated;
