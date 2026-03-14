
-- FIX 1: Remove PII exposure - block anon from base table
DROP POLICY IF EXISTS "Anon users can view public businesses" ON businesses;

CREATE POLICY "Anon users can view public businesses safe"
ON businesses
FOR SELECT
TO anon
USING (false);

GRANT SELECT ON business_directory TO anon;

-- FIX 3: Replace insecure user_type admin checks with is_admin_secure()
DROP POLICY IF EXISTS "Admins can view contact submissions" ON contact_submissions;
CREATE POLICY "Admins can view contact submissions"
ON contact_submissions FOR SELECT TO authenticated
USING (is_admin_secure());

DROP POLICY IF EXISTS "Admins can update contact submissions" ON contact_submissions;
CREATE POLICY "Admins can update contact submissions"
ON contact_submissions FOR UPDATE TO authenticated
USING (is_admin_secure());

DROP POLICY IF EXISTS "Admins can view all withdrawal requests" ON withdrawal_requests;
CREATE POLICY "Admins can view all withdrawal requests"
ON withdrawal_requests FOR SELECT TO authenticated
USING (is_admin_secure());

DROP POLICY IF EXISTS "Admins can update withdrawal requests" ON withdrawal_requests;
CREATE POLICY "Admins can update withdrawal requests"
ON withdrawal_requests FOR UPDATE TO authenticated
USING (is_admin_secure());

DROP POLICY IF EXISTS "Admins can manage scheduled searches" ON scheduled_discovery_searches;
CREATE POLICY "Admins can manage scheduled searches"
ON scheduled_discovery_searches FOR ALL TO authenticated
USING (is_admin_secure())
WITH CHECK (is_admin_secure());
