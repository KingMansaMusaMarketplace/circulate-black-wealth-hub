
-- Loyalty Engine: automated campaign rules
CREATE TABLE public.loyalty_engine_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  rule_type TEXT NOT NULL DEFAULT 'multiplier', -- multiplier, bonus, streak, referral, birthday, winback, cross_reward
  trigger_event TEXT NOT NULL, -- qr_scan, review, booking, purchase, signup, referral, noire_ride, checkin
  conditions JSONB DEFAULT '{}'::jsonb, -- e.g. {"min_spend": 20, "day_of_week": "friday", "time_range": ["17:00","21:00"]}
  reward_config JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g. {"multiplier": 2, "bonus_points": 50, "noire_credits": 10}
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  max_uses_total INTEGER,
  max_uses_per_customer INTEGER,
  current_uses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Loyalty Engine: campaign tracking
CREATE TABLE public.loyalty_engine_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  campaign_type TEXT NOT NULL, -- happy_hour, flash_double, streak_challenge, winback, seasonal, cross_platform
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, scheduled, active, paused, completed
  rules JSONB DEFAULT '[]'::jsonb, -- array of rule IDs or inline rule configs
  target_audience JSONB DEFAULT '{}'::jsonb, -- e.g. {"segment": "lapsed", "min_visits": 3, "days_inactive": 30}
  budget_points INTEGER, -- max points to distribute
  points_distributed INTEGER DEFAULT 0,
  noire_credits_distributed NUMERIC(10,2) DEFAULT 0,
  participants_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  ai_suggested BOOLEAN DEFAULT false,
  ai_reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Loyalty Engine: customer engagement log (bridges loyalty_points + noire_community_credits)
CREATE TABLE public.loyalty_engine_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL,
  campaign_id UUID REFERENCES public.loyalty_engine_campaigns(id),
  rule_id UUID REFERENCES public.loyalty_engine_rules(id),
  event_type TEXT NOT NULL, -- points_earned, points_redeemed, noire_credits_earned, streak_achieved, bonus_awarded, multiplier_applied
  base_points INTEGER DEFAULT 0,
  bonus_points INTEGER DEFAULT 0,
  multiplier NUMERIC(4,2) DEFAULT 1.0,
  total_points INTEGER DEFAULT 0,
  noire_credits_awarded NUMERIC(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loyalty_engine_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_engine_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_engine_events ENABLE ROW LEVEL SECURITY;

-- Business owners manage their rules/campaigns
CREATE POLICY "Business owners manage loyalty rules" ON public.loyalty_engine_rules
  FOR ALL TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()))
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Business owners manage loyalty campaigns" ON public.loyalty_engine_campaigns
  FOR ALL TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()))
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));

-- Events visible to business owners and the customer involved
CREATE POLICY "Business owners view loyalty events" ON public.loyalty_engine_events
  FOR SELECT TO authenticated
  USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
    OR customer_id = auth.uid()
  );

CREATE POLICY "System inserts loyalty events" ON public.loyalty_engine_events
  FOR INSERT TO authenticated
  WITH CHECK (true);
