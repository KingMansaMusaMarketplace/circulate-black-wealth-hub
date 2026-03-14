-- Create a function that sends a Slack alert when signup failures are logged
CREATE OR REPLACE FUNCTION public.notify_signup_failure()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.action IN ('signup_failure', 'signup_trigger_fallback') THEN
    PERFORM net.http_post(
      url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_url' LIMIT 1) || '/functions/v1/send-slack-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1)
      ),
      body := jsonb_build_object(
        'channel', 'C0AJB2V8F4G',
        'text', '🚨 *SIGNUP FAILURE DETECTED*' || chr(10) ||
                '• Action: ' || NEW.action || chr(10) ||
                '• Details: ' || COALESCE(NEW.user_agent, 'N/A') || chr(10) ||
                '• Time: ' || NEW.created_at::text || chr(10) ||
                chr(10) || '⚡ Check the signup flow immediately!'
      )
    );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'notify_signup_failure failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_signup_failure ON public.security_audit_log;
CREATE TRIGGER trg_notify_signup_failure
  AFTER INSERT ON public.security_audit_log
  FOR EACH ROW
  WHEN (NEW.action IN ('signup_failure', 'signup_trigger_fallback'))
  EXECUTE FUNCTION public.notify_signup_failure();