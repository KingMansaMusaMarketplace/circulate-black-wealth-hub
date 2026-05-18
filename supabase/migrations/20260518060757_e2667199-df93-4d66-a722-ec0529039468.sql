-- Content reports table
CREATE TABLE IF NOT EXISTS public.content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_email TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('property_photo','property','lease_property','review','message')),
  content_id UUID NOT NULL,
  photo_url TEXT,
  reason TEXT NOT NULL CHECK (reason IN ('sexual','violence','hate','spam','misleading','illegal','other')),
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed','removed','dismissed')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_reports_status ON public.content_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_reports_content ON public.content_reports(content_type, content_id);

ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

-- Anyone (incl. anonymous) can submit a report
CREATE POLICY "Anyone can submit a report"
ON public.content_reports FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Reporters see their own
CREATE POLICY "Reporters can view their own reports"
ON public.content_reports FOR SELECT TO authenticated
USING (reporter_id = auth.uid());

-- Admins see all
CREATE POLICY "Admins can view all reports"
ON public.content_reports FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports"
ON public.content_reports FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reports"
ON public.content_reports FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_content_reports_updated_at
BEFORE UPDATE ON public.content_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add moderation_status to vacation_properties (covers leases too)
ALTER TABLE public.vacation_properties
  ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'approved'
    CHECK (moderation_status IN ('pending','approved','blocked'));

CREATE INDEX IF NOT EXISTS idx_vacation_properties_moderation
  ON public.vacation_properties(moderation_status) WHERE moderation_status <> 'approved';