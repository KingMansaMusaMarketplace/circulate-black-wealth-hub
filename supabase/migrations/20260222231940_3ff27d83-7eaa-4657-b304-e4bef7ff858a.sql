UPDATE public.businesses 
SET 
  city = 'Lincoln University',
  state = 'PA',
  address = '1570 Baltimore Pike',
  description = 'Founded in 1854, Lincoln University is the nation''s first degree-granting historically Black college and university (HBCU). Located in Chester County, Pennsylvania, Lincoln has a rich legacy of producing leaders including Thurgood Marshall and Langston Hughes. The university offers undergraduate and graduate programs in arts, sciences, business, and human services.',
  updated_at = now()
WHERE id = 'af097bb0-7f38-4fa1-86ae-0d26c98a09ae';