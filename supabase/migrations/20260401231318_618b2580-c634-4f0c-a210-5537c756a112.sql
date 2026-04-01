
-- Fix: Ambassador training storage - restrict to authenticated agents
CREATE POLICY "Agents can view training content"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'ambassador-training'
    AND EXISTS (
      SELECT 1 FROM public.sales_agents
      WHERE user_id = auth.uid() AND is_active = true
    )
  );
