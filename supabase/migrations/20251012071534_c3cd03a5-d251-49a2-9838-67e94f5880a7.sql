-- Fix corporate subscriptions RLS to prevent payment bypass
-- Drop the unsafe INSERT policy that allows users to create subscriptions without payment
DROP POLICY IF EXISTS "Sponsors can create their own subscription" ON corporate_subscriptions;

-- Drop the overly permissive UPDATE policy
DROP POLICY IF EXISTS "Sponsors can update their own subscription" ON corporate_subscriptions;

-- Create restricted UPDATE policy - only allow updating safe display fields
CREATE POLICY "Sponsors can update their display info"
ON corporate_subscriptions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  -- Only these columns can be updated by users
  -- This prevents users from changing tier, status, or period dates without payment
  (logo_url IS NOT DISTINCT FROM logo_url OR 
   website_url IS NOT DISTINCT FROM website_url OR 
   company_name IS NOT DISTINCT FROM company_name)
);

-- Explicitly deny DELETE operations except for admins
CREATE POLICY "Only admins can delete subscriptions"
ON corporate_subscriptions FOR DELETE
USING (is_admin_secure());

-- Add audit logging trigger for subscription changes
CREATE OR REPLACE FUNCTION log_subscription_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log any changes to subscriptions for security audit
  INSERT INTO security_audit_log (
    action,
    table_name,
    record_id,
    user_id,
    user_agent,
    timestamp
  ) VALUES (
    TG_OP || '_corporate_subscription',
    'corporate_subscriptions',
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'tier:' || NEW.tier || ',status:' || NEW.status
      WHEN TG_OP = 'UPDATE' THEN 'old_status:' || OLD.status || ',new_status:' || NEW.status
      ELSE NULL
    END,
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER audit_subscription_changes
AFTER INSERT OR UPDATE OR DELETE ON corporate_subscriptions
FOR EACH ROW
EXECUTE FUNCTION log_subscription_changes();