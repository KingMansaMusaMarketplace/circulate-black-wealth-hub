-- Create marketing material downloads tracking table
CREATE TABLE IF NOT EXISTS public.marketing_material_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES public.marketing_materials(id) ON DELETE CASCADE,
  sales_agent_id UUID NOT NULL REFERENCES public.sales_agents(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX idx_material_downloads_material_id ON public.marketing_material_downloads(material_id);
CREATE INDEX idx_material_downloads_agent_id ON public.marketing_material_downloads(sales_agent_id);
CREATE INDEX idx_material_downloads_date ON public.marketing_material_downloads(downloaded_at);

-- Enable RLS
ALTER TABLE public.marketing_material_downloads ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all downloads
CREATE POLICY "Admins can view all downloads"
ON public.marketing_material_downloads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: System can insert downloads
CREATE POLICY "System can track downloads"
ON public.marketing_material_downloads
FOR INSERT
TO authenticated
WITH CHECK (
  sales_agent_id IN (
    SELECT id FROM public.sales_agents WHERE user_id = auth.uid()
  )
);

-- Update the increment function to also track downloads
CREATE OR REPLACE FUNCTION public.track_material_download(
  p_material_id UUID,
  p_user_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_agent_id UUID;
BEGIN
  -- Get agent ID from user ID
  SELECT id INTO v_agent_id
  FROM public.sales_agents
  WHERE user_id = p_user_id;
  
  IF v_agent_id IS NULL THEN
    RAISE EXCEPTION 'User is not a sales agent';
  END IF;
  
  -- Insert download record
  INSERT INTO public.marketing_material_downloads (material_id, sales_agent_id)
  VALUES (p_material_id, v_agent_id);
  
  -- Increment material download count
  UPDATE public.marketing_materials
  SET download_count = download_count + 1
  WHERE id = p_material_id;
END;
$$;

-- Function to get material analytics
CREATE OR REPLACE FUNCTION public.get_material_analytics(
  p_start_date DATE DEFAULT (CURRENT_DATE - INTERVAL '30 days')::DATE,
  p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  material_id UUID,
  material_title TEXT,
  material_type TEXT,
  total_downloads BIGINT,
  unique_agents BIGINT,
  bronze_downloads BIGINT,
  silver_downloads BIGINT,
  gold_downloads BIGINT,
  platinum_downloads BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    m.id,
    m.title,
    m.type,
    COUNT(d.id) as total_downloads,
    COUNT(DISTINCT d.sales_agent_id) as unique_agents,
    COUNT(CASE WHEN sa.tier = 'bronze' THEN 1 END) as bronze_downloads,
    COUNT(CASE WHEN sa.tier = 'silver' THEN 1 END) as silver_downloads,
    COUNT(CASE WHEN sa.tier = 'gold' THEN 1 END) as gold_downloads,
    COUNT(CASE WHEN sa.tier = 'platinum' THEN 1 END) as platinum_downloads
  FROM public.marketing_materials m
  LEFT JOIN public.marketing_material_downloads d ON m.id = d.material_id
    AND d.downloaded_at >= p_start_date
    AND d.downloaded_at <= p_end_date
  LEFT JOIN public.sales_agents sa ON d.sales_agent_id = sa.id
  WHERE m.is_active = true
  GROUP BY m.id, m.title, m.type
  ORDER BY total_downloads DESC;
END;
$$;

-- Function to get download trends over time
CREATE OR REPLACE FUNCTION public.get_download_trends(
  p_start_date DATE DEFAULT (CURRENT_DATE - INTERVAL '30 days')::DATE,
  p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  download_date DATE,
  download_count BIGINT,
  banner_count BIGINT,
  social_count BIGINT,
  email_count BIGINT,
  document_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    d.downloaded_at::DATE as download_date,
    COUNT(*) as download_count,
    COUNT(CASE WHEN m.type = 'banner' THEN 1 END) as banner_count,
    COUNT(CASE WHEN m.type = 'social' THEN 1 END) as social_count,
    COUNT(CASE WHEN m.type = 'email' THEN 1 END) as email_count,
    COUNT(CASE WHEN m.type = 'document' THEN 1 END) as document_count
  FROM public.marketing_material_downloads d
  JOIN public.marketing_materials m ON d.material_id = m.id
  WHERE d.downloaded_at >= p_start_date
    AND d.downloaded_at <= p_end_date
  GROUP BY d.downloaded_at::DATE
  ORDER BY download_date;
END;
$$;