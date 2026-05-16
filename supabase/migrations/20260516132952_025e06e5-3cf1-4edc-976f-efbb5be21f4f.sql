DO $$
DECLARE
  v_user_id uuid; v_driver_id uuid; v_ride_id uuid; v_dispute_id uuid;
  v_pricing record; v_ride record;
  v_fare numeric; v_fee numeric; v_payout numeric;
BEGIN
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  RAISE NOTICE '%', '[0] auth user: ' || v_user_id;

  SELECT * INTO v_pricing FROM public.noire_pricing_config WHERE is_active=true LIMIT 1;
  IF v_pricing IS NULL THEN RAISE EXCEPTION '[1] no active pricing'; END IF;
  RAISE NOTICE '%', '[1] OK pricing base=' || v_pricing.base_fare || ' mile=' || v_pricing.per_mile_rate || ' min=' || v_pricing.per_minute_rate || ' fee_pct=' || v_pricing.platform_fee_pct;

  INSERT INTO public.noir_drivers(user_id,full_name,phone,email,vehicle_make,vehicle_model,vehicle_year,vehicle_color,license_plate,is_active,is_approved,is_online,current_lat,current_lng)
  VALUES (v_user_id,'Noire E2E Driver','+13125551234','noire-e2e@mansatest.local','Tesla','Model 3',2024,'Black','E2E-TEST',true,true,true,41.8781,-87.6298)
  RETURNING id INTO v_driver_id;
  RAISE NOTICE '%', '[2] OK driver=' || v_driver_id;

  v_fare := v_pricing.base_fare + (5.0*v_pricing.per_mile_rate) + (15*v_pricing.per_minute_rate);
  v_fare := GREATEST(v_fare*v_pricing.surge_multiplier, v_pricing.minimum_fare);
  v_fee  := round(v_fare*v_pricing.platform_fee_pct/100.0, 2);
  v_payout := round(v_fare - v_fee, 2);

  INSERT INTO public.noir_rides(rider_user_id,pickup_address,pickup_lat,pickup_lng,dropoff_address,dropoff_lat,dropoff_lng,estimated_distance_miles,estimated_duration_minutes,estimated_fare,status)
  VALUES (v_user_id,'123 Main St',41.8781,-87.6298,'State & Lake',41.8858,-87.6280,5.0,15,v_fare,'requested')
  RETURNING id INTO v_ride_id;
  RAISE NOTICE '%', '[3] OK ride=' || v_ride_id || ' est_fare=' || v_fare;

  UPDATE public.noir_rides SET driver_id=v_driver_id,status='accepted',accepted_at=now() WHERE id=v_ride_id;
  SELECT * INTO v_ride FROM public.noir_rides WHERE id=v_ride_id;
  IF v_ride.status<>'accepted' OR v_ride.driver_id<>v_driver_id THEN RAISE EXCEPTION '[4] accept failed'; END IF;
  RAISE NOTICE '%', '[4] OK accepted';

  UPDATE public.noir_rides SET status='completed',pickup_at=now()-interval '15 min',dropoff_at=now(),actual_fare=v_fare,platform_fee=v_fee,driver_payout=v_payout WHERE id=v_ride_id;
  SELECT * INTO v_ride FROM public.noir_rides WHERE id=v_ride_id;
  IF abs((v_ride.platform_fee+v_ride.driver_payout)-v_ride.actual_fare) > 0.05 THEN RAISE EXCEPTION '[5] fare math wrong'; END IF;
  RAISE NOTICE '%', '[5] OK fare=' || v_ride.actual_fare || ' = fee=' || v_ride.platform_fee || ' + payout=' || v_ride.driver_payout;

  INSERT INTO public.noire_ride_disputes(ride_id,filed_by,reason,description,status)
  VALUES (v_ride_id,v_user_id,'overcharge','E2E test dispute','pending') RETURNING id INTO v_dispute_id;
  UPDATE public.noir_rides SET refund_amount=5.00,refund_status='processed',refund_id='re_e2e_test',refunded_at=now(),refund_reason='E2E test refund' WHERE id=v_ride_id;
  RAISE NOTICE '%', '[6] OK dispute=' || v_dispute_id;

  DELETE FROM public.noire_ride_disputes WHERE id=v_dispute_id;
  DELETE FROM public.noir_rides WHERE id=v_ride_id;
  DELETE FROM public.noir_drivers WHERE id=v_driver_id;
  RAISE NOTICE '%', '[7] OK cleanup done';
  RAISE NOTICE '=== NOIRE RIDESHARE E2E: ALL 7 STEPS PASSED ===';
EXCEPTION WHEN OTHERS THEN
  IF v_dispute_id IS NOT NULL THEN DELETE FROM public.noire_ride_disputes WHERE id=v_dispute_id; END IF;
  IF v_ride_id IS NOT NULL THEN DELETE FROM public.noir_rides WHERE id=v_ride_id; END IF;
  IF v_driver_id IS NOT NULL THEN DELETE FROM public.noir_drivers WHERE id=v_driver_id; END IF;
  RAISE;
END $$;