-- Create table for Apple In-App Purchase subscriptions
CREATE TABLE IF NOT EXISTS public.apple_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  original_transaction_id TEXT NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_date TIMESTAMP WITH TIME ZONE,
  is_trial_period BOOLEAN DEFAULT false,
  is_in_intro_offer_period BOOLEAN DEFAULT false,
  receipt_data TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('Production', 'Sandbox')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'grace_period')),
  auto_renew_status BOOLEAN DEFAULT true,
  cancellation_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.apple_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own Apple subscriptions"
ON public.apple_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Apple subscriptions"
ON public.apple_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_apple_subscriptions_user_id ON public.apple_subscriptions(user_id);
CREATE INDEX idx_apple_subscriptions_transaction_id ON public.apple_subscriptions(transaction_id);
CREATE INDEX idx_apple_subscriptions_status ON public.apple_subscriptions(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_apple_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_apple_subscriptions_updated_at
BEFORE UPDATE ON public.apple_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_apple_subscriptions_updated_at();