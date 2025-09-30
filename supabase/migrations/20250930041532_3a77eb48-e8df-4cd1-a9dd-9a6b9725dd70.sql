-- Fix search_path security warning
DROP FUNCTION IF EXISTS update_bookings_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_bookings_timestamp
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();

CREATE TRIGGER update_services_timestamp
  BEFORE UPDATE ON business_services
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();