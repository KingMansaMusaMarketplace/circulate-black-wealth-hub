-- 1) Badges: only the agent themself (or an admin / server) may trigger a recheck
ALTER FUNCTION public.check_and_award_badges(uuid) RENAME TO _check_and_award_badges_impl;
REVOKE ALL ON FUNCTION public._check_and_award_badges_impl(uuid) FROM PUBLIC, anon, authenticated;
CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_sales_agent_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL
     AND NOT public.has_role(auth.uid(), 'admin')
     AND NOT EXISTS (SELECT 1 FROM public.sales_agents WHERE id = p_sales_agent_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not allowed' USING ERRCODE = '42501';
  END IF;
  PERFORM public._check_and_award_badges_impl(p_sales_agent_id);
END $$;
REVOKE ALL ON FUNCTION public.check_and_award_badges(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_and_award_badges(uuid) TO authenticated, service_role;

-- 2) Impact scorecard: only the business owner/manager (or an admin / server) may recalculate
ALTER FUNCTION public.calculate_business_impact_scorecard(uuid) RENAME TO _calculate_business_impact_scorecard_impl;
REVOKE ALL ON FUNCTION public._calculate_business_impact_scorecard_impl(uuid) FROM PUBLIC, anon, authenticated;
CREATE OR REPLACE FUNCTION public.calculate_business_impact_scorecard(p_business_id uuid)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL
     AND NOT public.has_role(auth.uid(), 'admin')
     AND NOT EXISTS (SELECT 1 FROM public.businesses
                     WHERE id = p_business_id AND (owner_id = auth.uid() OR location_manager_id = auth.uid())) THEN
    RAISE EXCEPTION 'Not allowed' USING ERRCODE = '42501';
  END IF;
  RETURN public._calculate_business_impact_scorecard_impl(p_business_id);
END $$;
REVOKE ALL ON FUNCTION public.calculate_business_impact_scorecard(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.calculate_business_impact_scorecard(uuid) TO authenticated, service_role;

-- 3) Apple subscriptions are written only by the receipt-validation server; users can no longer insert their own rows
DROP POLICY IF EXISTS "Users can insert their own Apple subscriptions" ON public.apple_subscriptions;

-- 4) QR scans: prefer the tamper-proof edge IP header, and allow only one "scanned" email per scan
CREATE OR REPLACE FUNCTION public.set_qr_code_scan_ip()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE h json; ip text;
BEGIN
  BEGIN h := current_setting('request.headers', true)::json; EXCEPTION WHEN others THEN h := NULL; END;
  ip := trim(coalesce(h->>'cf-connecting-ip', split_part(coalesce(h->>'x-forwarded-for', ''), ',', 1)));
  IF ip <> '' THEN
    BEGIN NEW.ip_address := ip::inet; EXCEPTION WHEN others THEN NEW.ip_address := NULL; END;
  ELSE
    NEW.ip_address := NULL;
  END IF;
  RETURN NEW;
END $$;
ALTER TABLE public.qr_code_scans ADD COLUMN IF NOT EXISTS scan_notified_at timestamptz;