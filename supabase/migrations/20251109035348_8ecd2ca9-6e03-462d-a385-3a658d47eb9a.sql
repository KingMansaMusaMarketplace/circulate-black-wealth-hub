-- Create commission tracking table
CREATE TABLE IF NOT EXISTS public.commission_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  transaction_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 7.5,
  commission_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL, -- Stripe fees
  net_commission DECIMAL(10,2) NOT NULL, -- What platform actually keeps
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processed, failed
  transaction_type VARCHAR(50) NOT NULL, -- booking, qr_scan, purchase
  processed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.commission_transactions ENABLE ROW LEVEL SECURITY;

-- Admin can see all commissions
CREATE POLICY "Admins can view all commissions"
  ON public.commission_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Business owners can see their own commissions
CREATE POLICY "Business owners can view their commissions"
  ON public.commission_transactions
  FOR SELECT
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM public.businesses
      WHERE owner_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_commission_transactions_business ON public.commission_transactions(business_id);
CREATE INDEX idx_commission_transactions_status ON public.commission_transactions(status);
CREATE INDEX idx_commission_transactions_created ON public.commission_transactions(created_at DESC);
CREATE INDEX idx_commission_transactions_booking ON public.commission_transactions(booking_id);

-- Function to calculate commission
CREATE OR REPLACE FUNCTION public.calculate_commission(
  p_amount DECIMAL,
  p_commission_rate DECIMAL DEFAULT 7.5
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_stripe_fee DECIMAL;
  v_commission_amount DECIMAL;
  v_net_commission DECIMAL;
  v_business_receives DECIMAL;
BEGIN
  -- Calculate Stripe fee (2.9% + $0.30)
  v_stripe_fee := (p_amount * 0.029) + 0.30;
  
  -- Calculate commission (7.5% of original amount)
  v_commission_amount := p_amount * (p_commission_rate / 100);
  
  -- Net commission (commission minus our portion of Stripe fee)
  v_net_commission := v_commission_amount - (v_stripe_fee * (p_commission_rate / 100));
  
  -- What business receives (amount - commission - stripe fee)
  v_business_receives := p_amount - v_commission_amount - v_stripe_fee;
  
  RETURN jsonb_build_object(
    'original_amount', p_amount,
    'commission_rate', p_commission_rate,
    'commission_amount', ROUND(v_commission_amount, 2),
    'stripe_fee', ROUND(v_stripe_fee, 2),
    'net_commission', ROUND(v_net_commission, 2),
    'business_receives', ROUND(v_business_receives, 2)
  );
END;
$$;

-- Function to record commission on transaction
CREATE OR REPLACE FUNCTION public.record_commission(
  p_transaction_id UUID,
  p_booking_id UUID,
  p_business_id UUID,
  p_amount DECIMAL,
  p_transaction_type VARCHAR DEFAULT 'booking'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_commission_id UUID;
  v_commission_calc JSONB;
BEGIN
  -- Calculate commission breakdown
  v_commission_calc := public.calculate_commission(p_amount, 7.5);
  
  -- Insert commission record
  INSERT INTO public.commission_transactions (
    transaction_id,
    booking_id,
    business_id,
    transaction_amount,
    commission_rate,
    commission_amount,
    platform_fee,
    net_commission,
    transaction_type,
    status
  ) VALUES (
    p_transaction_id,
    p_booking_id,
    p_business_id,
    p_amount,
    7.5,
    (v_commission_calc->>'commission_amount')::DECIMAL,
    (v_commission_calc->>'stripe_fee')::DECIMAL,
    (v_commission_calc->>'net_commission')::DECIMAL,
    p_transaction_type,
    'pending'
  ) RETURNING id INTO v_commission_id;
  
  RETURN v_commission_id;
END;
$$;

-- Function to get platform commission summary
CREATE OR REPLACE FUNCTION public.get_platform_commission_summary(
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Only admins can access this
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Default to last 30 days if no dates provided
  IF p_start_date IS NULL THEN
    p_start_date := now() - INTERVAL '30 days';
  END IF;
  
  IF p_end_date IS NULL THEN
    p_end_date := now();
  END IF;
  
  SELECT jsonb_build_object(
    'total_transaction_volume', COALESCE(SUM(transaction_amount), 0),
    'total_commission_earned', COALESCE(SUM(commission_amount), 0),
    'total_platform_fees_paid', COALESCE(SUM(platform_fee), 0),
    'net_commission', COALESCE(SUM(net_commission), 0),
    'total_transactions', COUNT(*),
    'avg_transaction_amount', COALESCE(AVG(transaction_amount), 0),
    'avg_commission_amount', COALESCE(AVG(commission_amount), 0),
    'by_type', (
      SELECT jsonb_object_agg(
        transaction_type,
        jsonb_build_object(
          'count', count,
          'volume', volume,
          'commission', commission
        )
      )
      FROM (
        SELECT 
          transaction_type,
          COUNT(*)::INTEGER as count,
          COALESCE(SUM(transaction_amount), 0) as volume,
          COALESCE(SUM(commission_amount), 0) as commission
        FROM commission_transactions
        WHERE created_at BETWEEN p_start_date AND p_end_date
        GROUP BY transaction_type
      ) t
    ),
    'start_date', p_start_date,
    'end_date', p_end_date
  ) INTO v_result
  FROM commission_transactions
  WHERE created_at BETWEEN p_start_date AND p_end_date;
  
  RETURN v_result;
END;
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_commission_transactions_updated_at
  BEFORE UPDATE ON public.commission_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT SELECT ON public.commission_transactions TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_commission TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_commission TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_platform_commission_summary TO authenticated;