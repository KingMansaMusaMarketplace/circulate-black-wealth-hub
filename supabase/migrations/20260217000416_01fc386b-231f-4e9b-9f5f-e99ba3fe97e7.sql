
-- Update HEALing Community Health with logo and banner
UPDATE public.businesses
SET 
  logo_url = 'https://healatlanta.org/wp-content/uploads/2022/12/Healing-Community-Health-logo.svg',
  banner_url = 'https://healatlanta.org/wp-content/uploads/2025/01/hours-icon-green.svg',
  phone = '404-564-7749',
  address = '3915 Cascade Rd, Suites T-90 and T-115',
  zip_code = '30331',
  updated_at = now()
WHERE name = 'HEALing Community Health';

-- Update Southside Medical Center with logo and banner
UPDATE public.businesses
SET 
  logo_url = 'https://southsidemedical.net/wp-content/uploads/2018/01/bg2.jpg',
  banner_url = 'https://southsidemedical.net/wp-content/uploads/2018/01/bg2.jpg',
  updated_at = now()
WHERE name = 'Southside Medical Center';

-- Update Carl Bean Men's Health with logo (from screenshot - red hexagon logo)
UPDATE public.businesses
SET 
  logo_url = 'https://menshealthcenter.org/wp-content/uploads/2021/11/2023-sliders-2000x400-symposium-2024.jpg',
  updated_at = now()
WHERE name = 'Carl Bean Men''s Health & Wellness Center';
