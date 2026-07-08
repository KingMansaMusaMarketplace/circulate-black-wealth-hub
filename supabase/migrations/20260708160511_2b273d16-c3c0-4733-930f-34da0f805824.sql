-- content_reports: prevent spoofed reporter_id
DROP POLICY IF EXISTS "Anyone can submit a report" ON public.content_reports;
CREATE POLICY "Anyone can submit a report"
  ON public.content_reports
  FOR INSERT
  WITH CHECK (
    status = 'pending'
    AND admin_notes IS NULL
    AND (reporter_id IS NULL OR reporter_id = auth.uid())
  );

-- host_applications: prevent spoofed user_id
DROP POLICY IF EXISTS "Anyone can submit a host application" ON public.host_applications;
CREATE POLICY "Anyone can submit a host application"
  ON public.host_applications
  FOR INSERT
  WITH CHECK (
    status = 'new'
    AND admin_notes IS NULL
    AND (user_id IS NULL OR user_id = auth.uid())
  );