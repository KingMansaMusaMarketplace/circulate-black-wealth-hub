
-- Central State University - Wikipedia seal
UPDATE public.businesses SET 
  logo_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Central_State_University_seal.svg/250px-Central_State_University_seal.svg.png',
  updated_at = now()
WHERE id = '112e9e6d-f9d9-475c-b528-43ca32ace1ca';

-- Selma University - no campus photos available anywhere online, keep Clearbit banner as last resort
