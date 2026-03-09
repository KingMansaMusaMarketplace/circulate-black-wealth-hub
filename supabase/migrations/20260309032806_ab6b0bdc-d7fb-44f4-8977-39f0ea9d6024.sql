
-- Update remaining businesses with missing images using best available sources

-- Almeda (DC Afro-fusion restaurant) - banner from Washingtonian press photo
UPDATE public.businesses 
SET 
  banner_url = 'https://washingtonian.com/wp-content/uploads/2023/11/unnamed-1.jpg',
  logo_url = 'https://washingtonian.com/wp-content/uploads/2023/11/unnamed-1.jpg'
WHERE id = 'be09e973-a526-4c06-8c7c-f191c5fb1897';

-- Burns Original BBQ (Houston) - images from Houston BBQ Guide
UPDATE public.businesses 
SET 
  banner_url = 'https://houbbqguide.com/wp-content/uploads/2021/06/burns-original-bbq-5.jpg',
  logo_url = 'https://houbbqguide.com/wp-content/uploads/2021/01/burns-original-bbq-2.jpg'
WHERE id = '5c73b908-e8c8-43d4-a173-22547e122496';

-- Fixins Soul Kitchen (Sacramento) - logo from their actual website, banner from food photo
-- Also fix the website URL (was misspelled with double L)
UPDATE public.businesses 
SET 
  logo_url = 'https://fixinssoulkitchen.com/wp-content/uploads/2019/06/Artboard-42.png',
  banner_url = 'https://fixinssoulkitchen.com/wp-content/uploads/elementor/thumbs/Artboard-42-oamieqmfdpplx3dm5hvqrwh0lxrgltbl2uyhhdnlps.png',
  website = 'https://fixinssoulkitchen.com'
WHERE id = '57df01cc-56c9-4718-b4da-8fcc3aac9981';

-- Leah & Louise (Charlotte NC) - site is 404, use food photo from press
UPDATE public.businesses 
SET 
  banner_url = 'https://cdn6.localdatacdn.com/images/763200/d_leah_and_louise_photo.jpg',
  logo_url = 'https://cdn6.localdatacdn.com/images/763200/d_leah_and_louise_photo.jpg'
WHERE id = '7f69656d-4b6d-43e8-a1c6-8d7f8662f30b';

-- Soul Kuisine Cafe (Baltimore) - images from Restaurantji
UPDATE public.businesses 
SET 
  banner_url = 'https://cdn6.localdatacdn.com/images/4915448/d_soul_kuisine_cafe_photo.jpg',
  logo_url = 'https://cdn6.localdatacdn.com/images/4915448/d_soul_kuisine_cafe_photo.jpg'
WHERE id = 'f5b332ca-e31a-449e-9030-223bd5ddd33f';
