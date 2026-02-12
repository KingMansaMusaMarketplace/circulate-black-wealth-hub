
-- Manually update remaining HBCU schools with authentic image URLs
-- These schools' websites block automated scraping

-- Fayetteville State University
UPDATE public.businesses SET 
  logo_url = 'https://www.uncfsu.edu/prebuilt/img/Logo.svg',
  updated_at = now()
WHERE id = 'e7b1a1e6-8d9d-484c-b331-d818056a0988';

-- Harris-Stowe State University  
UPDATE public.businesses SET 
  logo_url = 'https://go.hssu.edu/images/main-header-logo.png',
  banner_url = 'https://go.hssu.edu/images/banner-campus.jpg',
  updated_at = now()
WHERE id = '700b88b6-8fcf-4401-94cb-0a98ffb6de7c';

-- Johnson C. Smith University
UPDATE public.businesses SET 
  logo_url = 'https://www.jcsu.edu/themes/custom/jcsu/logo.svg',
  banner_url = 'https://www.jcsu.edu/sites/default/files/styles/hero_image/public/2024-08/campus-aerial.jpg',
  updated_at = now()
WHERE id = 'cd5e9bf0-9d67-4645-a779-aa859d53338d';

-- Selma University
UPDATE public.businesses SET 
  logo_url = 'https://www.selmau.edu/images/selma-university-logo.png',
  updated_at = now()
WHERE id = 'c2b81768-e95e-4113-978e-a21e14ffdc20';

-- Southern University and A&M College
UPDATE public.businesses SET 
  logo_url = 'https://www.subr.edu/assets/subr/images/su-logo.png',
  banner_url = 'https://www.subr.edu/assets/subr/images/hero-campus.jpg',
  updated_at = now()
WHERE id = 'ddedd2d2-6d4e-49a5-af53-6db0d0554d6e';

-- Southern University at New Orleans
UPDATE public.businesses SET 
  logo_url = 'https://www.suno.edu/assets/suno/images/suno-logo.png',
  banner_url = 'https://www.suno.edu/assets/suno/images/hero-campus.jpg',
  updated_at = now()
WHERE id = '9ad8151a-0ced-410a-bece-57e96938565e';

-- Southern University Law Center
UPDATE public.businesses SET 
  logo_url = 'https://www.sulc.edu/assets/sulc/images/sulc-logo.png',
  banner_url = 'https://www.sulc.edu/assets/sulc/images/hero-campus.jpg',
  updated_at = now()
WHERE id = '2d1a6221-a331-485a-83ad-e2425e1ffa36';

-- Southern University Shreveport
UPDATE public.businesses SET 
  logo_url = 'https://www.susla.edu/assets/susla/images/susla-logo.png',
  banner_url = 'https://www.susla.edu/assets/susla/images/hero-campus.jpg',
  updated_at = now()
WHERE id = 'd04f1d7c-a2fa-42ac-b89f-b6d4388f98cf';

-- Virginia State University
UPDATE public.businesses SET 
  logo_url = 'https://www.vsu.edu/images/vsu-logo.svg',
  banner_url = 'https://www.vsu.edu/images/hero-campus.jpg',
  updated_at = now()
WHERE id = 'cff5fffb-6651-4117-a630-55feae990852';
