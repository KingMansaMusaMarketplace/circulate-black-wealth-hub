CREATE TABLE public.holiday_campaign_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid,
  email text NOT NULL,
  wave smallint NOT NULL CHECK (wave IN (1,2,3)),
  status text NOT NULL DEFAULT 'sent',
  error text,
  resend_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email, wave)
);
GRANT SELECT ON public.holiday_campaign_sends TO authenticated;
GRANT ALL ON public.holiday_campaign_sends TO service_role;
ALTER TABLE public.holiday_campaign_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view holiday campaign sends" ON public.holiday_campaign_sends
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.get_holiday_campaign_recipients(_wave smallint, _limit int)
RETURNS TABLE(business_id uuid, email text, business_name text, city text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT DISTINCT ON (lower(p.email)) b.id, lower(trim(p.email)), coalesce(b.business_name, b.name), b.city
  FROM businesses b JOIN businesses_private p ON p.business_id = b.id
  WHERE p.email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND coalesce(b.is_verified,false) AND b.listing_status = 'live'
    AND NOT EXISTS (SELECT 1 FROM suppressed_emails s WHERE s.email = lower(trim(p.email)))
    AND NOT EXISTS (SELECT 1 FROM claim_email_optouts o WHERE lower(o.email) = lower(trim(p.email)))
    AND NOT EXISTS (SELECT 1 FROM holiday_campaign_sends h WHERE h.email = lower(trim(p.email)) AND h.wave = _wave)
  ORDER BY lower(p.email), b.id
  LIMIT _limit
$$;
REVOKE ALL ON FUNCTION public.get_holiday_campaign_recipients(smallint,int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_holiday_campaign_recipients(smallint,int) TO service_role;

CREATE OR REPLACE FUNCTION public.get_holiday_campaign_stats()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN NOT public.has_role(auth.uid(),'admin') AND auth.role() <> 'service_role' THEN NULL ELSE jsonb_build_object(
    'eligible', (SELECT count(DISTINCT lower(trim(p.email))) FROM businesses b JOIN businesses_private p ON p.business_id=b.id
       WHERE p.email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND coalesce(b.is_verified,false) AND b.listing_status='live'
       AND NOT EXISTS (SELECT 1 FROM suppressed_emails s WHERE s.email=lower(trim(p.email)))
       AND NOT EXISTS (SELECT 1 FROM claim_email_optouts o WHERE lower(o.email)=lower(trim(p.email)))),
    'unsubscribed', (SELECT count(*) FROM suppressed_emails),
    'waves', (SELECT coalesce(jsonb_object_agg(wave, jsonb_build_object('sent', sent, 'failed', failed)), '{}'::jsonb) FROM (
       SELECT wave, count(*) FILTER (WHERE status='sent') sent, count(*) FILTER (WHERE status='failed') failed FROM holiday_campaign_sends GROUP BY wave) w)
  ) END
$$;
GRANT EXECUTE ON FUNCTION public.get_holiday_campaign_stats() TO authenticated, service_role;