WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY lower(business_name), lower(coalesce(city,'')), lower(coalesce(address,'')), lower(coalesce(website,''))
           ORDER BY (logo_url IS NOT NULL) DESC, (description IS NOT NULL) DESC, (latitude IS NOT NULL) DESC, created_at ASC
         ) rn
  FROM public.businesses
  WHERE listing_status = 'live'
)
UPDATE public.businesses b
SET listing_status = 'duplicate'
FROM ranked r
WHERE b.id = r.id AND r.rn > 1;