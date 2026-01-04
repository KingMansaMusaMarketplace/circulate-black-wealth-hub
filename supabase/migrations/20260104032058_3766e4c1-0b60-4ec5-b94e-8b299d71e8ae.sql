-- Create sponsor_social_posts table to track social media recognition
CREATE TABLE public.sponsor_social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.corporate_subscriptions(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  posted_date DATE,
  platform TEXT,
  post_url TEXT,
  post_content TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'posted', 'skipped')),
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sponsor_social_posts ENABLE ROW LEVEL SECURITY;

-- Admins can manage all social posts
CREATE POLICY "Admins can manage sponsor social posts" 
ON public.sponsor_social_posts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Sponsors can view their own social posts
CREATE POLICY "Sponsors can view their social posts" 
ON public.sponsor_social_posts 
FOR SELECT 
USING (
  subscription_id IN (
    SELECT id FROM corporate_subscriptions 
    WHERE user_id = auth.uid()
  )
);

-- Create index for efficient queries
CREATE INDEX idx_sponsor_social_posts_subscription ON public.sponsor_social_posts(subscription_id);
CREATE INDEX idx_sponsor_social_posts_scheduled ON public.sponsor_social_posts(scheduled_date, status);

-- Add trigger for updated_at
CREATE TRIGGER update_sponsor_social_posts_updated_at
  BEFORE UPDATE ON public.sponsor_social_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();