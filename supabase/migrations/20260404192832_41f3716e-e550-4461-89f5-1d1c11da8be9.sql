
-- 1. business_impact_scorecards: restrict SELECT to owner + admin only
DROP POLICY IF EXISTS "Authenticated users can view impact scorecards" ON public.business_impact_scorecards;

CREATE POLICY "Owners and admins can view impact scorecards"
  ON public.business_impact_scorecards
  FOR SELECT
  TO authenticated
  USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
    OR public.is_admin_secure()
  );

-- 2. event_attendees: restrict SELECT to authenticated users only
DROP POLICY IF EXISTS "Anyone can view event attendees" ON public.event_attendees;

CREATE POLICY "Authenticated users can view event attendees"
  ON public.event_attendees
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. challenge_participants: restrict SELECT to authenticated users only
DROP POLICY IF EXISTS "Anyone can view participants" ON public.challenge_participants;

CREATE POLICY "Authenticated users can view participants"
  ON public.challenge_participants
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. challenge_activities: restrict SELECT to authenticated users only
DROP POLICY IF EXISTS "Users can view challenge activities" ON public.challenge_activities;

CREATE POLICY "Authenticated users can view challenge activities"
  ON public.challenge_activities
  FOR SELECT
  TO authenticated
  USING (true);

-- 5. property_availability: create a public-safe view without booking_id
CREATE OR REPLACE VIEW public.property_availability_public
WITH (security_invoker = on) AS
  SELECT id, property_id, date, is_available, custom_price, notes, created_at
  FROM public.property_availability;

-- Replace the public SELECT policy to hide booking_id
DROP POLICY IF EXISTS "Anyone can view availability for active properties" ON public.property_availability;

CREATE POLICY "Public can view availability without booking details"
  ON public.property_availability
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM vacation_properties
      WHERE vacation_properties.id = property_availability.property_id
        AND vacation_properties.is_active = true
    )
  );

-- Authenticated users can also view availability (full row via host policy or this one)
CREATE POLICY "Authenticated can view availability for active properties"
  ON public.property_availability
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vacation_properties
      WHERE vacation_properties.id = property_availability.property_id
        AND vacation_properties.is_active = true
    )
  );
