-- Fix RLS policy to be more restrictive - only allow inserts via the credit_wallet/debit_wallet functions
DROP POLICY IF EXISTS "Service role can insert wallet transactions" ON public.wallet_transactions;

-- No direct INSERT policy needed - the SECURITY DEFINER functions handle inserts
-- This ensures wallet transactions can ONLY be created via the secure functions