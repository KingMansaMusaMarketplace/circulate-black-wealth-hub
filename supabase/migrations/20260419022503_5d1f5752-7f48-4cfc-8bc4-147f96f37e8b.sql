
-- Sponsor deliverables (tier benefit fulfillment tracking)
CREATE TABLE public.sponsor_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id uuid NOT NULL REFERENCES public.corporate_subscriptions(id) ON DELETE CASCADE,
  tier text NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  due_date date,
  completed_at timestamptz,
  completed_by uuid,
  assigned_to uuid,
  notes text,
  sort_order integer DEFAULT 0,
  is_recurring boolean DEFAULT false,
  recurrence_interval text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sponsor_deliverables_sponsor ON public.sponsor_deliverables(sponsor_id);
CREATE INDEX idx_sponsor_deliverables_status ON public.sponsor_deliverables(status);

ALTER TABLE public.sponsor_deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all deliverables"
  ON public.sponsor_deliverables FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert deliverables"
  ON public.sponsor_deliverables FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update deliverables"
  ON public.sponsor_deliverables FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete deliverables"
  ON public.sponsor_deliverables FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE TRIGGER update_sponsor_deliverables_updated_at
  BEFORE UPDATE ON public.sponsor_deliverables
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-seed deliverables when a new sponsor is added
CREATE OR REPLACE FUNCTION public.seed_sponsor_deliverables()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Founding tier
  IF NEW.tier = 'founding' OR NEW.is_founding_sponsor = true THEN
    INSERT INTO public.sponsor_deliverables (sponsor_id, tier, category, title, sort_order, is_recurring, recurrence_interval) VALUES
      (NEW.id, 'founding', 'logo', 'Add logo to platform footer', 10, false, null),
      (NEW.id, 'founding', 'email', 'Send quarterly impact summary email', 20, true, 'quarterly'),
      (NEW.id, 'founding', 'social', 'Quarterly social media mention', 30, true, 'quarterly'),
      (NEW.id, 'founding', 'document', 'Issue Founding Sponsor certificate', 40, false, null),
      (NEW.id, 'founding', 'newsletter', 'Include in newsletter', 50, true, 'monthly'),
      (NEW.id, 'founding', 'pricing', 'Lock rate for 12 months', 60, false, null);
  END IF;

  IF NEW.tier = 'bronze' THEN
    INSERT INTO public.sponsor_deliverables (sponsor_id, tier, category, title, sort_order, is_recurring, recurrence_interval) VALUES
      (NEW.id, 'bronze', 'logo', 'Add logo to website footer', 10, false, null),
      (NEW.id, 'bronze', 'email', 'Send monthly impact reports', 20, true, 'monthly'),
      (NEW.id, 'bronze', 'analytics', 'Provision analytics dashboard access', 30, false, null),
      (NEW.id, 'bronze', 'document', 'Issue certificate of sponsorship', 40, false, null),
      (NEW.id, 'bronze', 'document', 'Send tax deduction documentation', 50, false, null);
  END IF;

  IF NEW.tier = 'silver' THEN
    INSERT INTO public.sponsor_deliverables (sponsor_id, tier, category, title, sort_order, is_recurring, recurrence_interval) VALUES
      (NEW.id, 'silver', 'logo', 'Add logo to website footer', 10, false, null),
      (NEW.id, 'silver', 'email', 'Send monthly impact reports', 20, true, 'monthly'),
      (NEW.id, 'silver', 'analytics', 'Provision analytics dashboard access', 30, false, null),
      (NEW.id, 'silver', 'document', 'Issue certificate of sponsorship', 40, false, null),
      (NEW.id, 'silver', 'document', 'Send tax deduction documentation', 50, false, null),
      (NEW.id, 'silver', 'logo', 'Add logo to business directory & sidebar', 60, false, null),
      (NEW.id, 'silver', 'social', 'Social media recognition (2x/month)', 70, true, 'biweekly'),
      (NEW.id, 'silver', 'email', 'Send quarterly impact reports', 80, true, 'quarterly'),
      (NEW.id, 'silver', 'support', 'Enable priority email support', 90, false, null),
      (NEW.id, 'silver', 'content', 'Publish sponsor spotlight blog post', 100, false, null);
  END IF;

  IF NEW.tier = 'gold' THEN
    INSERT INTO public.sponsor_deliverables (sponsor_id, tier, category, title, sort_order, is_recurring, recurrence_interval) VALUES
      (NEW.id, 'gold', 'logo', 'Add logo to website footer', 10, false, null),
      (NEW.id, 'gold', 'email', 'Send monthly impact reports', 20, true, 'monthly'),
      (NEW.id, 'gold', 'analytics', 'Provision analytics dashboard access', 30, false, null),
      (NEW.id, 'gold', 'document', 'Issue certificate of sponsorship', 40, false, null),
      (NEW.id, 'gold', 'document', 'Send tax deduction documentation', 50, false, null),
      (NEW.id, 'gold', 'logo', 'Add logo to business directory & sidebar', 60, false, null),
      (NEW.id, 'gold', 'email', 'Send quarterly impact reports', 80, true, 'quarterly'),
      (NEW.id, 'gold', 'support', 'Enable priority email support', 90, false, null),
      (NEW.id, 'gold', 'content', 'Publish sponsor spotlight blog post', 100, false, null),
      (NEW.id, 'gold', 'placement', 'Add rotating homepage banner', 110, false, null),
      (NEW.id, 'gold', 'placement', 'Set featured directory placement', 120, false, null),
      (NEW.id, 'gold', 'social', 'Weekly social media recognition', 130, true, 'weekly'),
      (NEW.id, 'gold', 'content', 'Produce custom impact case study', 140, false, null),
      (NEW.id, 'gold', 'content', 'Create co-branded marketing materials', 150, false, null),
      (NEW.id, 'gold', 'event', 'Send invitations to exclusive events', 160, true, 'quarterly'),
      (NEW.id, 'gold', 'support', 'Assign dedicated account manager', 170, false, null);
  END IF;

  IF NEW.tier = 'platinum' THEN
    INSERT INTO public.sponsor_deliverables (sponsor_id, tier, category, title, sort_order, is_recurring, recurrence_interval) VALUES
      (NEW.id, 'platinum', 'logo', 'Add logo to website footer', 10, false, null),
      (NEW.id, 'platinum', 'email', 'Send monthly impact reports', 20, true, 'monthly'),
      (NEW.id, 'platinum', 'analytics', 'Provision analytics dashboard access', 30, false, null),
      (NEW.id, 'platinum', 'document', 'Issue certificate of sponsorship', 40, false, null),
      (NEW.id, 'platinum', 'document', 'Send tax deduction documentation', 50, false, null),
      (NEW.id, 'platinum', 'logo', 'Add logo to business directory & sidebar', 60, false, null),
      (NEW.id, 'platinum', 'email', 'Send quarterly impact reports', 80, true, 'quarterly'),
      (NEW.id, 'platinum', 'support', 'Enable priority email support', 90, false, null),
      (NEW.id, 'platinum', 'content', 'Publish sponsor spotlight blog post', 100, false, null),
      (NEW.id, 'platinum', 'placement', 'Set featured directory placement', 120, false, null),
      (NEW.id, 'platinum', 'content', 'Produce custom impact case study', 140, false, null),
      (NEW.id, 'platinum', 'content', 'Create co-branded marketing materials', 150, false, null),
      (NEW.id, 'platinum', 'event', 'Send invitations to exclusive events', 160, true, 'quarterly'),
      (NEW.id, 'platinum', 'support', 'Assign dedicated account manager', 170, false, null),
      (NEW.id, 'platinum', 'placement', 'Set top banner placement', 200, false, null),
      (NEW.id, 'platinum', 'placement', 'Add to all platform logo placements', 210, false, null),
      (NEW.id, 'platinum', 'social', 'Daily social media recognition', 220, true, 'daily'),
      (NEW.id, 'platinum', 'content', 'Build custom landing page', 230, false, null),
      (NEW.id, 'platinum', 'content', 'Coordinate press release & PR support', 240, false, null),
      (NEW.id, 'platinum', 'event', 'Schedule executive networking opportunities', 250, true, 'quarterly'),
      (NEW.id, 'platinum', 'event', 'Hold quarterly strategy session', 260, true, 'quarterly'),
      (NEW.id, 'platinum', 'event', 'Send VIP event invitations', 270, true, 'quarterly');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_seed_sponsor_deliverables
  AFTER INSERT ON public.corporate_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.seed_sponsor_deliverables();
