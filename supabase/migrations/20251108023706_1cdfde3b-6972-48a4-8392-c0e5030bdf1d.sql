-- Create marketing materials table
CREATE TABLE IF NOT EXISTS public.marketing_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('banner', 'social', 'email', 'document')),
  file_url TEXT,
  thumbnail_url TEXT,
  dimensions VARCHAR(50),
  file_size INTEGER,
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_marketing_materials_type ON public.marketing_materials(type);
CREATE INDEX idx_marketing_materials_active ON public.marketing_materials(is_active);

-- Enable RLS
ALTER TABLE public.marketing_materials ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can view active materials
CREATE POLICY "Authenticated users can view active marketing materials"
ON public.marketing_materials
FOR SELECT
TO authenticated
USING (is_active = true);

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage all marketing materials"
ON public.marketing_materials
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Function to increment download count
CREATE OR REPLACE FUNCTION public.increment_material_downloads(material_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.marketing_materials
  SET download_count = download_count + 1
  WHERE id = material_id;
END;
$$;

-- Create storage bucket for marketing materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketing-materials', 'marketing-materials', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for marketing materials bucket
CREATE POLICY "Authenticated users can view marketing materials"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'marketing-materials');

CREATE POLICY "Admins can upload marketing materials"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'marketing-materials' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update marketing materials"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'marketing-materials' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete marketing materials"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'marketing-materials' AND
  public.has_role(auth.uid(), 'admin')
);

-- Trigger to update updated_at
CREATE TRIGGER update_marketing_materials_updated_at
BEFORE UPDATE ON public.marketing_materials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();