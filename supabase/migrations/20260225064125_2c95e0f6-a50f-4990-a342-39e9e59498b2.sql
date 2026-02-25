
-- Create press releases table for Platinum sponsor PR support
CREATE TABLE public.sponsor_press_releases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES public.corporate_subscriptions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  body TEXT NOT NULL,
  quote TEXT,
  quote_attribution TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'rejected')),
  review_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sponsor_press_releases ENABLE ROW LEVEL SECURITY;

-- Sponsors can view their own press releases
CREATE POLICY "Sponsors can view own press releases"
  ON public.sponsor_press_releases FOR SELECT
  USING (
    subscription_id IN (
      SELECT id FROM public.corporate_subscriptions WHERE user_id = auth.uid()
    )
  );

-- Sponsors can create press releases
CREATE POLICY "Sponsors can create press releases"
  ON public.sponsor_press_releases FOR INSERT
  WITH CHECK (
    subscription_id IN (
      SELECT id FROM public.corporate_subscriptions WHERE user_id = auth.uid()
    )
  );

-- Sponsors can update their own draft/pending press releases
CREATE POLICY "Sponsors can update own press releases"
  ON public.sponsor_press_releases FOR UPDATE
  USING (
    subscription_id IN (
      SELECT id FROM public.corporate_subscriptions WHERE user_id = auth.uid()
    )
  );

-- Sponsors can delete their own draft press releases
CREATE POLICY "Sponsors can delete own draft press releases"
  ON public.sponsor_press_releases FOR DELETE
  USING (
    subscription_id IN (
      SELECT id FROM public.corporate_subscriptions WHERE user_id = auth.uid()
    )
    AND status = 'draft'
  );

-- Trigger for updated_at
CREATE TRIGGER update_sponsor_press_releases_updated_at
  BEFORE UPDATE ON public.sponsor_press_releases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
