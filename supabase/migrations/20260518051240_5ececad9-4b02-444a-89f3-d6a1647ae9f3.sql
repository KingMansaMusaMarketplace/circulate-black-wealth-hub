INSERT INTO public.vacation_properties (
  host_id, title, description, property_type, listing_mode,
  address, city, state, zip_code, country,
  bedrooms, bathrooms, max_guests,
  monthly_rent, base_nightly_rate, base_monthly_rate, photos, amenities, is_verified, is_active
) VALUES
(
  '7579018d-50bc-4aad-b014-de2aac02f0b5',
  'Bronzeville Pro Office Suite',
  '1,200 sf private office suite on the 4th floor with skyline views, kitchenette, and conference room access. Black-owned commercial building, flexible 1-2 year leases.',
  'office_space', 'yearly_lease',
  '4321 S King Dr', 'Chicago', 'IL', '60653', 'USA',
  0, 1, 12,
  2400, 80, 2400,
  '["https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200","https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200"]'::jsonb,
  '["Wifi","Conference room","Kitchenette","Elevator","24/7 access","Parking"]'::jsonb,
  true, true
),
(
  '7579018d-50bc-4aad-b014-de2aac02f0b5',
  'West End Flex Warehouse',
  '6,500 sf flex warehouse with one dock-high door, 18ft clear height, 800 sf office buildout, and fenced yard. Ideal for light distribution or makers.',
  'warehouse', 'yearly_lease',
  '1100 Lee St SW', 'Atlanta', 'GA', '30310', 'USA',
  0, 2, 20,
  5200, 175, 5200,
  '["https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200","https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200"]'::jsonb,
  '["Dock door","Office buildout","Fenced yard","3-phase power","Sprinkler","Parking"]'::jsonb,
  true, true
);