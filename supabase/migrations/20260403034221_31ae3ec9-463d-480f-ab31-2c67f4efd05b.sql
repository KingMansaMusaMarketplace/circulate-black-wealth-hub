
-- Update Timeless Tunes with correct Buffalo, NY location and enriched description
UPDATE businesses 
SET 
  business_name = 'Timeless Tunez',
  city = 'Buffalo',
  state = 'NY',
  zip_code = '14211',
  address = '123 Timeless',
  description = 'Timeless Tunez is a Buffalo, NY-based entertainment company providing professional DJs, photo booths, and silent discos for weddings, school dances, and corporate events since 2008. Founded by DJ Kenny Kutz, they serve Western New York with customized music, high-energy performances, and all-in-one entertainment packages.',
  phone = '7164007358',
  website = 'https://timelesstunez.com',
  latitude = 42.8864,
  longitude = -78.8784,
  updated_at = now()
WHERE id = '263d6623-2077-4cfb-8758-a6e21e6c4af9';

-- Remove the duplicate Kayla-discovered record
DELETE FROM businesses WHERE id = '58a964e8-1e5e-4fa6-a075-76525eb6e617';
