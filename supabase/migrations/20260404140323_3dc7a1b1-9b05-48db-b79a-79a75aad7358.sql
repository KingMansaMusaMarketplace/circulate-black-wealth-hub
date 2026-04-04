-- Restrict kayla_performance_metrics to admins only
DROP POLICY IF EXISTS "Authenticated can read perf metrics" ON kayla_performance_metrics;

CREATE POLICY "admins_read_perf_metrics" ON kayla_performance_metrics
  FOR SELECT TO authenticated
  USING (is_admin_secure());
