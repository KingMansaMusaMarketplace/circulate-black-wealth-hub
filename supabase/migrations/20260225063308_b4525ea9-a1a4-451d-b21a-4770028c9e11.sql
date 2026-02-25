
-- Add custom landing page fields to corporate_subscriptions
ALTER TABLE public.corporate_subscriptions
ADD COLUMN IF NOT EXISTS landing_page_slug text UNIQUE,
ADD COLUMN IF NOT EXISTS landing_page_headline text,
ADD COLUMN IF NOT EXISTS landing_page_description text,
ADD COLUMN IF NOT EXISTS landing_page_cta_text text DEFAULT 'Learn More',
ADD COLUMN IF NOT EXISTS landing_page_cta_url text,
ADD COLUMN IF NOT EXISTS landing_page_hero_image_url text,
ADD COLUMN IF NOT EXISTS landing_page_enabled boolean DEFAULT false;

-- Allow public read access for published landing pages
CREATE POLICY "Public can view enabled sponsor landing pages"
ON public.corporate_subscriptions
FOR SELECT
USING (landing_page_enabled = true AND landing_page_slug IS NOT NULL AND is_visible = true AND approval_status = 'approved');
