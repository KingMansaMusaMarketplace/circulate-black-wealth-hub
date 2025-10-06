-- Create table to track automated review requests
CREATE TABLE IF NOT EXISTS public.review_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL,
  customer_email TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  review_submitted BOOLEAN DEFAULT false,
  review_submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Business owners can view their review requests"
  ON public.review_requests FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = review_requests.business_id
    )
  );

CREATE POLICY "System can insert review requests"
  ON public.review_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update review requests"
  ON public.review_requests FOR UPDATE
  USING (true);

-- Index for performance
CREATE INDEX idx_review_requests_booking_id ON public.review_requests(booking_id);
CREATE INDEX idx_review_requests_business_id ON public.review_requests(business_id);
CREATE INDEX idx_review_requests_sent_at ON public.review_requests(sent_at);

-- Function to automatically send review request after booking completion
CREATE OR REPLACE FUNCTION send_review_request_on_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only trigger when status changes to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Check if review request already sent
    IF NOT EXISTS (
      SELECT 1 FROM review_requests WHERE booking_id = NEW.id
    ) THEN
      -- Insert review request record
      INSERT INTO review_requests (
        booking_id,
        business_id,
        customer_id,
        customer_email
      ) VALUES (
        NEW.id,
        NEW.business_id,
        NEW.customer_id,
        NEW.customer_email
      );
      
      -- Call edge function to send email (async, won't block)
      PERFORM net.http_post(
        url := current_setting('app.supabase_url') || '/functions/v1/send-review-request',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
        ),
        body := jsonb_build_object('bookingId', NEW.id)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on bookings table
CREATE TRIGGER trigger_send_review_request
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION send_review_request_on_completion();

-- Function to manually trigger review request (for businesses to resend)
CREATE OR REPLACE FUNCTION manual_send_review_request(p_booking_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_business_id UUID;
  v_result JSONB;
BEGIN
  -- Get business_id from booking
  SELECT business_id INTO v_business_id
  FROM bookings
  WHERE id = p_booking_id;
  
  -- Check if user owns the business
  IF NOT EXISTS (
    SELECT 1 FROM businesses 
    WHERE id = v_business_id AND owner_id = auth.uid()
  ) THEN
    RETURN jsonb_build_object('error', 'Access denied');
  END IF;
  
  -- Call edge function
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/send-review-request',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
    ),
    body := jsonb_build_object('bookingId', p_booking_id)
  ) INTO v_result;
  
  RETURN jsonb_build_object('success', true, 'result', v_result);
END;
$$;