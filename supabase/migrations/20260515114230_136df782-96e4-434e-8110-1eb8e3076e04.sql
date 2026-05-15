CREATE TABLE IF NOT EXISTS public.admin_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  event_types TEXT[] NOT NULL DEFAULT '{}',
  signing_secret TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_delivery_at TIMESTAMPTZ,
  last_delivery_status INT,
  failure_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_webhooks_active ON public.admin_webhooks (is_active);

CREATE TABLE IF NOT EXISTS public.admin_webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES public.admin_webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  attempt INT NOT NULL DEFAULT 1,
  response_status INT,
  response_body TEXT,
  latency_ms INT,
  error_message TEXT,
  delivered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON public.admin_webhook_deliveries (webhook_id, delivered_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_delivered_at ON public.admin_webhook_deliveries (delivered_at DESC);

ALTER TABLE public.admin_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_webhook_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage webhooks select" ON public.admin_webhooks
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage webhooks insert" ON public.admin_webhooks
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage webhooks update" ON public.admin_webhooks
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage webhooks delete" ON public.admin_webhooks
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins view webhook deliveries" ON public.admin_webhook_deliveries
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert webhook deliveries" ON public.admin_webhook_deliveries
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete webhook deliveries" ON public.admin_webhook_deliveries
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_admin_webhooks_updated_at
  BEFORE UPDATE ON public.admin_webhooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();