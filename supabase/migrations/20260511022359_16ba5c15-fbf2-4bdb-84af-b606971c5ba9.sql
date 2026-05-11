
CREATE TABLE public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_user_id UUID NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT,
  remote_ok BOOLEAN NOT NULL DEFAULT false,
  employment_type TEXT NOT NULL DEFAULT 'full_time',
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT NOT NULL,
  apply_url TEXT,
  apply_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  stripe_session_id TEXT,
  amount_cents INTEGER NOT NULL DEFAULT 9900,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_postings_status_expires ON public.job_postings(status, expires_at);
CREATE INDEX idx_job_postings_poster ON public.job_postings(poster_user_id);
CREATE INDEX idx_job_postings_stripe ON public.job_postings(stripe_session_id);

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active jobs"
ON public.job_postings FOR SELECT
USING (status = 'active' AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Posters can view their own jobs"
ON public.job_postings FOR SELECT
TO authenticated
USING (poster_user_id = auth.uid());

CREATE POLICY "Posters can insert their own jobs"
ON public.job_postings FOR INSERT
TO authenticated
WITH CHECK (poster_user_id = auth.uid() AND status = 'pending_payment');

CREATE POLICY "Posters can update their own jobs"
ON public.job_postings FOR UPDATE
TO authenticated
USING (poster_user_id = auth.uid());

CREATE POLICY "Admins can view all jobs"
ON public.job_postings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all jobs"
ON public.job_postings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_job_postings_updated_at
BEFORE UPDATE ON public.job_postings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
