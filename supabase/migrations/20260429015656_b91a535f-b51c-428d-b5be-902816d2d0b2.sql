-- Fix broken trigger: profiles has no `role` column (roles are in user_roles)
CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF OLD.user_type IS DISTINCT FROM NEW.user_type THEN
    RAISE EXCEPTION 'You are not allowed to change your user_type';
  END IF;

  RETURN NEW;
END;
$function$;

-- The 100 paid Founding Member slots
CREATE TABLE public.founding_member_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  slot_number INT NOT NULL UNIQUE CHECK (slot_number BETWEEN 1 AND 100),
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  locked_price_cents INT NOT NULL DEFAULT 14900,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.founding_member_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read founding slots"
  ON public.founding_member_slots FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.claim_founding_slot(
  _user_id UUID,
  _business_id UUID,
  _stripe_subscription_id TEXT,
  _stripe_customer_id TEXT
) RETURNS INT
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
    UPDATE public.businesses
      SET is_founding_member = true,
          founding_order = next_slot,
          founding_joined_at = now()
      WHERE id = _business_id;
  END IF;

  RETURN next_slot;
END;
$$;

-- Cleanup stale free-period flags
UPDATE public.profiles
   SET is_founding_member = false,
       founding_member_since = NULL
 WHERE id NOT IN (SELECT user_id FROM public.founding_member_slots);