
CREATE OR REPLACE FUNCTION public._gamify_award(p_user uuid, p_type text, p_name text, p_desc text, p_icon text, p_pts int)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO user_achievements(user_id, achievement_type, achievement_name, description, icon, points_awarded)
  VALUES (p_user, p_type, p_name, p_desc, p_icon, p_pts) ON CONFLICT (user_id, achievement_type) DO NOTHING;
$$;

CREATE OR REPLACE FUNCTION public.refresh_weekly_leaderboard()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE wk timestamptz := date_trunc('week', now());
BEGIN
  DELETE FROM leaderboard WHERE period = 'weekly' AND category = 'overall';
  INSERT INTO leaderboard(user_id, category, period, score, rank, updated_at)
  SELECT uid, 'overall', 'weekly', pts, rank() OVER (ORDER BY pts DESC), now()
  FROM (
    SELECT uid, sum(p)::int pts FROM (
      SELECT customer_id uid, coalesce(points_awarded,0) p FROM qr_scans
        WHERE customer_id IS NOT NULL AND coalesce(reversed,false)=false AND coalesce(scan_date,created_at) >= wk
      UNION ALL
      SELECT customer_id, coalesce(points_earned,0) FROM transactions
        WHERE customer_id IS NOT NULL AND coalesce(transaction_date,created_at) >= wk
    ) a GROUP BY uid
  ) s WHERE pts > 0;
END $$;

CREATE OR REPLACE FUNCTION public.record_member_activity(p_user uuid, p_day date)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s record; v_cur int; v_long int; n_scans int; n_tx int;
BEGIN
  IF p_user IS NULL THEN RETURN; END IF;
  SELECT * INTO s FROM user_streaks WHERE user_id = p_user AND streak_type = 'shopping';
  IF NOT FOUND THEN
    INSERT INTO user_streaks(user_id, streak_type, current_streak, longest_streak, last_activity_date)
    VALUES (p_user, 'shopping', 1, 1, p_day);
    v_cur := 1;
  ELSIF s.last_activity_date >= p_day THEN
    v_cur := s.current_streak;
  ELSE
    v_cur := CASE WHEN s.last_activity_date = p_day - 1 THEN s.current_streak + 1 ELSE 1 END;
    v_long := greatest(s.longest_streak, v_cur);
    UPDATE user_streaks SET current_streak = v_cur, longest_streak = v_long, last_activity_date = p_day, updated_at = now()
    WHERE id = s.id;
  END IF;

  SELECT count(*) INTO n_scans FROM qr_scans WHERE customer_id = p_user AND coalesce(reversed,false)=false;
  SELECT count(*) INTO n_tx FROM transactions WHERE customer_id = p_user;
  IF n_scans >= 1 THEN PERFORM _gamify_award(p_user,'first_scan','First Scan','Scanned your first QR code at a Black-owned business','star',10); END IF;
  IF n_scans >= 10 THEN PERFORM _gamify_award(p_user,'scans_10','Regular Supporter','Scanned 10 QR codes','award',50); END IF;
  IF n_tx >= 1 THEN PERFORM _gamify_award(p_user,'first_purchase','First Purchase','Made your first purchase','trophy',10); END IF;
  IF n_tx >= 10 THEN PERFORM _gamify_award(p_user,'purchases_10','Loyal Shopper','Made 10 purchases','trophy',50); END IF;
  IF v_cur >= 3 THEN PERFORM _gamify_award(p_user,'streak_3','On a Roll','Supported businesses 3 days in a row','flame',25); END IF;
  IF v_cur >= 7 THEN PERFORM _gamify_award(p_user,'streak_7','Week Warrior','Supported businesses 7 days in a row','flame',100); END IF;

  PERFORM refresh_weekly_leaderboard();
END $$;

REVOKE ALL ON FUNCTION public._gamify_award(uuid,text,text,text,text,int) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_member_activity(uuid,date) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.refresh_weekly_leaderboard() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.trg_gamify_scan() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  BEGIN
    PERFORM record_member_activity(NEW.customer_id, (coalesce(NEW.scan_date, now()) AT TIME ZONE 'America/Chicago')::date);
  EXCEPTION WHEN others THEN RAISE WARNING 'gamify scan failed: %', SQLERRM; END;
  RETURN NEW;
END $$;
CREATE OR REPLACE FUNCTION public.trg_gamify_tx() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  BEGIN
    PERFORM record_member_activity(NEW.customer_id, (coalesce(NEW.transaction_date, now()) AT TIME ZONE 'America/Chicago')::date);
  EXCEPTION WHEN others THEN RAISE WARNING 'gamify tx failed: %', SQLERRM; END;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS gamify_after_scan ON public.qr_scans;
CREATE TRIGGER gamify_after_scan AFTER INSERT ON public.qr_scans FOR EACH ROW EXECUTE FUNCTION public.trg_gamify_scan();
DROP TRIGGER IF EXISTS gamify_after_tx ON public.transactions;
CREATE TRIGGER gamify_after_tx AFTER INSERT ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.trg_gamify_tx();

-- Backfill past activity in date order
DO $$ DECLARE r record; BEGIN
  FOR r IN
    SELECT uid, d FROM (
      SELECT customer_id uid, (coalesce(scan_date,created_at) AT TIME ZONE 'America/Chicago')::date d FROM qr_scans WHERE customer_id IS NOT NULL AND coalesce(reversed,false)=false
      UNION SELECT customer_id, (coalesce(transaction_date,created_at) AT TIME ZONE 'America/Chicago')::date FROM transactions WHERE customer_id IS NOT NULL
    ) x ORDER BY d
  LOOP PERFORM public.record_member_activity(r.uid, r.d); END LOOP;
  PERFORM public.refresh_weekly_leaderboard();
END $$;
