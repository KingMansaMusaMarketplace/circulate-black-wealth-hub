ALTER TABLE public.qr_scans 
  ADD COLUMN IF NOT EXISTS is_flagged boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS flag_reason text,
  ADD COLUMN IF NOT EXISTS flagged_by uuid,
  ADD COLUMN IF NOT EXISTS flagged_at timestamptz,
  ADD COLUMN IF NOT EXISTS reversed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reversed_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_qr_scans_scan_date ON public.qr_scans(scan_date DESC);
CREATE INDEX IF NOT EXISTS idx_qr_scans_customer_date ON public.qr_scans(customer_id, scan_date DESC);
CREATE INDEX IF NOT EXISTS idx_qr_scans_flagged ON public.qr_scans(is_flagged) WHERE is_flagged = true;

DROP POLICY IF EXISTS "Admins manage qr_scans" ON public.qr_scans;
CREATE POLICY "Admins manage qr_scans" ON public.qr_scans
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));