-- Kayla Business Insights table: surfaces AI outputs to business owners
CREATE TABLE IF NOT EXISTS public.kayla_business_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  insight_type text NOT NULL CHECK (insight_type IN ('review_draft', 'churn_alert', 'onboarding_tip', 'b2b_match', 'content_suggestion', 'upgrade_pitch', 'quality_score')),
  title text NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'dismissed', 'actioned')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_kayla_insights_business ON public.kayla_business_insights(business_id);
CREATE INDEX idx_kayla_insights_type ON public.kayla_business_insights(insight_type);
CREATE INDEX idx_kayla_insights_status ON public.kayla_business_insights(status);

ALTER TABLE public.kayla_business_insights ENABLE ROW LEVEL SECURITY;

-- Business owners can read their own insights
CREATE POLICY "Business owners can view their insights"
  ON public.kayla_business_insights FOR SELECT
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

-- Business owners can update status (approve/dismiss)
CREATE POLICY "Business owners can update insight status"
  ON public.kayla_business_insights FOR UPDATE
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

-- Service role full access for Kayla to write insights
CREATE POLICY "Service role manages insights"
  ON public.kayla_business_insights FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Enable realtime for live dashboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE kayla_business_insights;