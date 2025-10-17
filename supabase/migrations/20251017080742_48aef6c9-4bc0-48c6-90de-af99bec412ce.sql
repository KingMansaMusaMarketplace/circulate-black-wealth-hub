-- Create email_subscriptions table for newsletter signups
CREATE TABLE IF NOT EXISTS public.email_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'homepage_newsletter',
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for public newsletter signup)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.email_subscriptions
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON public.email_subscriptions
  FOR SELECT
  USING (is_admin_secure());

-- Policy: Authenticated users can view their own subscription
CREATE POLICY "Users can view their own subscription"
  ON public.email_subscriptions
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND email IN (
      SELECT email FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can update their own subscription (for unsubscribing)
CREATE POLICY "Users can update their own subscription"
  ON public.email_subscriptions
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL 
    AND email IN (
      SELECT email FROM profiles WHERE id = auth.uid()
    )
  );

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON public.email_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_active ON public.email_subscriptions(is_active) WHERE is_active = true;

-- Add trigger for updated_at
CREATE TRIGGER update_email_subscriptions_updated_at
  BEFORE UPDATE ON public.email_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();