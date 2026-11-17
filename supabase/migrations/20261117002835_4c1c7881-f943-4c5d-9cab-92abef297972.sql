GRANT SELECT ON public.kayla_autopilot_state TO authenticated;
CREATE POLICY "Admins read Kayla autopilot state"
  ON public.kayla_autopilot_state FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));