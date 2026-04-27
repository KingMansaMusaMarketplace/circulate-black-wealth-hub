-- Status enum for outreach pipeline
CREATE TYPE public.outreach_status AS ENUM (
  'researched',
  'intro_sent',
  'replied',
  'meeting_booked',
  'in_discussion',
  'allied',
  'declined',
  'paused'
);

CREATE TYPE public.outreach_tier AS ENUM ('tier_1', 'tier_2', 'tier_3');

CREATE TYPE public.outreach_channel AS ENUM (
  'email',
  'linkedin',
  'contact_form',
  'phone',
  'meeting',
  'sms',
  'other'
);

CREATE TYPE public.outreach_direction AS ENUM ('outbound', 'inbound');

-- Targets table
CREATE TABLE public.outreach_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  directory_name TEXT NOT NULL,
  tier public.outreach_tier NOT NULL DEFAULT 'tier_2',
  owner_name TEXT,
  owner_title TEXT,
  website TEXT,
  contact_method public.outreach_channel,
  contact_value TEXT,
  linkedin_url TEXT,
  location TEXT,
  status public.outreach_status NOT NULL DEFAULT 'researched',
  priority INTEGER NOT NULL DEFAULT 3,
  assigned_to UUID,
  next_action TEXT,
  next_action_date DATE,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_outreach_targets_status ON public.outreach_targets(status);
CREATE INDEX idx_outreach_targets_tier ON public.outreach_targets(tier);
CREATE INDEX idx_outreach_targets_next_action_date ON public.outreach_targets(next_action_date);

-- Touches log
CREATE TABLE public.outreach_touches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_id UUID NOT NULL REFERENCES public.outreach_targets(id) ON DELETE CASCADE,
  channel public.outreach_channel NOT NULL,
  direction public.outreach_direction NOT NULL DEFAULT 'outbound',
  subject TEXT,
  body TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_outreach_touches_target_id ON public.outreach_touches(target_id);
CREATE INDEX idx_outreach_touches_occurred_at ON public.outreach_touches(occurred_at DESC);

-- Enable RLS
ALTER TABLE public.outreach_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_touches ENABLE ROW LEVEL SECURITY;

-- Admin-only policies (relies on existing public.has_role(uuid, app_role) function used elsewhere in project)
CREATE POLICY "Admins can view outreach targets"
  ON public.outreach_targets FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert outreach targets"
  ON public.outreach_targets FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update outreach targets"
  ON public.outreach_targets FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete outreach targets"
  ON public.outreach_targets FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view outreach touches"
  ON public.outreach_touches FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert outreach touches"
  ON public.outreach_touches FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update outreach touches"
  ON public.outreach_touches FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete outreach touches"
  ON public.outreach_touches FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger (reuses existing public.update_updated_at_column if present, else creates)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_outreach_targets_updated_at
  BEFORE UPDATE ON public.outreach_targets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();