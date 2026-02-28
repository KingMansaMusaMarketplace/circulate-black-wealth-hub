
-- =====================================================
-- NOIRE RIDESHARE ENHANCEMENTS: 4 Features
-- =====================================================

-- 1. FAVORITE DRIVER BOOKING
CREATE TABLE public.noire_favorite_drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rider_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.noir_drivers(id) ON DELETE CASCADE,
  nickname TEXT,
  rides_together INTEGER DEFAULT 0,
  last_ride_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(rider_user_id, driver_id)
);

CREATE TABLE public.noire_scheduled_rides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rider_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_driver_id UUID REFERENCES public.noir_drivers(id),
  pickup_address TEXT NOT NULL,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  dropoff_address TEXT NOT NULL,
  dropoff_lat DOUBLE PRECISION,
  dropoff_lng DOUBLE PRECISION,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'driver_assigned', 'completed', 'cancelled')),
  estimated_fare NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. COMMUNITY REWARDS INTEGRATION
CREATE TABLE public.noire_community_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_balance NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_earned NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_redeemed NUMERIC(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.noire_credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES public.noir_rides(id),
  business_id UUID REFERENCES public.businesses(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed')),
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. NOIRE RIDE IMPACT TRACKING (Social Impact Dashboard)
CREATE TABLE public.noire_ride_impact (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_rides INTEGER NOT NULL DEFAULT 0,
  total_fare_spent NUMERIC(12,2) NOT NULL DEFAULT 0,
  driver_earnings_supported NUMERIC(12,2) NOT NULL DEFAULT 0,
  community_businesses_visited INTEGER NOT NULL DEFAULT 0,
  community_credits_earned NUMERIC(10,2) NOT NULL DEFAULT 0,
  co2_saved_kg NUMERIC(8,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.noire_favorite_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noire_scheduled_rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noire_community_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noire_credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noire_ride_impact ENABLE ROW LEVEL SECURITY;

-- Favorite Drivers policies
CREATE POLICY "Users manage own favorites" ON public.noire_favorite_drivers
  FOR ALL USING (auth.uid() = rider_user_id) WITH CHECK (auth.uid() = rider_user_id);

-- Scheduled Rides policies
CREATE POLICY "Users manage own scheduled rides" ON public.noire_scheduled_rides
  FOR ALL USING (auth.uid() = rider_user_id) WITH CHECK (auth.uid() = rider_user_id);

CREATE POLICY "Preferred drivers view scheduled rides" ON public.noire_scheduled_rides
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.noir_drivers WHERE id = preferred_driver_id AND user_id = auth.uid())
  );

-- Community Credits policies
CREATE POLICY "Users view own credits" ON public.noire_community_credits
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Credit Transactions policies
CREATE POLICY "Users view own transactions" ON public.noire_credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own transactions" ON public.noire_credit_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ride Impact policies
CREATE POLICY "Users view own impact" ON public.noire_ride_impact
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_noire_fav_drivers_rider ON public.noire_favorite_drivers(rider_user_id);
CREATE INDEX idx_noire_scheduled_rides_rider ON public.noire_scheduled_rides(rider_user_id, scheduled_for);
CREATE INDEX idx_noire_scheduled_rides_driver ON public.noire_scheduled_rides(preferred_driver_id);
CREATE INDEX idx_noire_credits_user ON public.noire_community_credits(user_id);
CREATE INDEX idx_noire_credit_txns_user ON public.noire_credit_transactions(user_id, created_at DESC);
CREATE INDEX idx_noire_ride_impact_user ON public.noire_ride_impact(user_id);

-- Triggers
CREATE TRIGGER update_noire_scheduled_rides_updated_at
  BEFORE UPDATE ON public.noire_scheduled_rides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_noire_community_credits_updated_at
  BEFORE UPDATE ON public.noire_community_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_noire_ride_impact_updated_at
  BEFORE UPDATE ON public.noire_ride_impact
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
