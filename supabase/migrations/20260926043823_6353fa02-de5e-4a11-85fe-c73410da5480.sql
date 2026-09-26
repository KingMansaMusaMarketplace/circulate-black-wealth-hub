CREATE OR REPLACE FUNCTION public.run_data_retention_cleanup()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE c_chat int; c_log int; c_evt int;
BEGIN
  DELETE FROM public.ai_chat_sessions
   WHERE coalesce(updated_at, created_at) < now() - interval '12 months';
  GET DIAGNOSTICS c_chat = ROW_COUNT;

  DELETE FROM public.email_send_log
   WHERE created_at < now() - interval '24 months'
     AND coalesce(lower(status),'') NOT IN ('bounced','complained','unsubscribed','suppressed');
  GET DIAGNOSTICS c_log = ROW_COUNT;

  DELETE FROM public.email_events
   WHERE created_at < now() - interval '24 months'
     AND lower(coalesce(event_type,'')) NOT SIMILAR TO '%(bounce|complain|unsubscrib|suppress)%';
  GET DIAGNOSTICS c_evt = ROW_COUNT;

  RETURN jsonb_build_object('chats', c_chat, 'email_send_log', c_log, 'email_events', c_evt, 'ran_at', now());
END;
$$;
REVOKE ALL ON FUNCTION public.run_data_retention_cleanup() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.run_data_retention_cleanup() TO service_role;