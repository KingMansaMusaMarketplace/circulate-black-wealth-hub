-- Add wallet_balance column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00;

-- Create wallet_transactions table for complete audit trail
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
  source TEXT NOT NULL CHECK (source IN ('susu_payout', 'refund', 'purchase', 'withdrawal', 'manual_adjustment', 'reward')),
  reference_id UUID NULL,
  reference_type TEXT NULL,
  description TEXT,
  balance_before DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for efficient queries
CREATE INDEX idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_created_at ON public.wallet_transactions(created_at DESC);
CREATE INDEX idx_wallet_transactions_source ON public.wallet_transactions(source);

-- Enable RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only view their own wallet transactions
CREATE POLICY "Users can view own wallet transactions"
ON public.wallet_transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Only system (via service role) can insert wallet transactions
CREATE POLICY "Service role can insert wallet transactions"
ON public.wallet_transactions
FOR INSERT
WITH CHECK (true);

-- Create function to safely credit wallet (prevents race conditions)
CREATE OR REPLACE FUNCTION public.credit_wallet(
  p_user_id UUID,
  p_amount DECIMAL,
  p_source TEXT,
  p_description TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance_before DECIMAL;
  v_balance_after DECIMAL;
  v_transaction_id UUID;
BEGIN
  -- Lock the profile row to prevent race conditions
  SELECT wallet_balance INTO v_balance_before
  FROM profiles
  WHERE id = p_user_id
  FOR UPDATE;
  
  IF v_balance_before IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  v_balance_after := v_balance_before + p_amount;
  
  -- Update the wallet balance
  UPDATE profiles
  SET wallet_balance = v_balance_after
  WHERE id = p_user_id;
  
  -- Insert transaction record
  INSERT INTO wallet_transactions (
    user_id, amount, transaction_type, source, 
    reference_id, reference_type, description,
    balance_before, balance_after
  ) VALUES (
    p_user_id, p_amount, 'credit', p_source,
    p_reference_id, p_reference_type, p_description,
    v_balance_before, v_balance_after
  )
  RETURNING id INTO v_transaction_id;
  
  RETURN v_transaction_id;
END;
$$;

-- Create function to safely debit wallet
CREATE OR REPLACE FUNCTION public.debit_wallet(
  p_user_id UUID,
  p_amount DECIMAL,
  p_source TEXT,
  p_description TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance_before DECIMAL;
  v_balance_after DECIMAL;
  v_transaction_id UUID;
BEGIN
  -- Lock the profile row to prevent race conditions
  SELECT wallet_balance INTO v_balance_before
  FROM profiles
  WHERE id = p_user_id
  FOR UPDATE;
  
  IF v_balance_before IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  IF v_balance_before < p_amount THEN
    RAISE EXCEPTION 'Insufficient wallet balance';
  END IF;
  
  v_balance_after := v_balance_before - p_amount;
  
  -- Update the wallet balance
  UPDATE profiles
  SET wallet_balance = v_balance_after
  WHERE id = p_user_id;
  
  -- Insert transaction record
  INSERT INTO wallet_transactions (
    user_id, amount, transaction_type, source, 
    reference_id, reference_type, description,
    balance_before, balance_after
  ) VALUES (
    p_user_id, p_amount, 'debit', p_source,
    p_reference_id, p_reference_type, p_description,
    v_balance_before, v_balance_after
  )
  RETURNING id INTO v_transaction_id;
  
  RETURN v_transaction_id;
END;
$$;