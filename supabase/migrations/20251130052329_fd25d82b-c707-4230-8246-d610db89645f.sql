-- Add approval workflow fields to corporate_subscriptions
ALTER TABLE corporate_subscriptions 
ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS rejected_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS rejection_reason text,
ADD COLUMN IF NOT EXISTS admin_notes text;

-- Add check constraint for approval_status
ALTER TABLE corporate_subscriptions
DROP CONSTRAINT IF EXISTS corporate_subscriptions_approval_status_check;

ALTER TABLE corporate_subscriptions
ADD CONSTRAINT corporate_subscriptions_approval_status_check 
CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_corporate_subscriptions_approval_status 
ON corporate_subscriptions(approval_status);

-- Update existing subscriptions to approved (legacy data)
UPDATE corporate_subscriptions 
SET approval_status = 'approved', approved_at = created_at
WHERE approval_status = 'pending' AND stripe_subscription_id IS NOT NULL;

-- Create RLS policies for admin management
DROP POLICY IF EXISTS "Admins can manage all corporate subscriptions" ON corporate_subscriptions;
CREATE POLICY "Admins can manage all corporate subscriptions"
ON corporate_subscriptions
FOR ALL
TO authenticated
USING (is_admin_secure())
WITH CHECK (is_admin_secure());

-- Create function to approve corporate subscription
CREATE OR REPLACE FUNCTION approve_corporate_subscription(
  p_subscription_id uuid,
  p_admin_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
  v_subscription RECORD;
BEGIN
  -- Only admins can approve
  IF NOT is_admin_secure() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Admin privileges required'
    );
  END IF;

  -- Get subscription details
  SELECT * INTO v_subscription
  FROM corporate_subscriptions
  WHERE id = p_subscription_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Subscription not found'
    );
  END IF;

  -- Update approval status
  UPDATE corporate_subscriptions
  SET 
    approval_status = 'approved',
    approved_by = auth.uid(),
    approved_at = now(),
    admin_notes = p_admin_notes,
    updated_at = now()
  WHERE id = p_subscription_id;

  v_result := jsonb_build_object(
    'success', true,
    'subscription_id', p_subscription_id,
    'approved_at', now()
  );

  RETURN v_result;
END;
$$;

-- Create function to reject corporate subscription
CREATE OR REPLACE FUNCTION reject_corporate_subscription(
  p_subscription_id uuid,
  p_rejection_reason text,
  p_admin_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Only admins can reject
  IF NOT is_admin_secure() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Admin privileges required'
    );
  END IF;

  IF p_rejection_reason IS NULL OR trim(p_rejection_reason) = '' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Rejection reason is required'
    );
  END IF;

  -- Update rejection status
  UPDATE corporate_subscriptions
  SET 
    approval_status = 'rejected',
    rejected_at = now(),
    rejection_reason = p_rejection_reason,
    admin_notes = p_admin_notes,
    status = 'cancelled',
    updated_at = now()
  WHERE id = p_subscription_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Subscription not found'
    );
  END IF;

  v_result := jsonb_build_object(
    'success', true,
    'subscription_id', p_subscription_id,
    'rejected_at', now()
  );

  RETURN v_result;
END;
$$;