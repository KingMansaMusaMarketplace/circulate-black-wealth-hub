
-- Trip type enum
DO $$ BEGIN
  CREATE TYPE public.noir_trip_type AS ENUM ('airport_pickup','airport_dropoff','hotel_pickup','hotel_dropoff','hotel_to_hotel','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.noir_hotel_partner_status AS ENUM ('pending','active','suspended','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.noir_concierge_role AS ENUM ('concierge','manager');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Hotel partners table
CREATE TABLE IF NOT EXISTS public.noir_hotel_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_name text NOT NULL,
  address_line1 text,
  address_city text,
  address_state text,
  address_zip text,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  website_url text,
  notes text,
  status public.noir_hotel_partner_status NOT NULL DEFAULT 'pending',
  billing_terms text NOT NULL DEFAULT 'per_ride',
  commission_rate numeric NOT NULL DEFAULT 0.10,
  approved_by uuid,
  approved_at timestamptz,
  rejection_reason text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.noir_hotel_partners ENABLE ROW LEVEL SECURITY;

-- Concierge users
CREATE TABLE IF NOT EXISTS public.noir_concierge_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  hotel_partner_id uuid NOT NULL REFERENCES public.noir_hotel_partners(id) ON DELETE CASCADE,
  role public.noir_concierge_role NOT NULL DEFAULT 'concierge',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, hotel_partner_id)
);

ALTER TABLE public.noir_concierge_users ENABLE ROW LEVEL SECURITY;

-- Add hotel/airport pivot columns to existing scheduled rides table
ALTER TABLE public.noire_scheduled_rides
  ADD COLUMN IF NOT EXISTS trip_type public.noir_trip_type NOT NULL DEFAULT 'other',
  ADD COLUMN IF NOT EXISTS flight_number text,
  ADD COLUMN IF NOT EXISTS hotel_partner_id uuid REFERENCES public.noir_hotel_partners(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS hotel_name_freeform text,
  ADD COLUMN IF NOT EXISTS booked_by_concierge_id uuid,
  ADD COLUMN IF NOT EXISTS passenger_count integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS luggage_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS meet_and_greet boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS guest_name text,
  ADD COLUMN IF NOT EXISTS guest_room_number text,
  ADD COLUMN IF NOT EXISTS special_instructions text;

CREATE INDEX IF NOT EXISTS idx_scheduled_rides_hotel_partner ON public.noire_scheduled_rides(hotel_partner_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_rides_scheduled_for ON public.noire_scheduled_rides(scheduled_for);

-- Helper: is user a concierge for a given hotel partner
CREATE OR REPLACE FUNCTION public.is_noir_concierge_for(_user_id uuid, _hotel_partner_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.noir_concierge_users
    WHERE user_id = _user_id AND hotel_partner_id = _hotel_partner_id AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_hotel_partner_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT hotel_partner_id FROM public.noir_concierge_users
  WHERE user_id = _user_id AND is_active = true;
$$;

-- RLS: hotel partners
CREATE POLICY "Admins manage hotel partners"
ON public.noir_hotel_partners FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit hotel partner application"
ON public.noir_hotel_partners FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'pending');

CREATE POLICY "Concierges view their own hotel partner"
ON public.noir_hotel_partners FOR SELECT
TO authenticated
USING (public.is_noir_concierge_for(auth.uid(), id));

-- RLS: concierge users
CREATE POLICY "Admins manage concierge users"
ON public.noir_concierge_users FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view their own concierge memberships"
ON public.noir_concierge_users FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- RLS: scheduled rides — allow concierges to see and book for their hotel
-- (Assumes existing rider/admin policies on noire_scheduled_rides; we add concierge-scoped ones.)
DO $$ BEGIN
  CREATE POLICY "Concierges view their hotel rides"
  ON public.noire_scheduled_rides FOR SELECT
  TO authenticated
  USING (
    hotel_partner_id IS NOT NULL
    AND public.is_noir_concierge_for(auth.uid(), hotel_partner_id)
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Concierges create rides for their hotel"
  ON public.noire_scheduled_rides FOR INSERT
  TO authenticated
  WITH CHECK (
    hotel_partner_id IS NOT NULL
    AND public.is_noir_concierge_for(auth.uid(), hotel_partner_id)
    AND booked_by_concierge_id = auth.uid()
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- updated_at triggers
CREATE TRIGGER trg_noir_hotel_partners_updated
BEFORE UPDATE ON public.noir_hotel_partners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_noir_concierge_users_updated
BEFORE UPDATE ON public.noir_concierge_users
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
