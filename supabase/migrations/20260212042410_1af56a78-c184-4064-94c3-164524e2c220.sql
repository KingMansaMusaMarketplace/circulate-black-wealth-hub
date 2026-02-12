
-- Fix Jarvis Christian University - revert to Clearbit banner since no static campus image available on their site
-- Their site only uses video backgrounds and SVG icons
UPDATE public.businesses SET 
  banner_url = 'https://logo.clearbit.com/jarvis.edu',
  updated_at = now()
WHERE id = '041ff4ed-bb4e-4d08-bdec-a2897224bed3';
