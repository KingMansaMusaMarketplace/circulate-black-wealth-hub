
-- Create a restricted public view for noir_drivers that excludes PII
CREATE OR REPLACE VIEW public.noir_drivers_public AS
  SELECT 
    id, 
    user_id,
    full_name,
    vehicle_make, 
    vehicle_model, 
    vehicle_year,
    vehicle_color,
    license_plate, 
    current_lat, 
    current_lng, 
    current_heading,
    rating_average,
    total_rides, 
    profile_photo_url, 
    is_online,
    is_approved,
    is_active,
    created_at,
    updated_at
  FROM noir_drivers
  WHERE is_online = true AND is_approved = true;

-- Drop the overly broad RLS policy
DROP POLICY IF EXISTS "Online drivers visible to all authenticated" ON noir_drivers;

-- Create a tighter policy: only the driver themselves can read their full record
CREATE POLICY "Drivers can view own record"
  ON noir_drivers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
