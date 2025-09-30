-- Create business services/offerings table
CREATE TABLE IF NOT EXISTS business_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES business_services(id) ON DELETE SET NULL,
  booking_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  amount NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL DEFAULT 0,
  business_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  payment_intent_id TEXT,
  stripe_charge_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  notes TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create business availability table
CREATE TABLE IF NOT EXISTS business_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(business_id, day_of_week)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_services_business ON business_services(business_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_bookings_business ON bookings(business_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_business_availability_business ON business_availability(business_id);

-- Enable RLS
ALTER TABLE business_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_services
CREATE POLICY "Anyone can view active services"
  ON business_services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Business owners can manage their services"
  ON business_services FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_services.business_id
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Customers can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Business owners can view their bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = bookings.business_id
    )
  );

CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can cancel their bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = customer_id AND status IN ('pending', 'confirmed'))
  WITH CHECK (status = 'cancelled');

CREATE POLICY "Business owners can update their bookings"
  ON bookings FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = bookings.business_id
    )
  );

-- RLS Policies for business_availability
CREATE POLICY "Anyone can view availability"
  ON business_availability FOR SELECT
  USING (true);

CREATE POLICY "Business owners can manage availability"
  ON business_availability FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_availability.business_id
    )
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_timestamp
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();

CREATE TRIGGER update_services_timestamp
  BEFORE UPDATE ON business_services
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();