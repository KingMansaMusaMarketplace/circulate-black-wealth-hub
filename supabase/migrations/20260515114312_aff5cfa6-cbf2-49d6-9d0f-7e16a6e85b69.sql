CREATE TABLE IF NOT EXISTS public.admin_api_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  token_prefix TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_used_at TIMESTAMPTZ,
  last_used_ip TEXT,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  use_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_api_tokens_hash ON public.admin_api_tokens (token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_api_tokens_revoked ON public.admin_api_tokens (revoked_at) WHERE revoked_at IS NULL;

ALTER TABLE public.admin_api_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view api tokens" ON public.admin_api_tokens
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert api tokens" ON public.admin_api_tokens
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update api tokens" ON public.admin_api_tokens
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete api tokens" ON public.admin_api_tokens
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_admin_api_tokens_updated_at
  BEFORE UPDATE ON public.admin_api_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();