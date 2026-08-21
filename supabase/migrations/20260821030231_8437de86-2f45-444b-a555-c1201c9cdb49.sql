DO $$
DECLARE
  v_user uuid := '828af3f0-42d4-45a2-b543-e776b0bc32ff';
  r RECORD;
  v_qr uuid;
  v_pts int;
  i int := 0;
BEGIN
  FOR r IN SELECT id, business_name FROM public.businesses WHERE id IN (
      'f2751beb-d2f7-4990-93b4-606caaeaf1d5',
      'a0701cb7-36a6-466f-9b23-8eb8ef5da34a',
      'cedf2214-00a2-4176-acba-9efad90fe9ce')
  LOOP
    i := i + 1;
    v_pts := 50 * i;
    INSERT INTO public.qr_codes (business_id, code_type, discount_percentage, points_value, is_active, scan_limit, current_scans)
    VALUES (r.id, 'loyalty', 10, v_pts, true, 1000, 1)
    RETURNING id INTO v_qr;

    INSERT INTO public.qr_scans (qr_code_id, customer_id, business_id, points_awarded, discount_applied, scan_date)
    VALUES (v_qr, v_user, r.id, v_pts, 10, now() - (i || ' days')::interval);

    INSERT INTO public.loyalty_points (customer_id, business_id, points)
    VALUES (v_user, r.id, v_pts)
    ON CONFLICT (customer_id, business_id) DO UPDATE SET points = EXCLUDED.points;
  END LOOP;
END $$;