-- Backup & Restore: track admin-initiated database snapshots
CREATE TABLE IF NOT EXISTS public.admin_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | running | completed | failed
  backup_type TEXT NOT NULL DEFAULT 'manual', -- manual | scheduled
  tables_included TEXT[] NOT NULL DEFAULT '{}',
  row_counts JSONB NOT NULL DEFAULT '{}'::jsonb,
  size_bytes BIGINT,
  storage_path TEXT,
  error_message TEXT,
  notes TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_backups_created_at ON public.admin_backups (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_backups_status ON public.admin_backups (status);

ALTER TABLE public.admin_backups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view backups"
  ON public.admin_backups FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert backups"
  ON public.admin_backups FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update backups"
  ON public.admin_backups FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete backups"
  ON public.admin_backups FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Private storage bucket for backup files
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-backups', 'admin-backups', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can read backup files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'admin-backups' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload backup files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'admin-backups' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete backup files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'admin-backups' AND public.has_role(auth.uid(), 'admin'));