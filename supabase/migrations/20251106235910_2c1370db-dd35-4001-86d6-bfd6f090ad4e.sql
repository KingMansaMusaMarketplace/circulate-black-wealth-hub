-- Create success_stories table for showcasing community achievements
CREATE TABLE public.success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  business_id UUID REFERENCES businesses(id),
  story_type TEXT NOT NULL CHECK (story_type IN ('user', 'business', 'community')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  metrics JSONB DEFAULT '{}'::jsonb,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  business_id UUID REFERENCES businesses(id),
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for success_stories
CREATE POLICY "Anyone can view published success stories"
ON public.success_stories FOR SELECT
USING (is_published = true);

CREATE POLICY "Users can create their own success stories"
ON public.success_stories FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own success stories"
ON public.success_stories FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all success stories"
ON public.success_stories FOR ALL
USING (is_admin_secure());

-- RLS Policies for testimonials
CREATE POLICY "Anyone can view approved testimonials"
ON public.testimonials FOR SELECT
USING (is_approved = true);

CREATE POLICY "Users can create testimonials"
ON public.testimonials FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own testimonials"
ON public.testimonials FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all testimonials"
ON public.testimonials FOR ALL
USING (is_admin_secure());

-- Create indexes for performance
CREATE INDEX idx_success_stories_featured ON public.success_stories(is_featured, is_published);
CREATE INDEX idx_testimonials_featured ON public.testimonials(is_featured, is_approved);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_success_stories_updated_at
BEFORE UPDATE ON public.success_stories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();