
-- Create reviews table for business reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(business_id, customer_id) -- One review per customer per business
);

-- Create social_shares table for tracking business shares
CREATE TABLE public.social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  shared_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  platform TEXT NOT NULL,
  share_url TEXT,
  shared_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create business_interactions table for tracking user engagement
CREATE TABLE public.business_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'like', 'comment', 'share', 'view'
  interaction_score INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscribers table for subscription management
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Users can view all reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = customer_id);

-- RLS Policies for social_shares
CREATE POLICY "Anyone can view social shares" ON public.social_shares
  FOR SELECT USING (true);

CREATE POLICY "Users can create social shares" ON public.social_shares
  FOR INSERT WITH CHECK (auth.uid() = shared_by);

-- RLS Policies for business_interactions
CREATE POLICY "Users can view all interactions" ON public.business_interactions
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own interactions" ON public.business_interactions
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for subscribers
CREATE POLICY "Users can view their own subscription" ON public.subscribers
  FOR SELECT USING (auth.uid() = user_id OR email = auth.email());

CREATE POLICY "Users can update their own subscription" ON public.subscribers
  FOR UPDATE USING (auth.uid() = user_id OR email = auth.email());

CREATE POLICY "Edge functions can insert subscriptions" ON public.subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Edge functions can update subscriptions" ON public.subscribers
  FOR UPDATE USING (true);

-- Add indexes for better performance
CREATE INDEX idx_reviews_business_id ON public.reviews(business_id);
CREATE INDEX idx_reviews_customer_id ON public.reviews(customer_id);
CREATE INDEX idx_social_shares_business_id ON public.social_shares(business_id);
CREATE INDEX idx_business_interactions_user_id ON public.business_interactions(user_id);
CREATE INDEX idx_business_interactions_business_id ON public.business_interactions(business_id);
CREATE INDEX idx_subscribers_email ON public.subscribers(email);
CREATE INDEX idx_subscribers_stripe_customer_id ON public.subscribers(stripe_customer_id);

-- Function to automatically update review counts and ratings on businesses table
CREATE OR REPLACE FUNCTION update_business_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the business statistics when a review is added, updated, or deleted
  UPDATE businesses 
  SET 
    review_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
    ),
    average_rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
    )
  WHERE id = COALESCE(NEW.business_id, OLD.business_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update business stats
CREATE TRIGGER update_business_stats_on_review_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_business_review_stats();

CREATE TRIGGER update_business_stats_on_review_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_business_review_stats();

CREATE TRIGGER update_business_stats_on_review_delete
  AFTER DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_business_review_stats();
