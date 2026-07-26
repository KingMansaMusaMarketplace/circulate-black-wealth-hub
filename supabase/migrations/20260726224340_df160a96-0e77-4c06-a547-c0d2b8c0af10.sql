ALTER TABLE public.investor_access_requests
  ADD COLUMN IF NOT EXISTS approval_email_sent_at timestamptz;