
-- Create a function that sends a Slack notification when a new business is created
CREATE OR REPLACE FUNCTION public.notify_new_business_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', 'new_business',
    'data', jsonb_build_object(
      'business_name', NEW.name,
      'category', NEW.category,
      'city', NEW.city,
      'state', NEW.state,
      'owner_name', COALESCE(NEW.owner_name, 'N/A')
    )
  );

  -- Use pg_net to call the edge function asynchronously
  PERFORM net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_url' LIMIT 1) || '/functions/v1/send-slack-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1)
    ),
    body := payload
  );

  RETURN NEW;
END;
$$;

-- Create trigger on businesses table for new inserts
DROP TRIGGER IF EXISTS trigger_new_business_slack_notification ON public.businesses;
CREATE TRIGGER trigger_new_business_slack_notification
  AFTER INSERT ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_business_signup();
