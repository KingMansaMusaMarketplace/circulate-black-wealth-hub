
-- United Bank of Philadelphia - banner from their hero image
UPDATE public.businesses SET 
  banner_url = 'https://images.squarespace-cdn.com/content/v1/67ae1f90aa4ad40bc3e31cae/1760380550686-X5Q0RX3GDS270NCDP9LB/women+owned+business.jpeg?format=2500w',
  updated_at = now()
WHERE name = 'United Bank of Philadelphia';

-- BHM Bank - banner from their hero image
UPDATE public.businesses SET 
  banner_url = 'https://static.wixstatic.com/media/c4fe82_0d2b7b2fcf1e49c5b646654ab8a29828f000.jpg/v1/fill/w_952,h_801,al_c,q_85,usm_0.33_1.00_0.00,enc_avif,quality_auto/c4fe82_0d2b7b2fcf1e49c5b646654ab8a29828f000.jpg',
  updated_at = now()
WHERE name = 'BHM Bank';

-- Commonwealth National Bank - banner from their hero (aerial city view)
UPDATE public.businesses SET 
  banner_url = 'https://www.ecommonwealthbank.com/wp-content/uploads/elementor/thumbs/icon-app-bug-cnb-160x160-1-qw1i99e7x51ud3aav4zrbx1hin3vrnkaixivpqmrgy.png',
  updated_at = now()
WHERE name = 'Commonwealth National Bank' AND banner_url = '';

-- Citizens Savings Bank & Trust - logo and banner
UPDATE public.businesses SET 
  logo_url = 'https://www.bankcbn.com/wp-content/uploads/2024/05/hp-image-1.jpg.webp',
  banner_url = 'https://www.citizenssavingsbank.com/wp-content/uploads/2018/12/Commercial_Loans.jpg',
  updated_at = now()
WHERE name = 'Citizens Savings Bank & Trust';

-- Carver State Bank - banner from their website
UPDATE public.businesses SET 
  banner_url = 'https://www.carverstatebank.com/wp-content/uploads/2021/10/target.jpg',
  updated_at = now()
WHERE name = 'Carver State Bank';

-- Unity National Bank - banner from their hero
UPDATE public.businesses SET 
  banner_url = 'https://unitybanktexas.com/wp-content/uploads/2025/02/icon-account-150x150.png',
  updated_at = now()
WHERE name = 'Unity National Bank' AND banner_url = '';

-- The Harbor Bank of Maryland - banner (the newer entry without local path)
UPDATE public.businesses SET 
  banner_url = 'https://www.theharborbank.com/Portals/TheHarborBankMaryland/logo2024.png?ver=d_4n9aZLRZ8lOlZ7xOpHXg%3d%3d',
  updated_at = now()
WHERE name = 'The Harbor Bank of Maryland' AND banner_url = '';

-- Optus Bank - banner from their Wix site
UPDATE public.businesses SET 
  banner_url = 'https://static.wixstatic.com/media/c4fe82_51695a45bf1446e881462d3029b10d8a~mv2.png',
  updated_at = now()
WHERE name = 'Optus Bank';

-- First Independence Bank - banner from their hero
UPDATE public.businesses SET 
  banner_url = 'https://www.firstindependence.com//wp-content/uploads/2020/04/img_1587586677856_827.png?temp=1587586835983',
  updated_at = now()
WHERE name = 'First Independence Bank';

-- Carver Federal Savings Bank - banner from their hero
UPDATE public.businesses SET 
  banner_url = 'https://www.carverbank.com/assets/files/9i3pK841/hero-why.jpg',
  updated_at = now()
WHERE name = 'Carver Federal Savings Bank';

-- Industrial Bank - banner from their hero
UPDATE public.businesses SET 
  banner_url = 'https://industrial-bank.s3.amazonaws.com/images/default-source/billboard/shutterstock_544786441.jpg?sfvrsn=c36bbdfc_6',
  updated_at = now()
WHERE name = 'Industrial Bank';

-- Liberty Bank & Trust - use their logo as banner since hero images are dynamic/carousel
UPDATE public.businesses SET 
  banner_url = 'https://www.libertybank.net/dist/assets/images/LibertyBank.svg',
  updated_at = now()
WHERE name = 'Liberty Bank & Trust' AND banner_url = '';

-- City First Bank - logo and banner from their website
UPDATE public.businesses SET 
  logo_url = 'https://www.cityfirstbank.com/wp-content/themes/theme/assets/img/logo.svg',
  banner_url = 'https://www.cityfirstbank.com/wp-content/themes/theme/assets/img/logo.svg',
  updated_at = now()
WHERE name = 'City First Bank';

-- GN Bank - use Wikimedia commons logo (domain is parked)
UPDATE public.businesses SET 
  logo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/GN_Bank_logo.jpg/220px-GN_Bank_logo.jpg',
  banner_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/GN_Bank_logo.jpg/220px-GN_Bank_logo.jpg',
  updated_at = now()
WHERE name = 'GN Bank';
