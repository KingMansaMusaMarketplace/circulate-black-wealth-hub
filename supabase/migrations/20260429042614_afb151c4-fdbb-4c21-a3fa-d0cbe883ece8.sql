CREATE TABLE public.enterprise_account_managers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID NOT NULL UNIQUE,
  manager_name TEXT NOT NULL,
  manager_email TEXT NOT NULL,
  manager_phone TEXT,
  manager_photo_url TEXT,
  manager_timezone TEXT DEFAULT 'America/Chicago',
  calendly_url TEXT,
  notes TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_enterprise_am_owner ON public.enterprise_account_managers(owner_user_id);

ALTER TABLE public.enterprise_account_managers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their account manager"
ON public.enterprise_account_managers
FOR SELECT
USING (auth.uid() = owner_user_id);

CREATE POLICY "Admins can manage all account managers"
ON public.enterprise_account_managers
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_enterprise_am_updated
BEFORE UPDATE ON public.enterprise_account_managers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Concierge requests / SLA tickets from Enterprise customers
CREATE TABLE public.enterprise_concierge_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'open',
  responded_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_concierge_owner ON public.enterprise_concierge_requests(owner_user_id);
CREATE INDEX idx_concierge_status ON public.enterprise_concierge_requests(status);

ALTER TABLE public.enterprise_concierge_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their requests"
ON public.enterprise_concierge_requests
FOR SELECT
USING (auth.uid() = owner_user_id);

CREATE POLICY "Owners can create their requests"
ON public.enterprise_concierge_requests
FOR INSERT
WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Admins can manage all concierge requests"
ON public.enterprise_concierge_requests
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.validate_concierge_request()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.priority NOT IN ('low','normal','high','urgent') THEN
    RAISE EXCEPTION 'Invalid priority: %', NEW.priority;
  END IF;
  IF NEW.status NOT IN ('open','in_progress','waiting','resolved','closed') THEN
    RAISE EXCEPTION 'Invalid status: %', NEW.status;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_concierge_validate
BEFORE INSERT OR UPDATE ON public.enterprise_concierge_requests
FOR EACH ROW EXECUTE FUNCTION public.validate_concierge_request();