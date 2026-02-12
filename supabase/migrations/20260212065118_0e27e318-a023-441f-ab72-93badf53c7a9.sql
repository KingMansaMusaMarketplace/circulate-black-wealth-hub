UPDATE public.businesses SET 
  banner_url = '/images/hbcu/hampton-university-campus.jpg',
  updated_at = now()
WHERE id = 'c668bfb5-51dc-4de9-a5a8-4764c499ea90';

UPDATE public.businesses SET 
  banner_url = '/images/hbcu/fayetteville-state-university-campus.jpg',
  updated_at = now()
WHERE id = 'e7b1a1e6-8d9d-484c-b331-d818056a0988';

UPDATE public.businesses SET 
  banner_url = '/images/hbcu/lincoln-university-campus.jpg',
  updated_at = now()
WHERE id IN ('21804e6f-40ba-4fb9-932c-f8c5c614de90', 'af097bb0-7f38-4fa1-86ae-0d26c98a09ae');