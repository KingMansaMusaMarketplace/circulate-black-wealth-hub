
-- Update remaining HBCU schools with authentic logos from Wikipedia/Wikimedia and official branding pages

-- Alabama State University - Wikipedia seal
UPDATE public.businesses SET 
  logo_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/Alabama_State_University_seal.svg/250px-Alabama_State_University_seal.svg.png',
  updated_at = now()
WHERE id = '9da5f112-fd8d-4f28-9222-d2b71dd7b260';

-- Howard University - Wikipedia seal
UPDATE public.businesses SET 
  logo_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Howard_University_seal.svg/250px-Howard_University_seal.svg.png',
  updated_at = now()
WHERE id = '62e32070-31e1-4186-a21f-b3b80b961be5';

-- Claflin University - Wikipedia seal PNG
UPDATE public.businesses SET 
  logo_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Claflin_University_Seal.png/250px-Claflin_University_Seal.png',
  updated_at = now()
WHERE id = '84be34ce-6243-4a74-be60-e7e57037c4aa';

-- Miles College - official branding page logo
UPDATE public.businesses SET 
  logo_url = 'https://www.miles.edu/sites/default/files/styles/1200_width/public/2022-09/Screen%20Shot%202022-09-07%20at%2010.15.52%20AM.png?itok=w7YxwSGJ',
  updated_at = now()
WHERE id = 'b3d42f27-e0d0-4975-b253-bce409e1e67f';

-- North Carolina Central University - Wikipedia seal
UPDATE public.businesses SET 
  logo_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/4/45/North_Carolina_Central_University_seal.svg/250px-North_Carolina_Central_University_seal.svg.png',
  updated_at = now()
WHERE id = 'faa8104c-21e2-4e5a-9fa6-e80ab775a830';

-- Shaw University - Wikimedia Commons logo PNG
UPDATE public.businesses SET 
  logo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Shaw_university_logo.png/960px-Shaw_university_logo.png',
  updated_at = now()
WHERE id = '185bea7f-b9fd-4427-a122-7c4d2a61d07c';

-- Jarvis Christian University - Wikipedia campus entrance photo as banner
UPDATE public.businesses SET 
  banner_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Jarvis_Christian_University_Entrance.jpg/1280px-Jarvis_Christian_University_Entrance.jpg',
  updated_at = now()
WHERE id = '041ff4ed-bb4e-4d08-bdec-a2897224bed3';
