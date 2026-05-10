-- Remove duplicate test rows (no stripe_subscription_id, same user_id)
DELETE FROM public.corporate_subscriptions
WHERE id IN (
  '1ba8138a-0cfc-4c32-8845-076d9e00520c',
  'ef301367-d71e-4400-ad15-36657dedc355',
  'a9bd5592-c23e-46fb-ba18-c95cea48a53e'
);

ALTER TABLE public.corporate_subscriptions
  DROP CONSTRAINT IF EXISTS corporate_subscriptions_tier_check;

ALTER TABLE public.corporate_subscriptions
  ADD CONSTRAINT corporate_subscriptions_tier_check
  CHECK (tier = ANY (ARRAY['founding'::text, 'bronze'::text, 'silver'::text, 'gold'::text, 'platinum'::text]));

CREATE UNIQUE INDEX IF NOT EXISTS corporate_subscriptions_user_id_key
  ON public.corporate_subscriptions(user_id);