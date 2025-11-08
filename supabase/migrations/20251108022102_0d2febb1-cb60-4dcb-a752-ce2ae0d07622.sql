-- Create payment_batches table to track monthly payout runs
CREATE TABLE IF NOT EXISTS public.payment_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number VARCHAR(50) NOT NULL UNIQUE,
  payment_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_commissions INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create commission_payments table to track individual payments
CREATE TABLE IF NOT EXISTS public.commission_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.payment_batches(id) ON DELETE SET NULL,
  commission_id UUID REFERENCES public.agent_commissions(id),
  sales_agent_id UUID NOT NULL REFERENCES public.sales_agents(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'stripe',
  stripe_payout_id VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_batches
CREATE POLICY "Admins can manage payment batches"
  ON public.payment_batches
  FOR ALL
  USING (public.is_admin_secure());

-- RLS Policies for commission_payments
CREATE POLICY "Admins can manage commission payments"
  ON public.commission_payments
  FOR ALL
  USING (public.is_admin_secure());

CREATE POLICY "Agents can view their own payments"
  ON public.commission_payments
  FOR SELECT
  USING (
    sales_agent_id IN (
      SELECT id FROM public.sales_agents WHERE user_id = auth.uid()
    )
  );

-- Function to generate batch number
CREATE OR REPLACE FUNCTION public.generate_batch_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  batch_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(batch_number FROM 6) AS INTEGER)), 0) + 1
  INTO next_number
  FROM payment_batches
  WHERE batch_number LIKE 'BATCH-%';
  
  batch_num := 'BATCH-' || LPAD(next_number::TEXT, 6, '0');
  RETURN batch_num;
END;
$$;

-- Function to process commission payments
CREATE OR REPLACE FUNCTION public.process_commission_payment(
  p_commission_id UUID,
  p_batch_id UUID DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_commission RECORD;
  v_payment_id UUID;
  v_result jsonb;
BEGIN
  -- Only admins can process payments
  IF NOT public.is_admin_secure() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Access denied');
  END IF;

  -- Get commission details
  SELECT * INTO v_commission
  FROM agent_commissions
  WHERE id = p_commission_id AND status = 'approved';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Commission not found or not approved');
  END IF;

  -- Create payment record
  INSERT INTO commission_payments (
    batch_id,
    commission_id,
    sales_agent_id,
    amount,
    status
  ) VALUES (
    p_batch_id,
    p_commission_id,
    v_commission.sales_agent_id,
    v_commission.amount,
    'pending'
  ) RETURNING id INTO v_payment_id;

  -- Update commission status
  UPDATE agent_commissions
  SET 
    status = 'paid',
    paid_date = now()
  WHERE id = p_commission_id;

  v_result := jsonb_build_object(
    'success', true,
    'payment_id', v_payment_id,
    'amount', v_commission.amount
  );

  RETURN v_result;
END;
$$;

-- Indexes for performance
CREATE INDEX idx_payment_batches_status ON public.payment_batches(status);
CREATE INDEX idx_payment_batches_date ON public.payment_batches(payment_date);
CREATE INDEX idx_commission_payments_agent ON public.commission_payments(sales_agent_id);
CREATE INDEX idx_commission_payments_batch ON public.commission_payments(batch_id);
CREATE INDEX idx_commission_payments_status ON public.commission_payments(status);

-- Triggers for updated_at
CREATE TRIGGER update_payment_batches_updated_at
  BEFORE UPDATE ON public.payment_batches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commission_payments_updated_at
  BEFORE UPDATE ON public.commission_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();