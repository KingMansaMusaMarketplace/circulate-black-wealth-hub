INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'Kendall Karsen''s Upscale Soul Food', 'Kendall Karsen''s Upscale Soul Food',
  'Gourmet soul food in South Dallas by Chef Kevin Winston, serving premium fried fish, loaded potatoes, oxtails, and elevated Southern comfort dishes with pride',
  'Restaurant',
  '3939 S Polk St, Ste 305', 'Dallas', 'TX', '75224',
  '(214) 376-2171', 'info@kendallkarsens.com', 'https://sites.google.com/view/kendallkarsensupscalesoulfood',
  true, 4.7, 267,
  32.7152, -96.8025,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Alta Adams', 'Alta Adams',
  'Celebrated West Adams restaurant by Chef Keith Corbin, offering innovative California soul food and craft cocktails in a vibrant community-centered space in historic Los Angeles',
  'Restaurant',
  '5359 W Adams Blvd', 'Los Angeles', 'CA', '90016',
  '(323) 571-4999', 'info@altaadams.com', 'https://altaadams.com',
  true, 4.7, 580,
  34.0303, -118.3616,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);