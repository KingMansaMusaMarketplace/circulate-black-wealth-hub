CREATE POLICY "Admins view all stays payouts"
ON public.stays_host_payouts FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert stays payouts"
ON public.stays_host_payouts FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update stays payouts"
ON public.stays_host_payouts FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update vacation bookings"
ON public.vacation_bookings FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));