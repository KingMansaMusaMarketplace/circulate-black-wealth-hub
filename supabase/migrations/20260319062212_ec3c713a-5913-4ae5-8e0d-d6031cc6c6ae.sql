INSERT INTO businesses (
  id, owner_id, business_name, name, description, category,
  address, city, state, zip_code, website,
  logo_url, banner_url, latitude, longitude,
  is_verified, listing_status
) VALUES (
  gen_random_uuid(),
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'Vista Equity Partners',
  'Vista Equity Partners',
  'Vista Equity Partners is a leading global investment firm focused exclusively on enterprise software, data, and technology-enabled businesses. Founded by Robert F. Smith, Vista manages over $107 billion in assets and has completed 650+ transactions over 25+ years. The firm partners with software leaders to enhance performance and maximize growth potential, serving institutional investors, wealth professionals, and founders/CEOs.',
  'Private Equity & Investment Management',
  '401 Congress Ave, Suite 3100',
  'Austin', 'TX', '78701',
  'https://www.vistaequitypartners.com',
  'https://www.vistaequitypartners.com/wp-content/themes/vista-equity/public/build/images/vista-logo-dark.svg',
  'https://www.vistaequitypartners.com/wp-content/uploads/2025/11/A-Software-Pioneer.webp',
  30.2672, -97.7431,
  true, 'live'
);