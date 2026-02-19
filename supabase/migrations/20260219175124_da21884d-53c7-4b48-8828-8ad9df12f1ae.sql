-- Add invite_token to property_cohosts for acceptance flow
ALTER TABLE public.property_cohosts
  ADD COLUMN IF NOT EXISTS invite_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS invite_expires_at TIMESTAMPTZ;

-- Generate tokens for existing pending invitations
UPDATE public.property_cohosts
  SET invite_token = encode(gen_random_bytes(32), 'hex'),
      invite_expires_at = now() + interval '7 days'
  WHERE status = 'pending' AND invite_token IS NULL;

-- Create stays_experiences table
CREATE TABLE IF NOT EXISTS public.stays_experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_user_id UUID NOT NULL,
  property_id UUID REFERENCES public.vacation_properties(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  location TEXT,
  city TEXT,
  state TEXT,
  price_per_person NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_guests INTEGER NOT NULL DEFAULT 10,
  duration_hours NUMERIC(4,1) NOT NULL DEFAULT 2,
  photos TEXT[] DEFAULT '{}',
  included_items TEXT[],
  languages TEXT[] DEFAULT '{English}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  average_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.stays_experiences ENABLE ROW LEVEL SECURITY;

-- Experiences: public can view active
CREATE POLICY "Anyone can view active experiences"
  ON public.stays_experiences FOR SELECT
  USING (is_active = true);

-- Hosts manage their own
CREATE POLICY "Hosts manage their own experiences"
  ON public.stays_experiences FOR ALL
  USING (auth.uid() = host_user_id)
  WITH CHECK (auth.uid() = host_user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_stays_experiences_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_stays_experiences_updated_at
  BEFORE UPDATE ON public.stays_experiences
  FOR EACH ROW EXECUTE FUNCTION public.update_stays_experiences_updated_at();
