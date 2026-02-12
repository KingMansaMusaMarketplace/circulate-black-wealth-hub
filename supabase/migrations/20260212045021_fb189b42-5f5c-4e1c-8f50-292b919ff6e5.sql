-- Fix HBCU schools with logo/clearbit images used as banners

-- Cheyney University - downloaded Wikimedia campus photo
UPDATE public.businesses SET 
  banner_url = '/images/hbcu/cheyney-university-library.jpg',
  updated_at = now()
WHERE id = '444d75a7-aa10-420c-9389-2033e84d34c8';

-- Rust College - downloaded Wikimedia admin building photo
UPDATE public.businesses SET 
  banner_url = '/images/hbcu/rust-college-admin.jpg',
  updated_at = now()
WHERE id = '57cfcaa9-2763-40da-b7f9-fab5cb5e3870';

-- Interdenominational Theological Center - use Wikipedia campus image
UPDATE public.businesses SET 
  banner_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Robert_W._Woodruff_Library%2C_AUC%2C_Atlanta%2C_GA.jpg/1280px-Robert_W._Woodruff_Library%2C_AUC%2C_Atlanta%2C_GA.jpg',
  updated_at = now()
WHERE id = 'ba19ed9b-8227-4423-9b69-7d9d5ccd5bdb';

-- Knoxville College - use Wikipedia campus image  
UPDATE public.businesses SET 
  banner_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Knoxville_College_Historic_District.jpg/1280px-Knoxville_College_Historic_District.jpg',
  updated_at = now()
WHERE id = 'f34a3b48-0757-4efe-a061-f9f80a6daa76';

-- Prairie View A&M - use Wikipedia campus image
UPDATE public.businesses SET 
  banner_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PVAMU_Old_Science_Bldg.jpg/1280px-PVAMU_Old_Science_Bldg.jpg',
  updated_at = now()
WHERE id = 'd78a9046-5bc5-4ac3-8286-f74e118addd4';

-- Huston-Tillotson University - use Wikipedia campus image
UPDATE public.businesses SET 
  banner_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Huston-Tillotson_University_campus.jpg/1280px-Huston-Tillotson_University_campus.jpg',
  updated_at = now()
WHERE id = 'af9e81a9-4b66-498e-a0f8-530dc4e341c1';

-- Miles College - fix favicon logo with Wikipedia seal
UPDATE public.businesses SET 
  logo_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/Miles_College_seal.svg/250px-Miles_College_seal.svg.png',
  updated_at = now()
WHERE id = '9b0a643f-763e-4a20-aa77-32ec9b16a45e';

-- Arkansas Baptist College - banner is a tiny logo, use campus photo
UPDATE public.businesses SET 
  banner_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ABC_Foundations_Hall.jpg/1280px-ABC_Foundations_Hall.jpg',
  updated_at = now()
WHERE id = 'bb542967-c758-47bf-9856-202e5d88c557';

-- Bluefield State University - banner has "logo" in name
UPDATE public.businesses SET 
  banner_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Conley_Hall_Bluefield_State_University.jpg/1280px-Conley_Hall_Bluefield_State_University.jpg',
  updated_at = now()
WHERE id = '33620e6a-1916-4871-b09c-4c93a85c6cab';

-- Selma University - clearbit banner
UPDATE public.businesses SET 
  banner_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Selma_University_campus.jpg/1280px-Selma_University_campus.jpg',
  updated_at = now()
WHERE id = 'c2b81768-e95e-4113-978e-a21e14ffdc20';

-- University of Arkansas at Pine Bluff - banner has "logo" in name
UPDATE public.businesses SET 
  banner_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/UAPB_campus_building.jpg/1280px-UAPB_campus_building.jpg',
  updated_at = now()
WHERE id = 'c48e9df0-6ff3-48ef-880c-e667619951e8';

-- West Virginia State University - banner has "logo" in name
UPDATE public.businesses SET 
  banner_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Ferrell_Hall_WV_State_University.jpg/1280px-Ferrell_Hall_WV_State_University.jpg',
  updated_at = now()
WHERE id = '247fec18-32fb-4611-8864-0a7d1f2846b2';

-- Wilberforce University - banner is a logo image
UPDATE public.businesses SET 
  banner_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Wilberforce_University%2C_Shorter_Hall.jpg/1280px-Wilberforce_University%2C_Shorter_Hall.jpg',
  updated_at = now()
WHERE id = '5dd9b2c3-a366-41d6-a8fc-ead855a3c25c';

-- Shorter College - banner is a logo
UPDATE public.businesses SET 
  banner_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Shorter_College_campus.jpg/1280px-Shorter_College_campus.jpg',
  updated_at = now()
WHERE id = '0ca92755-8728-4b34-9c7c-760edb757113';