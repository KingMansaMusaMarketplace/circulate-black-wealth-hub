-- Shared business memory: one row per business, accumulating context all agents read/write
CREATE TABLE IF NOT EXISTS public.kayla_business_context (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL UNIQUE,
  goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  recent_decisions JSONB NOT NULL DEFAULT '[]'::jsonb,
  key_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary TEXT,
  last_updated_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.kayla_business_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view their business context"
  ON public.kayla_business_context FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = kayla_business_context.business_id AND b.owner_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Owners insert their business context"
  ON public.kayla_business_context FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = kayla_business_context.business_id AND b.owner_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Owners update their business context"
  ON public.kayla_business_context FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = kayla_business_context.business_id AND b.owner_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE TRIGGER update_kayla_business_context_updated_at
  BEFORE UPDATE ON public.kayla_business_context
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Visible learnings: short, human-readable things Kayla learned from feedback
CREATE TABLE IF NOT EXISTS public.kayla_learnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  agent_name TEXT NOT NULL,
  learning TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'feedback',
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.5,
  applied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kayla_learnings_business_created
  ON public.kayla_learnings(business_id, created_at DESC);

ALTER TABLE public.kayla_learnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view their learnings"
  ON public.kayla_learnings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = kayla_learnings.business_id AND b.owner_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Owners insert learnings for their business"
  ON public.kayla_learnings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = kayla_learnings.business_id AND b.owner_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );