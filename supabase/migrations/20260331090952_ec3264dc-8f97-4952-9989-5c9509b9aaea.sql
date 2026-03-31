
-- Reputation monitoring configuration per business
CREATE TABLE public.reputation_monitor_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  monitor_frequency TEXT NOT NULL DEFAULT 'daily',
  custom_keywords TEXT[] DEFAULT '{}',
  excluded_domains TEXT[] DEFAULT '{}',
  alert_on_negative BOOLEAN NOT NULL DEFAULT true,
  alert_on_neutral BOOLEAN DEFAULT false,
  last_scan_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(business_id)
);

ALTER TABLE public.reputation_monitor_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners manage their monitor config"
  ON public.reputation_monitor_configs FOR ALL
  TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));

-- Discovered reputation mentions
CREATE TABLE public.reputation_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  source_domain TEXT,
  title TEXT,
  snippet TEXT,
  full_content TEXT,
  mention_type TEXT NOT NULL DEFAULT 'news',
  sentiment TEXT NOT NULL DEFAULT 'neutral',
  sentiment_score NUMERIC(4,3) DEFAULT 0.5,
  is_negative BOOLEAN DEFAULT false,
  drafted_response TEXT,
  owner_response TEXT,
  response_status TEXT DEFAULT 'pending',
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  discovered_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.reputation_mentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can view their mentions"
  ON public.reputation_mentions FOR SELECT
  TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Business owners can update their mentions"
  ON public.reputation_mentions FOR UPDATE
  TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));

-- Index for fast lookups
CREATE INDEX idx_reputation_mentions_business ON public.reputation_mentions(business_id, discovered_at DESC);
CREATE INDEX idx_reputation_mentions_sentiment ON public.reputation_mentions(business_id, is_negative, is_dismissed);
