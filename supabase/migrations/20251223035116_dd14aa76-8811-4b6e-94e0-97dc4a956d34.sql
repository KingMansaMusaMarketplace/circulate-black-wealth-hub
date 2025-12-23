-- Create storage bucket for ambassador marketing materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('ambassador-materials', 'ambassador-materials', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for training content
INSERT INTO storage.buckets (id, name, public)
VALUES ('ambassador-training', 'ambassador-training', true)
ON CONFLICT (id) DO NOTHING;

-- Create table for marketing materials metadata
CREATE TABLE public.ambassador_marketing_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  material_type TEXT NOT NULL CHECK (material_type IN ('flyer', 'business_card', 'social_media', 'email_template', 'presentation', 'other')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for training content
CREATE TABLE public.ambassador_training_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'webinar', 'document', 'quiz', 'course')),
  content_url TEXT,
  external_url TEXT,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  category TEXT NOT NULL,
  is_required BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Track which training content agents have completed
CREATE TABLE public.ambassador_training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_agent_id UUID REFERENCES public.sales_agents(id) ON DELETE CASCADE NOT NULL,
  training_content_id UUID REFERENCES public.ambassador_training_content(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percent INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(sales_agent_id, training_content_id)
);

-- Enable RLS
ALTER TABLE public.ambassador_marketing_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambassador_training_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambassador_training_progress ENABLE ROW LEVEL SECURITY;

-- Marketing materials: publicly readable (for ambassadors to download)
CREATE POLICY "Marketing materials are viewable by authenticated users"
ON public.ambassador_marketing_materials
FOR SELECT
TO authenticated
USING (is_active = true);

-- Training content: publicly readable
CREATE POLICY "Training content is viewable by authenticated users"
ON public.ambassador_training_content
FOR SELECT
TO authenticated
USING (is_active = true);

-- Training progress: users can view and update their own progress
CREATE POLICY "Users can view their own training progress"
ON public.ambassador_training_progress
FOR SELECT
TO authenticated
USING (sales_agent_id IN (SELECT id FROM public.sales_agents WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own training progress"
ON public.ambassador_training_progress
FOR INSERT
TO authenticated
WITH CHECK (sales_agent_id IN (SELECT id FROM public.sales_agents WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own training progress"
ON public.ambassador_training_progress
FOR UPDATE
TO authenticated
USING (sales_agent_id IN (SELECT id FROM public.sales_agents WHERE user_id = auth.uid()));

-- Storage policies for ambassador-materials bucket
CREATE POLICY "Anyone can view ambassador materials"
ON storage.objects FOR SELECT
USING (bucket_id = 'ambassador-materials');

CREATE POLICY "Admins can upload ambassador materials"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ambassador-materials' AND auth.uid() IN (
  SELECT user_id FROM public.user_roles WHERE role = 'admin'
));

-- Storage policies for ambassador-training bucket
CREATE POLICY "Anyone can view training content"
ON storage.objects FOR SELECT
USING (bucket_id = 'ambassador-training');

CREATE POLICY "Admins can upload training content"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ambassador-training' AND auth.uid() IN (
  SELECT user_id FROM public.user_roles WHERE role = 'admin'
));

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_ambassador_marketing_materials_updated_at
  BEFORE UPDATE ON public.ambassador_marketing_materials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ambassador_training_content_updated_at
  BEFORE UPDATE ON public.ambassador_training_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ambassador_training_progress_updated_at
  BEFORE UPDATE ON public.ambassador_training_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();