-- Create withdrawal_requests table for cash-out functionality
CREATE TABLE public.withdrawal_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing', 'completed', 'failed')),
  
  -- Payment details (user provides)
  payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer', 'paypal', 'venmo', 'zelle', 'cash_app')),
  payment_details JSONB NOT NULL DEFAULT '{}',
  
  -- Processing info
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Notes and tracking
  user_notes TEXT,
  admin_notes TEXT,
  rejection_reason TEXT,
  transaction_reference TEXT,
  
  -- Fee tracking
  platform_fee DECIMAL(12,2) DEFAULT 0,
  net_amount DECIMAL(12,2),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_withdrawal_requests_user_id ON public.withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON public.withdrawal_requests(status);
CREATE INDEX idx_withdrawal_requests_requested_at ON public.withdrawal_requests(requested_at DESC);

-- Enable RLS
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view own withdrawal requests"
ON public.withdrawal_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own requests
CREATE POLICY "Users can create withdrawal requests"
ON public.withdrawal_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all requests (check user_type from profiles)
CREATE POLICY "Admins can view all withdrawal requests"
ON public.withdrawal_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_type = 'admin'
  )
);

-- Admins can update requests
CREATE POLICY "Admins can update withdrawal requests"
ON public.withdrawal_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_type = 'admin'
  )
);

-- Create function to process approved withdrawal (debits wallet)
CREATE OR REPLACE FUNCTION public.process_withdrawal(
  p_request_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request RECORD;
  v_wallet_balance DECIMAL;
BEGIN
  -- Get request details
  SELECT * INTO v_request
  FROM withdrawal_requests
  WHERE id = p_request_id
  FOR UPDATE;
  
  IF v_request IS NULL THEN
    RAISE EXCEPTION 'Withdrawal request not found';
  END IF;
  
  IF v_request.status != 'approved' THEN
    RAISE EXCEPTION 'Request must be approved before processing';
  END IF;
  
  -- Check wallet balance
  SELECT wallet_balance INTO v_wallet_balance
  FROM profiles
  WHERE id = v_request.user_id
  FOR UPDATE;
  
  IF v_wallet_balance < v_request.amount THEN
    -- Update request to failed
    UPDATE withdrawal_requests
    SET status = 'failed',
        admin_notes = COALESCE(admin_notes, '') || ' | Failed: Insufficient balance',
        updated_at = now()
    WHERE id = p_request_id;
    
    RETURN FALSE;
  END IF;
  
  -- Debit wallet
  PERFORM debit_wallet(
    v_request.user_id,
    v_request.amount,
    'withdrawal',
    'Cash-out withdrawal',
    p_request_id,
    'withdrawal_request'
  );
  
  -- Update request to processing
  UPDATE withdrawal_requests
  SET status = 'processing',
      processed_at = now(),
      updated_at = now()
  WHERE id = p_request_id;
  
  RETURN TRUE;
END;
$$;

-- Create function to complete withdrawal
CREATE OR REPLACE FUNCTION public.complete_withdrawal(
  p_request_id UUID,
  p_transaction_reference TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE withdrawal_requests
  SET status = 'completed',
      completed_at = now(),
      transaction_reference = COALESCE(p_transaction_reference, transaction_reference),
      updated_at = now()
  WHERE id = p_request_id
  AND status = 'processing';
  
  RETURN FOUND;
END;
$$;