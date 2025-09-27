-- Fix the last function missing search_path configuration

-- Update the update_notification_preferences_updated_at function to include search_path
CREATE OR REPLACE FUNCTION public.update_notification_preferences_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;