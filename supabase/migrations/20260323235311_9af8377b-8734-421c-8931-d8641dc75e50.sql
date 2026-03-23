
-- Phase 2: Grant/Funding Matcher
CREATE TABLE public.kayla_grant_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  grant_name TEXT NOT NULL,
  grant_provider TEXT NOT NULL,
  grant_url TEXT,
  amount_min NUMERIC,
  amount_max NUMERIC,
  deadline DATE,
  eligibility_summary TEXT,
  match_score NUMERIC DEFAULT 0,
  match_reasons TEXT[],
  status TEXT DEFAULT 'discovered' CHECK (status IN ('discovered','applied','awarded','rejected','expired')),
  ai_application_tips TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.kayla_grant_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Business owners can view their grant matches" ON public.kayla_grant_matches FOR SELECT TO authenticated USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));
CREATE POLICY "System can manage grant matches" ON public.kayla_grant_matches FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Phase 2: Cash Flow Forecasting
CREATE TABLE public.kayla_cashflow_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  forecast_period TEXT NOT NULL,
  projected_revenue NUMERIC DEFAULT 0,
  projected_expenses NUMERIC DEFAULT 0,
  projected_net NUMERIC DEFAULT 0,
  confidence_level NUMERIC DEFAULT 0,
  risk_factors TEXT[],
  opportunities TEXT[],
  ai_summary TEXT,
  data_points JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.kayla_cashflow_forecasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Business owners can view their forecasts" ON public.kayla_cashflow_forecasts FOR SELECT TO authenticated USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));
CREATE POLICY "System can manage forecasts" ON public.kayla_cashflow_forecasts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Phase 2: Price Optimization
CREATE TABLE public.kayla_price_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  product_or_service TEXT NOT NULL,
  current_price NUMERIC,
  recommended_price NUMERIC,
  price_change_percent NUMERIC,
  reasoning TEXT,
  market_data JSONB DEFAULT '{}',
  competitor_range TEXT,
  confidence_score NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','implemented')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.kayla_price_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Business owners can view price recommendations" ON public.kayla_price_recommendations FOR SELECT TO authenticated USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));
CREATE POLICY "System can manage price recommendations" ON public.kayla_price_recommendations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Phase 2: Appointment Reminders
CREATE TABLE public.kayla_reminder_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  reminder_type TEXT DEFAULT 'appointment' CHECK (reminder_type IN ('appointment','follow_up','renewal','custom')),
  hours_before INTEGER DEFAULT 24,
  message_template TEXT,
  channel TEXT DEFAULT 'email' CHECK (channel IN ('email','sms','push')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.kayla_reminders_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  rule_id UUID REFERENCES public.kayla_reminder_rules(id),
  booking_id UUID,
  customer_email TEXT,
  customer_name TEXT,
  message_content TEXT,
  sent_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent','delivered','opened','failed'))
);

ALTER TABLE public.kayla_reminder_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kayla_reminders_sent ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Business owners can manage reminder rules" ON public.kayla_reminder_rules FOR ALL TO authenticated USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())) WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));
CREATE POLICY "Business owners can view sent reminders" ON public.kayla_reminders_sent FOR SELECT TO authenticated USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));
CREATE POLICY "System can manage sent reminders" ON public.kayla_reminders_sent FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Phase 2: Behavior-Triggered Email Campaigns
CREATE TABLE public.kayla_email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  campaign_name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('first_visit','repeat_visit','no_visit_30d','high_spender','new_review','birthday','abandoned_booking')),
  subject_line TEXT,
  email_body TEXT,
  is_active BOOLEAN DEFAULT true,
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.kayla_email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.kayla_email_campaigns(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  sent_at TIMESTAMPTZ DEFAULT now(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent','delivered','opened','clicked','bounced','unsubscribed'))
);

ALTER TABLE public.kayla_email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kayla_email_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Business owners can manage campaigns" ON public.kayla_email_campaigns FOR ALL TO authenticated USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())) WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));
CREATE POLICY "Business owners can view email sends" ON public.kayla_email_sends FOR SELECT TO authenticated USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));
CREATE POLICY "System can manage email sends" ON public.kayla_email_sends FOR ALL TO authenticated USING (true) WITH CHECK (true);
