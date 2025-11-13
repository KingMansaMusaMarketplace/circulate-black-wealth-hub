-- Create review sentiment analysis table
CREATE TABLE IF NOT EXISTS public.review_sentiment_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral', 'mixed')),
  sentiment_score DECIMAL NOT NULL CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
  confidence_score DECIMAL NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  key_themes JSONB DEFAULT '[]',
  extracted_topics JSONB DEFAULT '[]',
  urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
  ai_summary TEXT,
  emotions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_review_sentiment_review ON public.review_sentiment_analysis(review_id);
CREATE INDEX idx_review_sentiment_business ON public.review_sentiment_analysis(business_id);
CREATE INDEX idx_review_sentiment_sentiment ON public.review_sentiment_analysis(sentiment);
CREATE INDEX idx_review_sentiment_urgency ON public.review_sentiment_analysis(urgency_level);
CREATE INDEX idx_review_sentiment_created ON public.review_sentiment_analysis(created_at DESC);

-- Enable RLS
ALTER TABLE public.review_sentiment_analysis ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view sentiment analysis for public reviews
CREATE POLICY "Public can view sentiment analysis"
  ON public.review_sentiment_analysis
  FOR SELECT
  USING (true);

-- Policy: Business owners can view their sentiment analysis
CREATE POLICY "Business owners can view their sentiment analysis"
  ON public.review_sentiment_analysis
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = review_sentiment_analysis.business_id
      AND owner_id = auth.uid()
    )
  );

-- Policy: System can insert sentiment analysis
CREATE POLICY "System can insert sentiment analysis"
  ON public.review_sentiment_analysis
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create sentiment trends aggregation table
CREATE TABLE IF NOT EXISTS public.business_sentiment_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_reviews INTEGER DEFAULT 0,
  positive_count INTEGER DEFAULT 0,
  negative_count INTEGER DEFAULT 0,
  neutral_count INTEGER DEFAULT 0,
  average_sentiment_score DECIMAL,
  top_positive_themes JSONB DEFAULT '[]',
  top_negative_themes JSONB DEFAULT '[]',
  recurring_complaints JSONB DEFAULT '[]',
  urgent_issues_count INTEGER DEFAULT 0,
  ai_insights TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, period_start, period_end)
);

-- Create index
CREATE INDEX idx_sentiment_trends_business ON public.business_sentiment_trends(business_id);
CREATE INDEX idx_sentiment_trends_period ON public.business_sentiment_trends(period_start, period_end);

-- Enable RLS
ALTER TABLE public.business_sentiment_trends ENABLE ROW LEVEL SECURITY;

-- Policy: Business owners can view their trends
CREATE POLICY "Business owners can view sentiment trends"
  ON public.business_sentiment_trends
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = business_sentiment_trends.business_id
      AND owner_id = auth.uid()
    )
  );

-- Policy: Admins can view all trends
CREATE POLICY "Admins can view all sentiment trends"
  ON public.business_sentiment_trends
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to automatically analyze new reviews
CREATE OR REPLACE FUNCTION public.trigger_review_sentiment_analysis()
RETURNS TRIGGER AS $$
BEGIN
  -- Call edge function asynchronously to analyze the review
  PERFORM net.http_post(
    url := current_setting('app.supabase_url', true) || '/functions/v1/analyze-review-sentiment',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key', true)
    ),
    body := jsonb_build_object('reviewId', NEW.id)
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block review creation
    RAISE WARNING 'Failed to trigger sentiment analysis: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new reviews
CREATE TRIGGER trigger_analyze_new_review
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_review_sentiment_analysis();

-- Function to update sentiment trends
CREATE OR REPLACE FUNCTION public.update_sentiment_trends(p_business_id UUID, p_period_days INTEGER DEFAULT 7)
RETURNS JSONB AS $$
DECLARE
  v_period_start DATE;
  v_period_end DATE;
  v_result JSONB;
BEGIN
  v_period_end := CURRENT_DATE;
  v_period_start := v_period_end - (p_period_days || ' days')::INTERVAL;
  
  -- Aggregate sentiment data
  INSERT INTO public.business_sentiment_trends (
    business_id,
    period_start,
    period_end,
    total_reviews,
    positive_count,
    negative_count,
    neutral_count,
    average_sentiment_score,
    urgent_issues_count
  )
  SELECT
    p_business_id,
    v_period_start,
    v_period_end,
    COUNT(*),
    COUNT(*) FILTER (WHERE sentiment = 'positive'),
    COUNT(*) FILTER (WHERE sentiment = 'negative'),
    COUNT(*) FILTER (WHERE sentiment = 'neutral'),
    AVG(sentiment_score),
    COUNT(*) FILTER (WHERE urgency_level IN ('high', 'critical'))
  FROM public.review_sentiment_analysis
  WHERE business_id = p_business_id
    AND created_at >= v_period_start
    AND created_at <= v_period_end
  ON CONFLICT (business_id, period_start, period_end)
  DO UPDATE SET
    total_reviews = EXCLUDED.total_reviews,
    positive_count = EXCLUDED.positive_count,
    negative_count = EXCLUDED.negative_count,
    neutral_count = EXCLUDED.neutral_count,
    average_sentiment_score = EXCLUDED.average_sentiment_score,
    urgent_issues_count = EXCLUDED.urgent_issues_count,
    created_at = NOW();
  
  v_result := jsonb_build_object(
    'success', true,
    'period_start', v_period_start,
    'period_end', v_period_end
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update trigger for review_sentiment_analysis
CREATE OR REPLACE FUNCTION public.update_review_sentiment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_review_sentiment_analysis_updated_at
  BEFORE UPDATE ON public.review_sentiment_analysis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_review_sentiment_updated_at();