CREATE OR REPLACE FUNCTION public.protect_businesses_admin_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin_secure() THEN RETURN NEW; END IF;
  IF current_setting('app.trusted_founding_claim', true) = 'on' THEN RETURN NEW; END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified
     OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.founding_order IS DISTINCT FROM OLD.founding_order THEN
    RAISE EXCEPTION 'Only admins can modify verification, subscription, or founding fields';
  END IF;
  RETURN NEW;
END
$$;

CREATE OR REPLACE FUNCTION public.claim_founding_slot(
  _user_id uuid,
  _business_id uuid,
  _stripe_subscription_id text,
  _stripe_customer_id text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_slot INT;
BEGIN
  SELECT slot_number INTO next_slot
    FROM public.founding_member_slots
    WHERE stripe_subscription_id = _stripe_subscription_id;
  IF next_slot IS NOT NULL THEN
    RETURN next_slot;
  END IF;

  SELECT COALESCE(MAX(slot_number), 0) + 1 INTO next_slot
    FROM public.founding_member_slots;

  IF next_slot > 100 THEN
    RAISE EXCEPTION 'FOUNDING_SLOTS_FULL';
  END IF;

  INSERT INTO public.founding_member_slots
    (user_id, business_id, slot_number, stripe_subscription_id, stripe_customer_id)
  VALUES (_user_id, _business_id, next_slot, _stripe_subscription_id, _stripe_customer_id);

  UPDATE public.profiles
    SET is_founding_member = true, founding_member_since = now()
    WHERE id = _user_id;

  IF _business_id IS NOT NULL THEN
    PERFORM set_config('app.trusted_founding_claim', 'on', true);
    UPDATE public.businesses
      SET is_founding_member = true,
          founding_order = next_slot,
          founding_joined_at = now()
      WHERE id = _business_id;
    PERFORM set_config('app.trusted_founding_claim', 'off', true);
  END IF;

  RETURN next_slot;
END
$$;

REVOKE ALL ON FUNCTION public.claim_founding_slot(uuid, uuid, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_founding_slot(uuid, uuid, text, text) TO service_role;

SELECT public.claim_founding_slot(
  'bd72a75e-1310-4f40-9c74-380443b09d9b'::uuid,
  'f2751beb-d2f7-4990-93b4-606caaeaf1d5'::uuid,
  'sub_1U5apmAsptTW1mCmrrIlyPEb',
  'cus_TwWntsjpSQfkIi'
);