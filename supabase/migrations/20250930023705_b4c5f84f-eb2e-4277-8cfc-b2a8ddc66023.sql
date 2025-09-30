-- Create table for business Stripe Connect accounts
CREATE TABLE IF NOT EXISTS public.business_payment_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  stripe_account_id TEXT NOT NULL UNIQUE,
  account_status TEXT NOT NULL DEFAULT 'pending', -- pending, active, restricted, disabled
  charges_enabled BOOLEAN DEFAULT false,
  payouts_enabled BOOLEAN DEFAULT false,
  requirements_due JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(business_id)
);

-- Create table for platform transactions and fees
CREATE TABLE IF NOT EXISTS public.platform_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id),
  customer_id UUID REFERENCES public.profiles(id),
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  stripe_charge_id TEXT,
  amount_total NUMERIC(10,2) NOT NULL, -- Total amount paid by customer
  amount_business NUMERIC(10,2) NOT NULL, -- Amount going to business
  amount_platform_fee NUMERIC(10,2) NOT NULL, -- Platform fee captured
  platform_fee_percentage NUMERIC(5,2) DEFAULT 2.50, -- Default 2.5% platform fee
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL, -- succeeded, pending, failed, refunded
  description TEXT,
  customer_email TEXT,
  customer_name TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_platform_transactions_business ON public.platform_transactions(business_id);
CREATE INDEX idx_platform_transactions_customer ON public.platform_transactions(customer_id);
CREATE INDEX idx_platform_transactions_created ON public.platform_transactions(created_at DESC);
CREATE INDEX idx_business_payment_accounts_business ON public.business_payment_accounts(business_id);

-- Enable RLS
ALTER TABLE public.business_payment_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_payment_accounts
CREATE POLICY "Business owners can view their payment account"
  ON public.business_payment_accounts FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM public.businesses WHERE id = business_payment_accounts.business_id
    )
  );

CREATE POLICY "Business owners can insert their payment account"
  ON public.business_payment_accounts FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT owner_id FROM public.businesses WHERE id = business_payment_accounts.business_id
    )
  );

CREATE POLICY "Business owners can update their payment account"
  ON public.business_payment_accounts FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT owner_id FROM public.businesses WHERE id = business_payment_accounts.business_id
    )
  );

CREATE POLICY "Admins can view all payment accounts"
  ON public.business_payment_accounts FOR SELECT
  USING (is_admin());

-- RLS Policies for platform_transactions
CREATE POLICY "Business owners can view their transactions"
  ON public.platform_transactions FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM public.businesses WHERE id = platform_transactions.business_id
    )
  );

CREATE POLICY "Customers can view their transactions"
  ON public.platform_transactions FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all platform transactions"
  ON public.platform_transactions FOR SELECT
  USING (is_admin());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_platform_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_platform_transactions_updated_at
  BEFORE UPDATE ON public.platform_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_transactions_updated_at();

CREATE TRIGGER update_business_payment_accounts_updated_at
  BEFORE UPDATE ON public.business_payment_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_transactions_updated_at();