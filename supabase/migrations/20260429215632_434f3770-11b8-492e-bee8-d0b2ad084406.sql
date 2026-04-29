INSERT INTO public.businesses (
  owner_id, business_name, name, description, category, city, state, website,
  is_verified, listing_status, average_rating, review_count
) VALUES (
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'The IT Architect Corporation',
  'The IT Architect Corporation',
  'The IT Architect Corporation (ITA) are information technology specialists who design, implement and manage the automation of business processes and building controls with innovative telecom and technology solutions. ITA configures, integrates, and supports comprehensive solutions customized to your business needs, transforming traditional or outdated processes into automated self-sustainable systems with transparency, accountability, and insightful metrics.',
  'Technology',
  'Chicago',
  'IL',
  'https://www.theitarchitect.com/',
  true,
  'live',
  5.0,
  12
)
RETURNING id;