-- Create secure server-side function to award review points
-- This prevents client-side manipulation of points
CREATE OR REPLACE FUNCTION public.award_review_points_secure(
  p_customer_id uuid,
  p_business_id uuid,
  p_review_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_points_awarded integer := 25;
  v_existing_points integer := 0;
  v_result jsonb;
BEGIN
  -- Validate UUIDs
  IF NOT validate_uuid_input(p_customer_id) OR 
     NOT validate_uuid_input(p_business_id) OR 
     NOT validate_uuid_input(p_review_id) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid input parameters'
    );
  END IF;

  -- Verify the review exists and belongs to this customer
  IF NOT EXISTS (
    SELECT 1 FROM reviews 
    WHERE id = p_review_id 
    AND customer_id = p_customer_id 
    AND business_id = p_business_id
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Review not found or unauthorized'
    );
  END IF;

  -- Check if points were already awarded for this review
  IF EXISTS (
    SELECT 1 FROM transactions 
    WHERE customer_id = p_customer_id 
    AND business_id = p_business_id 
    AND transaction_type = 'review'
    AND metadata->>'review_id' = p_review_id::text
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Points already awarded for this review'
    );
  END IF;

  -- Award points in transaction table
  INSERT INTO transactions (
    customer_id,
    business_id,
    points_earned,
    description,
    transaction_type,
    metadata
  ) VALUES (
    p_customer_id,
    p_business_id,
    v_points_awarded,
    'Points for submitting a review',
    'review',
    jsonb_build_object('review_id', p_review_id)
  );

  -- Update loyalty points
  SELECT COALESCE(points, 0) INTO v_existing_points
  FROM loyalty_points
  WHERE customer_id = p_customer_id
  AND business_id = p_business_id;

  IF v_existing_points > 0 THEN
    -- Update existing points
    UPDATE loyalty_points
    SET 
      points = points + v_points_awarded,
      updated_at = now()
    WHERE customer_id = p_customer_id
    AND business_id = p_business_id;
  ELSE
    -- Create new loyalty points entry
    INSERT INTO loyalty_points (
      customer_id,
      business_id,
      points
    ) VALUES (
      p_customer_id,
      p_business_id,
      v_points_awarded
    );
  END IF;

  -- Log the activity
  INSERT INTO activity_log (
    user_id,
    business_id,
    activity_type,
    activity_data,
    points_involved
  ) VALUES (
    p_customer_id,
    p_business_id,
    'review_points_awarded',
    jsonb_build_object('review_id', p_review_id),
    v_points_awarded
  );

  v_result := jsonb_build_object(
    'success', true,
    'points_awarded', v_points_awarded,
    'total_points', v_existing_points + v_points_awarded
  );

  RETURN v_result;
END;
$$;