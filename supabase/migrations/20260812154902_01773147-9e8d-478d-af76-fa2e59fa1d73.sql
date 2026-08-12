INSERT INTO public.businesses (
  business_name, name, normalized_name, description, category,
  website, website_domain, banner_url, logo_url,
  is_verified, listing_status, is_founding_sponsor, founding_sponsor_since,
  subscription_status, subscription_start_date, subscription_end_date,
  owner_id, average_rating, review_count, location_type, slug, referred_at
) VALUES (
  'Kimi Ellen', 'Kimi Ellen', 'kimi ellen',
  'Kimi Ellen is a Certified Public Accountant, public speaker, and author helping individuals and business owners build financial confidence through accounting expertise, education, and inspiration.',
  'Professional Services',
  'https://kimiellen.com/', 'kimiellen.com',
  'https://img1.wsimg.com/isteam/ip/38014f69-1b17-4231-a2ba-d47d342e7202/kimi%20headshot%202%20cropped-10c4e7a.png',
  'https://img1.wsimg.com/isteam/ip/38014f69-1b17-4231-a2ba-d47d342e7202/kimi%20headshot%202%20cropped-10c4e7a.png',
  true, 'live', true, now(),
  'trial', now(), now() + interval '30 days',
  'bd72a75e-1310-4f40-9c74-380443b09d9b', 5.00, 0, 'independent',
  'kimi-ellen-cpa', now()
);