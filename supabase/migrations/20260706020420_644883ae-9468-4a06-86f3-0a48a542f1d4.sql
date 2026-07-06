
-- 1. qr_code_scans: force sales_agent_id from server-side referral_code lookup on customer inserts
CREATE OR REPLACE FUNCTION public.sanitize_qr_code_scan_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_agent_id uuid;
BEGIN
  -- Only enforce when caller is an authenticated end user (service_role has null auth.uid())
  IF auth.uid() IS NOT NULL AND NOT public.is_admin_secure() THEN
    SELECT id INTO v_agent_id FROM public.sales_agents WHERE referral_code = NEW.referral_code LIMIT 1;
    NEW.sales_agent_id := v_agent_id; -- may be NULL if no match; prevents spoofing
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_sanitize_qr_code_scan_insert ON public.qr_code_scans;
CREATE TRIGGER trg_sanitize_qr_code_scan_insert BEFORE INSERT ON public.qr_code_scans
FOR EACH ROW EXECUTE FUNCTION public.sanitize_qr_code_scan_insert();

-- 2. qr_scans: force points_awarded / discount_applied from qr_codes row
CREATE OR REPLACE FUNCTION public.sanitize_qr_scan_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_points integer;
  v_discount integer;
  v_business_id uuid;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    SELECT COALESCE(points_value,0), COALESCE(discount_percentage,0), business_id
      INTO v_points, v_discount, v_business_id
    FROM public.qr_codes WHERE id = NEW.qr_code_id;
    IF v_business_id IS NULL THEN
      RAISE EXCEPTION 'Invalid qr_code_id';
    END IF;
    NEW.points_awarded := v_points;
    NEW.discount_applied := v_discount;
    NEW.business_id := v_business_id;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_sanitize_qr_scan_insert ON public.qr_scans;
CREATE TRIGGER trg_sanitize_qr_scan_insert BEFORE INSERT ON public.qr_scans
FOR EACH ROW EXECUTE FUNCTION public.sanitize_qr_scan_insert();

-- 3. coalition_redemptions: force points_spent = reward.points_cost + validate balance
CREATE OR REPLACE FUNCTION public.sanitize_coalition_redemption_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_cost integer;
  v_balance integer;
  v_active boolean;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    SELECT points_cost, COALESCE(is_active,true) INTO v_cost, v_active
      FROM public.coalition_rewards WHERE id = NEW.reward_id;
    IF v_cost IS NULL THEN RAISE EXCEPTION 'Invalid reward_id'; END IF;
    IF NOT v_active THEN RAISE EXCEPTION 'Reward not active'; END IF;
    NEW.points_spent := v_cost;
    SELECT COALESCE(points,0) INTO v_balance FROM public.coalition_points WHERE customer_id = NEW.customer_id;
    IF COALESCE(v_balance,0) < v_cost THEN
      RAISE EXCEPTION 'Insufficient coalition points';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_sanitize_coalition_redemption_insert ON public.coalition_redemptions;
CREATE TRIGGER trg_sanitize_coalition_redemption_insert BEFORE INSERT ON public.coalition_redemptions
FOR EACH ROW EXECUTE FUNCTION public.sanitize_coalition_redemption_insert();

-- 4. redeemed_rewards: force points_used = rewards.points_cost + validate balance across loyalty_points
CREATE OR REPLACE FUNCTION public.sanitize_redeemed_reward_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_cost integer;
  v_active boolean;
  v_balance integer;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    SELECT points_cost, COALESCE(is_active,true) INTO v_cost, v_active
      FROM public.rewards WHERE id = NEW.reward_id;
    IF v_cost IS NULL THEN RAISE EXCEPTION 'Invalid reward_id'; END IF;
    IF NOT v_active THEN RAISE EXCEPTION 'Reward not active'; END IF;
    NEW.points_used := v_cost;
    IF NEW.business_id IS NOT NULL THEN
      SELECT COALESCE(SUM(points),0) INTO v_balance
        FROM public.loyalty_points
        WHERE customer_id = NEW.customer_id AND business_id = NEW.business_id;
      IF v_balance < v_cost THEN
        RAISE EXCEPTION 'Insufficient loyalty points';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_sanitize_redeemed_reward_insert ON public.redeemed_rewards;
CREATE TRIGGER trg_sanitize_redeemed_reward_insert BEFORE INSERT ON public.redeemed_rewards
FOR EACH ROW EXECUTE FUNCTION public.sanitize_redeemed_reward_insert();

-- 5. tracked_visits: force status=pending on customer-initiated inserts (edge function using service_role bypasses)
CREATE OR REPLACE FUNCTION public.sanitize_tracked_visit_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND auth.uid() = NEW.customer_id THEN
    NEW.status := 'pending';
    NEW.confirmed_at := NULL;
    NEW.confirmed_by_method := NULL;
    IF NEW.reported_amount < 0 OR NEW.reported_amount > 99999.99 THEN
      RAISE EXCEPTION 'Invalid reported_amount';
    END IF;
    IF NEW.discount_percentage < 0 OR NEW.discount_percentage > 100 THEN
      RAISE EXCEPTION 'Invalid discount_percentage';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_sanitize_tracked_visit_insert ON public.tracked_visits;
CREATE TRIGGER trg_sanitize_tracked_visit_insert BEFORE INSERT ON public.tracked_visits
FOR EACH ROW EXECUTE FUNCTION public.sanitize_tracked_visit_insert();
