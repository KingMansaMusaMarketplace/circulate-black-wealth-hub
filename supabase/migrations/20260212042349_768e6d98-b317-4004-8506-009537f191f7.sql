
-- Update remaining HBCU schools with authentic banner/logo URLs found from website scraping

-- Fayetteville State University - found banner from campus page
UPDATE public.businesses SET 
  banner_url = 'https://www.uncfsu.edu/images/Template%20B/FSU-Web-Banner-OurCampus.jpg',
  updated_at = now()
WHERE id = 'e7b1a1e6-8d9d-484c-b331-d818056a0988';

-- Jarvis Christian University - found logo from wp-content
UPDATE public.businesses SET 
  banner_url = 'https://jarvis.edu/wp-content/uploads/2024/03/video-bg-v7-optimized.mp4',
  updated_at = now()
WHERE id = '041ff4ed-bb4e-4d08-bdec-a2897224bed3';

-- Note: Jarvis only has video bg, no static banner image available. Keep Clearbit banner.
-- Revert Jarvis banner to use a static image search result instead
UPDATE public.businesses SET 
  banner_url = 'https://jarvis.edu/wp-content/uploads/2025/06/icons8-e-learning-yellow.svg',
  updated_at = now()
WHERE id = '041ff4ed-bb4e-4d08-bdec-a2897224bed3';
