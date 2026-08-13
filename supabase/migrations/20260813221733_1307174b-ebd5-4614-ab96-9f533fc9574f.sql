INSERT INTO public.businesses (
  owner_id, business_name, name, normalized_name, slug, category, description,
  address, city, state, zip_code, phone, email, website, website_domain,
  logo_url, banner_url, is_verified, listing_status, latitude, longitude,
  location_type, subscription_status
) VALUES (
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'Vinyasa Vibes Yoga Studio',
  'Vinyasa Vibes Yoga Studio',
  'vinyasa vibes yoga studio',
  'vinyasa-vibes-yoga-studio',
  'Fitness',
  'Black-owned yoga studio on Chicago''s far Southside making yoga a safe space for Black children, teens, and adults. Founded by certified instructor Bryanhdi Flagg, classes flow to R&B, Neo-Soul, and Hip-Hop. Offers R&B Slow Flow, Heated Slow Flow, R&B Stretch, kids and teens yoga, couples yoga, corporate yoga, yoga parties, and one-on-one sessions.',
  '3536 W. 95th Street',
  'Evergreen Park',
  'IL',
  '60805',
  '(414) 397-3200',
  'bryanhdi@vinyasavibesyogastudio.com',
  'https://www.vinyasavibesyogastudio.com/',
  'vinyasavibesyogastudio.com',
  'https://static.wixstatic.com/media/29a995_4acec604fe3347a2b3d1c3234dd946f6~mv2.png/v1/fill/w_928,h_993,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/29a995_4acec604fe3347a2b3d1c3234dd946f6~mv2.png',
  'https://static.wixstatic.com/media/29a995_eda9c4ea5450479a9846c08b30403201~mv2.jpg/v1/fill/w_1357,h_649,al_c,q_85,enc_avif,quality_auto/29a995_eda9c4ea5450479a9846c08b30403201~mv2.jpg',
  true,
  'live',
  41.7208,
  -87.7128,
  'independent',
  'trial'
)
ON CONFLICT DO NOTHING;