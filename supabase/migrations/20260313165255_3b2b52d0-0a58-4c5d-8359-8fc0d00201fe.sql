-- Tighten RLS on new Kayla adaptive tables to admin-only via has_role function
DROP POLICY IF EXISTS "Admins can manage outcome feedback" ON public.kayla_outcome_feedback;
DROP POLICY IF EXISTS "Admins can view performance metrics" ON public.kayla_performance_metrics;
DROP POLICY IF EXISTS "Admins can manage learning signals" ON public.kayla_learning_signals;

-- Outcome feedback: admin read/write, service role for triggers
CREATE POLICY "Admins can read outcome feedback"
  ON public.kayla_outcome_feedback FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert outcome feedback"
  ON public.kayla_outcome_feedback FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update outcome feedback"
  ON public.kayla_outcome_feedback FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Performance metrics: read for authenticated, write for admins
CREATE POLICY "Authenticated can read perf metrics"
  ON public.kayla_performance_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can write perf metrics"
  ON public.kayla_performance_metrics FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Learning signals: read for authenticated, write for admins
CREATE POLICY "Authenticated can read learning signals"
  ON public.kayla_learning_signals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can write learning signals"
  ON public.kayla_learning_signals FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update learning signals"
  ON public.kayla_learning_signals FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));