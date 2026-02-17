
-- Commonwealth National Bank - local screenshot hero
UPDATE public.businesses 
SET banner_url = '/images/businesses/commonwealth-national-bank-hero.png', updated_at = now()
WHERE id = '0cbf9a9d-60a8-4142-8c03-2f83589735e5';

-- Liberty Bank & Trust (SVG logo record) - local screenshot hero
UPDATE public.businesses 
SET banner_url = '/images/businesses/liberty-bank-hero.png', updated_at = now()
WHERE id = '5e7de452-7a43-4008-8119-f4c5e67292bd';

-- Liberty Bank & Trust (local card records) - same hero
UPDATE public.businesses 
SET banner_url = '/images/businesses/liberty-bank-hero.png', updated_at = now()
WHERE id IN ('b6a0e5ee-38ff-4991-8e14-1113d97d8201', '2102731b-e5cb-4504-8ed2-4d2b5b2a9da1');

-- Unity National Bank - local screenshot hero
UPDATE public.businesses 
SET banner_url = '/images/businesses/unity-national-bank-hero.png', updated_at = now()
WHERE id = 'adace47f-9f23-44c4-aefd-355ff6eab220';

-- M&F Bank - local screenshot hero
UPDATE public.businesses 
SET banner_url = '/images/businesses/mf-bank-hero.png', updated_at = now()
WHERE id = 'd7d5f08d-7b40-4141-8485-d1ae9d80e6cd';

-- Optus Bank - use video poster from their Wix site (family with bicycle)
UPDATE public.businesses 
SET banner_url = 'https://static.wixstatic.com/media/c4fe82_e45dd805c32447e18ca459bfeeb5f3caf000.jpg/v1/fill/w_1920,h_1080,al_c,q_85,usm_0.33_1.00_0.00,enc_avif,quality_auto/c4fe82_e45dd805c32447e18ca459bfeeb5f3caf000.jpg', updated_at = now()
WHERE id = '0eab419f-8921-455c-b945-aa7371c0103e';

-- Harbor Bank (local card record) - use hero slider image
UPDATE public.businesses 
SET banner_url = 'https://www.theharborbank.com/Portals/TheHarborBankMaryland/FisSlider-Images/HBM_Homepage_slider_images3.jpg', updated_at = now()
WHERE id = '951e24f5-4a7a-4b32-87a3-5c02f9c0c9f9';

-- Harbor Bank (other record) - same hero
UPDATE public.businesses 
SET banner_url = 'https://www.theharborbank.com/Portals/TheHarborBankMaryland/FisSlider-Images/HBM_Homepage_slider_images3.jpg', updated_at = now()
WHERE id = '8d60bf8d-c333-40e0-b856-d13fcd14db26';

-- First Independence Bank - use their actual hero banner
UPDATE public.businesses 
SET banner_url = 'https://www.firstindependence.com//wp-content/uploads/2026/02/img_1770766860764_777.png', updated_at = now()
WHERE id = 'abaa9e48-72c4-4494-a6a8-e8a3d1b05237';

-- OneUnited Bank (sample/old record) - use same hero as the other OneUnited record
UPDATE public.businesses 
SET banner_url = 'https://www.oneunited.com/core/content/uploads/2025/05/Homepage-Block-1-1-464x1024.webp', updated_at = now()
WHERE id = '1ab54e23-df01-45bf-8f52-0165b142b755';

-- Citizens Trust Bank (old Bank category record) - use same as the other CTB record
UPDATE public.businesses 
SET banner_url = 'https://ctbconnect.com/wp-content/uploads/2025/06/ctb-online-banking.png', updated_at = now()
WHERE id = 'b3454666-ff6a-41e1-97e7-92a06b69ec9f';

-- GN Bank - use a larger version of the Wikimedia logo (best available, domain is parked)
UPDATE public.businesses 
SET banner_url = 'https://upload.wikimedia.org/wikipedia/commons/8/8e/GN_Bank_logo.jpg', updated_at = now()
WHERE id = '3665d965-e27f-406b-bd93-43e0583ccb45';
