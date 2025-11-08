-- Clean up any existing objects
DO $$ 
BEGIN
  -- Drop tables if they exist
  DROP TABLE IF EXISTS public.material_downloads CASCADE;
  DROP TABLE IF EXISTS public.marketing_materials CASCADE;
  
  -- Drop functions if they exist
  DROP FUNCTION IF EXISTS public.increment_material_download_count() CASCADE;
  DROP FUNCTION IF EXISTS public.get_materials_by_category(marketing_material_category) CASCADE;
  
  -- Drop type if it exists
  DROP TYPE IF EXISTS marketing_material_category CASCADE;
END $$;

-- Create enum type
CREATE TYPE marketing_material_category AS ENUM (
  'social_media',
  'email_templates',
  'graphics',
  'presentations',
  'qr_codes',
  'videos',
  'documents'
);

-- Create marketing materials table
CREATE TABLE public.marketing_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category marketing_material_category NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  thumbnail_path TEXT,
  download_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create download tracking table
CREATE TABLE public.material_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES public.marketing_materials(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.sales_agents(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ DEFAULT now(),
  user_agent TEXT,
  ip_address INET
);

-- Enable RLS
ALTER TABLE public.marketing_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketing_materials
CREATE POLICY "Anyone can view active materials"
  ON public.marketing_materials FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage materials"
  ON public.marketing_materials FOR ALL
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- RLS Policies for material_downloads
CREATE POLICY "Agents can view their own downloads"
  ON public.material_downloads FOR SELECT
  USING (
    agent_id IN (
      SELECT id FROM public.sales_agents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Agents can create download records"
  ON public.material_downloads FOR INSERT
  WITH CHECK (
    agent_id IN (
      SELECT id FROM public.sales_agents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all downloads"
  ON public.material_downloads FOR SELECT
  USING (is_admin_secure());

-- Function to increment download count
CREATE FUNCTION public.increment_material_download_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.marketing_materials
  SET download_count = download_count + 1
  WHERE id = NEW.material_id;
  
  RETURN NEW;
END;
$$;

-- Trigger for download count
CREATE TRIGGER on_material_download
  AFTER INSERT ON public.material_downloads
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_material_download_count();

-- Function to get materials by category
CREATE FUNCTION public.get_materials_by_category(
  p_category marketing_material_category DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category marketing_material_category,
  file_path TEXT,
  file_type TEXT,
  file_size INTEGER,
  thumbnail_path TEXT,
  download_count INTEGER,
  is_featured BOOLEAN,
  tags TEXT[],
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.title,
    m.description,
    m.category,
    m.file_path,
    m.file_type,
    m.file_size,
    m.thumbnail_path,
    m.download_count,
    m.is_featured,
    m.tags,
    m.created_at
  FROM public.marketing_materials m
  WHERE m.is_active = true
    AND (p_category IS NULL OR m.category = p_category)
  ORDER BY m.is_featured DESC, m.created_at DESC;
END;
$$;

-- Insert sample materials
INSERT INTO public.marketing_materials (
  title,
  description,
  category,
  file_path,
  file_type,
  is_featured,
  tags
) VALUES
(
  'Welcome Email Template',
  'Professional welcome email for new business prospects. Includes marketplace benefits and your referral link.',
  'email_templates',
  'templates/welcome-email.html',
  'text/html',
  true,
  ARRAY['email', 'welcome', 'onboarding']
),
(
  'Follow-up Email Template',
  'Effective follow-up email for prospects who showed interest but haven''t signed up yet.',
  'email_templates',
  'templates/follow-up-email.html',
  'text/html',
  true,
  ARRAY['email', 'follow-up', 'sales']
),
(
  'Instagram Story Template',
  'Eye-catching Instagram story template with Mansa Musa branding. Edit with your referral code.',
  'social_media',
  'templates/instagram-story.png',
  'image/png',
  true,
  ARRAY['instagram', 'social', 'story']
),
(
  'Facebook Post Template',
  'Engaging Facebook post template highlighting marketplace benefits.',
  'social_media',
  'templates/facebook-post.png',
  'image/png',
  true,
  ARRAY['facebook', 'social', 'post']
),
(
  'LinkedIn Post Template',
  'Professional LinkedIn post template for B2B outreach.',
  'social_media',
  'templates/linkedin-post.png',
  'image/png',
  false,
  ARRAY['linkedin', 'social', 'b2b']
);