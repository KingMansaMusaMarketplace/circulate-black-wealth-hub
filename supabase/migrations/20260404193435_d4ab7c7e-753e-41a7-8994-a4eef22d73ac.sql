
-- 1. Trigger to protect sensitive corporate_subscriptions fields
CREATE OR REPLACE FUNCTION public.protect_corporate_subscription_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin_secure() THEN
    RETURN NEW;
  END IF;

  IF NEW.approval_status IS DISTINCT FROM OLD.approval_status THEN
    RAISE EXCEPTION 'Cannot modify approval_status';
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Cannot modify status';
  END IF;
  IF NEW.tier IS DISTINCT FROM OLD.tier THEN
    RAISE EXCEPTION 'Cannot modify tier';
  END IF;
  IF NEW.is_founding_sponsor IS DISTINCT FROM OLD.is_founding_sponsor THEN
    RAISE EXCEPTION 'Cannot modify is_founding_sponsor';
  END IF;
  IF NEW.stripe_subscription_id IS DISTINCT FROM OLD.stripe_subscription_id THEN
    RAISE EXCEPTION 'Cannot modify stripe_subscription_id';
  END IF;
  IF NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id THEN
    RAISE EXCEPTION 'Cannot modify stripe_customer_id';
  END IF;
  IF NEW.is_visible IS DISTINCT FROM OLD.is_visible THEN
    RAISE EXCEPTION 'Cannot modify is_visible';
  END IF;
  IF NEW.logo_approved IS DISTINCT FROM OLD.logo_approved THEN
    RAISE EXCEPTION 'Cannot modify logo_approved';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_corporate_subscription_fields_trigger ON public.corporate_subscriptions;

CREATE TRIGGER protect_corporate_subscription_fields_trigger
  BEFORE UPDATE ON public.corporate_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_corporate_subscription_fields();

-- 2. Fix review eligibility: remove loyalty_points loophole
CREATE OR REPLACE FUNCTION public.has_transacted_with_business(p_customer_id uuid, p_business_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.transactions
    WHERE customer_id = p_customer_id
      AND business_id = p_business_id
  )
  OR EXISTS (
    SELECT 1
    FROM public.bookings
    WHERE customer_id = p_customer_id
      AND business_id = p_business_id
      AND status IN ('completed', 'confirmed')
  );
$$;

-- 3. Fix wishlist item ownership check
DROP POLICY IF EXISTS "Users can add to their own wishlists" ON public.stays_wishlist_items;

CREATE POLICY "Users can add to their own wishlists"
  ON public.stays_wishlist_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND wishlist_id IN (SELECT id FROM stays_wishlists WHERE user_id = auth.uid())
  );
