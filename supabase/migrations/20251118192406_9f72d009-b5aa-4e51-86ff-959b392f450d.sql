-- Fix security warning: Set search_path for the trigger function
DROP FUNCTION IF EXISTS public.update_apple_subscriptions_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_apple_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Recreate trigger
DROP TRIGGER IF EXISTS update_apple_subscriptions_updated_at ON public.apple_subscriptions;

CREATE TRIGGER update_apple_subscriptions_updated_at
BEFORE UPDATE ON public.apple_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_apple_subscriptions_updated_at();