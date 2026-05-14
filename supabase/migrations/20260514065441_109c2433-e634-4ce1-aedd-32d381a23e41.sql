
UPDATE public.businesses
SET slug = public.build_business_slug(coalesce(name, business_name), city, id)
WHERE slug IS NULL AND id IN (
  SELECT id FROM public.businesses WHERE slug IS NULL ORDER BY id LIMIT 10000
);
