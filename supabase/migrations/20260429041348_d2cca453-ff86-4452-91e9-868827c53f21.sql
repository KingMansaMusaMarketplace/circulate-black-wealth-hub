CREATE TABLE public.enterprise_seats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_seat_item_id TEXT,
  seat_count INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_enterprise_seats_owner ON public.enterprise_seats(owner_user_id);

ALTER TABLE public.enterprise_seats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their seats"
ON public.enterprise_seats
FOR SELECT
USING (auth.uid() = owner_user_id);

-- Validation trigger for seat_count range (avoid CHECK constraints per guidelines)
CREATE OR REPLACE FUNCTION public.validate_enterprise_seat_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.seat_count < 1 OR NEW.seat_count > 500 THEN
    RAISE EXCEPTION 'seat_count must be between 1 and 500';
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_validate_enterprise_seats
BEFORE INSERT OR UPDATE ON public.enterprise_seats
FOR EACH ROW EXECUTE FUNCTION public.validate_enterprise_seat_count();