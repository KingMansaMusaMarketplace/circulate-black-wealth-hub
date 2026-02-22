
-- Noir.travel Driver Profiles
CREATE TABLE public.noir_drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  vehicle_color TEXT,
  license_plate TEXT,
  drivers_license_number TEXT,
  profile_photo_url TEXT,
  is_active BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  current_heading DOUBLE PRECISION,
  current_speed DOUBLE PRECISION,
  location_updated_at TIMESTAMPTZ,
  rating_average NUMERIC(3,2) DEFAULT 5.00,
  total_rides INTEGER DEFAULT 0,
  total_earnings NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Noir.travel Rides
CREATE TABLE public.noir_rides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rider_user_id UUID NOT NULL REFERENCES auth.users(id),
  driver_id UUID REFERENCES public.noir_drivers(id),
  pickup_address TEXT NOT NULL,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  dropoff_address TEXT NOT NULL,
  dropoff_lat DOUBLE PRECISION,
  dropoff_lng DOUBLE PRECISION,
  estimated_distance_miles NUMERIC(8,2),
  estimated_duration_minutes INTEGER,
  estimated_fare NUMERIC(8,2),
  actual_fare NUMERIC(8,2),
  platform_fee NUMERIC(8,2),
  driver_payout NUMERIC(8,2),
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'driver_en_route', 'arrived', 'in_progress', 'completed', 'cancelled')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  pickup_at TIMESTAMPTZ,
  dropoff_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  rider_rating INTEGER CHECK (rider_rating BETWEEN 1 AND 5),
  driver_rating INTEGER CHECK (driver_rating BETWEEN 1 AND 5),
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Driver location history for analytics
CREATE TABLE public.noir_driver_location_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID NOT NULL REFERENCES public.noir_drivers(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES public.noir_rides(id),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  heading DOUBLE PRECISION,
  speed DOUBLE PRECISION,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.noir_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noir_rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noir_driver_location_history ENABLE ROW LEVEL SECURITY;

-- Driver policies
CREATE POLICY "Drivers can view own profile" ON public.noir_drivers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Drivers can update own profile" ON public.noir_drivers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Drivers can insert own profile" ON public.noir_drivers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Online drivers visible to all authenticated" ON public.noir_drivers
  FOR SELECT USING (is_online = true AND is_approved = true AND auth.uid() IS NOT NULL);

-- Ride policies
CREATE POLICY "Riders can view own rides" ON public.noir_rides
  FOR SELECT USING (auth.uid() = rider_user_id);

CREATE POLICY "Drivers can view assigned rides" ON public.noir_rides
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.noir_drivers WHERE id = noir_rides.driver_id AND user_id = auth.uid())
  );

CREATE POLICY "Riders can create rides" ON public.noir_rides
  FOR INSERT WITH CHECK (auth.uid() = rider_user_id);

CREATE POLICY "Riders can update own rides" ON public.noir_rides
  FOR UPDATE USING (auth.uid() = rider_user_id);

CREATE POLICY "Drivers can update assigned rides" ON public.noir_rides
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.noir_drivers WHERE id = noir_rides.driver_id AND user_id = auth.uid())
  );

-- Location history policies
CREATE POLICY "Drivers can insert own locations" ON public.noir_driver_location_history
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.noir_drivers WHERE id = driver_id AND user_id = auth.uid())
  );

CREATE POLICY "Ride participants can view locations" ON public.noir_driver_location_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.noir_rides r
      WHERE r.id = ride_id
      AND (r.rider_user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.noir_drivers d WHERE d.id = r.driver_id AND d.user_id = auth.uid()))
    )
  );

-- Indexes
CREATE INDEX idx_noir_drivers_online ON public.noir_drivers(is_online, is_approved) WHERE is_online = true;
CREATE INDEX idx_noir_drivers_location ON public.noir_drivers(current_lat, current_lng) WHERE is_online = true;
CREATE INDEX idx_noir_rides_status ON public.noir_rides(status) WHERE status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_noir_rides_rider ON public.noir_rides(rider_user_id);
CREATE INDEX idx_noir_rides_driver ON public.noir_rides(driver_id);
CREATE INDEX idx_noir_location_history_driver ON public.noir_driver_location_history(driver_id, recorded_at DESC);

-- Triggers for updated_at
CREATE TRIGGER update_noir_drivers_updated_at
  BEFORE UPDATE ON public.noir_drivers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_noir_rides_updated_at
  BEFORE UPDATE ON public.noir_rides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
