-- Create categories table
CREATE TABLE IF NOT EXISTS public.material_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS public.material_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create junction table for materials and categories (many-to-many)
CREATE TABLE IF NOT EXISTS public.material_category_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES public.marketing_materials(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.material_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(material_id, category_id)
);

-- Create junction table for materials and tags (many-to-many)
CREATE TABLE IF NOT EXISTS public.material_tag_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES public.marketing_materials(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.material_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(material_id, tag_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_material_category_assignments_material ON public.material_category_assignments(material_id);
CREATE INDEX idx_material_category_assignments_category ON public.material_category_assignments(category_id);
CREATE INDEX idx_material_tag_assignments_material ON public.material_tag_assignments(material_id);
CREATE INDEX idx_material_tag_assignments_tag ON public.material_tag_assignments(tag_id);
CREATE INDEX idx_material_tags_slug ON public.material_tags(slug);

-- Enable RLS
ALTER TABLE public.material_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_category_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_tag_assignments ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Anyone authenticated can view active categories"
ON public.material_categories
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage categories"
ON public.material_categories
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Tags policies
CREATE POLICY "Anyone authenticated can view active tags"
ON public.material_tags
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage tags"
ON public.material_tags
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Category assignments policies
CREATE POLICY "Anyone authenticated can view category assignments"
ON public.material_category_assignments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage category assignments"
ON public.material_category_assignments
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Tag assignments policies
CREATE POLICY "Anyone authenticated can view tag assignments"
ON public.material_tag_assignments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage tag assignments"
ON public.material_tag_assignments
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_material_categories_updated_at
BEFORE UPDATE ON public.material_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_material_tags_updated_at
BEFORE UPDATE ON public.material_tags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.material_categories (name, description, icon, color) VALUES
('New Business', 'Materials for acquiring new businesses', 'briefcase', '#3b82f6'),
('Retention', 'Materials for customer retention', 'heart', '#10b981'),
('Industry Specific', 'Industry-focused promotional content', 'building', '#8b5cf6'),
('Campaign', 'Seasonal and campaign-specific materials', 'calendar', '#f59e0b'),
('Educational', 'Training and educational resources', 'book', '#06b6d4')
ON CONFLICT (name) DO NOTHING;

-- Insert default tags
INSERT INTO public.material_tags (name, slug, description) VALUES
('retail', 'retail', 'Retail industry focused'),
('restaurant', 'restaurant', 'Restaurant and food service'),
('professional-services', 'professional-services', 'Professional services'),
('health-wellness', 'health-wellness', 'Health and wellness'),
('beauty-salon', 'beauty-salon', 'Beauty and salon services'),
('black-friday', 'black-friday', 'Black Friday promotions'),
('holiday', 'holiday', 'Holiday season'),
('summer', 'summer', 'Summer campaigns'),
('back-to-school', 'back-to-school', 'Back to school'),
('intro-pitch', 'intro-pitch', 'Introduction and pitch materials'),
('value-prop', 'value-prop', 'Value proposition'),
('pricing', 'pricing', 'Pricing information'),
('success-stories', 'success-stories', 'Success stories and testimonials'),
('how-to', 'how-to', 'How-to guides')
ON CONFLICT (name) DO NOTHING;

-- Function to get materials with categories and tags
CREATE OR REPLACE FUNCTION public.get_materials_with_filters(
  p_category_ids UUID[] DEFAULT NULL,
  p_tag_ids UUID[] DEFAULT NULL,
  p_type TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  description TEXT,
  type TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  dimensions TEXT,
  file_size INTEGER,
  download_count INTEGER,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  categories JSONB,
  tags JSONB
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
    m.type,
    m.file_url,
    m.thumbnail_url,
    m.dimensions,
    m.file_size,
    m.download_count,
    m.is_active,
    m.created_at,
    m.updated_at,
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name, 'color', c.color, 'icon', c.icon))
       FROM material_category_assignments mca
       JOIN material_categories c ON mca.category_id = c.id
       WHERE mca.material_id = m.id AND c.is_active = true),
      '[]'::jsonb
    ) as categories,
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
       FROM material_tag_assignments mta
       JOIN material_tags t ON mta.tag_id = t.id
       WHERE mta.material_id = m.id AND t.is_active = true),
      '[]'::jsonb
    ) as tags
  FROM marketing_materials m
  WHERE m.is_active = true
    AND (p_type IS NULL OR m.type = p_type)
    AND (
      p_category_ids IS NULL OR
      EXISTS (
        SELECT 1 FROM material_category_assignments mca
        WHERE mca.material_id = m.id AND mca.category_id = ANY(p_category_ids)
      )
    )
    AND (
      p_tag_ids IS NULL OR
      EXISTS (
        SELECT 1 FROM material_tag_assignments mta
        WHERE mta.material_id = m.id AND mta.tag_id = ANY(p_tag_ids)
      )
    )
  ORDER BY m.created_at DESC;
END;
$$;