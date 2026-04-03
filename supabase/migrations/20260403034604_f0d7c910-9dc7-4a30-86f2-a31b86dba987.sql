
UPDATE businesses 
SET 
  address = '174 E. Eagle St.',
  city = 'Buffalo',
  state = 'NY',
  zip_code = '14203',
  latitude = 42.8846,
  longitude = -78.8690,
  description = 'Durham Memorial AME Zion Church is a historic African Methodist Episcopal Zion congregation located at 174 E. Eagle St. in Buffalo, New York, serving the community with worship, outreach, and spiritual growth programs.',
  updated_at = now()
WHERE id = '87c17ea8-cc8a-4e54-9fb5-dd8ce5502db2';
