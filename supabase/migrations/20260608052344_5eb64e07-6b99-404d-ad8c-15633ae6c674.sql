
-- Pre-launch security hardening: lock down 3 INSERT policies that allowed
-- anonymous users to forge admin review fields (status, reviewed_by,
-- reviewed_at, admin_notes, notes). Public submissions are still allowed,
-- but submitters can no longer pre-approve their own requests/reports.

-- 1) api_access_requests: anyone may request, but cannot set admin fields
DROP POLICY IF EXISTS anyone_can_request_api_access ON public.api_access_requests;
CREATE POLICY anyone_can_request_api_access
  ON public.api_access_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND reviewed_at IS NULL
    AND reviewed_by IS NULL
    AND notes IS NULL
  );

-- 2) content_reports: anyone may report, but cannot pre-resolve
DROP POLICY IF EXISTS "Anyone can submit a report" ON public.content_reports;
CREATE POLICY "Anyone can submit a report"
  ON public.content_reports
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND admin_notes IS NULL
    AND reviewed_by IS NULL
    AND reviewed_at IS NULL
  );

-- 3) host_applications: anyone may apply, but cannot pre-approve themselves
DROP POLICY IF EXISTS "Anyone can submit a host application" ON public.host_applications;
CREATE POLICY "Anyone can submit a host application"
  ON public.host_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'new'
    AND admin_notes IS NULL
  );
