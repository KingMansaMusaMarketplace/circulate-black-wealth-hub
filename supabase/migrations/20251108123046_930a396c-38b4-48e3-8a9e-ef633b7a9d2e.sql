-- Create QR code scans tracking table
CREATE TABLE IF NOT EXISTS public.qr_code_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code TEXT NOT NULL,
  sales_agent_id UUID REFERENCES public.sales_agents(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  converted BOOLEAN DEFAULT false,
  converted_user_id UUID,
  converted_at TIMESTAMP WITH TIME ZONE,
  scan_source TEXT DEFAULT 'qr_code',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_qr_code_scans_referral_code ON public.qr_code_scans(referral_code);
CREATE INDEX IF NOT EXISTS idx_qr_code_scans_sales_agent_id ON public.qr_code_scans(sales_agent_id);
CREATE INDEX IF NOT EXISTS idx_qr_code_scans_scanned_at ON public.qr_code_scans(scanned_at);

-- Enable RLS
ALTER TABLE public.qr_code_scans ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert scan records (for tracking)
CREATE POLICY "Anyone can track QR code scans"
  ON public.qr_code_scans
  FOR INSERT
  WITH CHECK (true);

-- Policy: Agents can view their own QR code scans
CREATE POLICY "Agents can view their own QR code scans"
  ON public.qr_code_scans
  FOR SELECT
  USING (
    sales_agent_id IN (
      SELECT id FROM public.sales_agents WHERE user_id = auth.uid()
    )
  );

-- Policy: Admins can view all QR code scans
CREATE POLICY "Admins can view all QR code scans"
  ON public.qr_code_scans
  FOR SELECT
  USING (is_admin_secure());

-- Policy: System can update conversion status
CREATE POLICY "System can update QR code scan conversions"
  ON public.qr_code_scans
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Function to get QR code analytics for an agent
CREATE OR REPLACE FUNCTION public.get_agent_qr_analytics(agent_referral_code TEXT)
RETURNS TABLE (
  total_scans BIGINT,
  unique_scans BIGINT,
  total_conversions BIGINT,
  conversion_rate NUMERIC,
  scans_last_7_days BIGINT,
  scans_last_30_days BIGINT,
  conversions_last_7_days BIGINT,
  conversions_last_30_days BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_scans,
    COUNT(DISTINCT ip_address)::BIGINT as unique_scans,
    COUNT(*) FILTER (WHERE converted = true)::BIGINT as total_conversions,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(*) FILTER (WHERE converted = true)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0
    END as conversion_rate,
    COUNT(*) FILTER (WHERE scanned_at >= NOW() - INTERVAL '7 days')::BIGINT as scans_last_7_days,
    COUNT(*) FILTER (WHERE scanned_at >= NOW() - INTERVAL '30 days')::BIGINT as scans_last_30_days,
    COUNT(*) FILTER (WHERE converted = true AND scanned_at >= NOW() - INTERVAL '7 days')::BIGINT as conversions_last_7_days,
    COUNT(*) FILTER (WHERE converted = true AND scanned_at >= NOW() - INTERVAL '30 days')::BIGINT as conversions_last_30_days
  FROM public.qr_code_scans
  WHERE referral_code = agent_referral_code;
END;
$$;

-- Function to track a QR code scan
CREATE OR REPLACE FUNCTION public.track_qr_scan(
  p_referral_code TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_scan_id UUID;
  v_agent_id UUID;
BEGIN
  -- Get the agent ID from the referral code
  SELECT id INTO v_agent_id
  FROM public.sales_agents
  WHERE referral_code = p_referral_code;

  -- Insert the scan record
  INSERT INTO public.qr_code_scans (
    referral_code,
    sales_agent_id,
    ip_address,
    user_agent,
    scan_source
  ) VALUES (
    p_referral_code,
    v_agent_id,
    p_ip_address,
    p_user_agent,
    'qr_code'
  )
  RETURNING id INTO v_scan_id;

  RETURN v_scan_id;
END;
$$;

-- Function to mark a scan as converted
CREATE OR REPLACE FUNCTION public.mark_qr_scan_converted(
  p_referral_code TEXT,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated BOOLEAN;
BEGIN
  -- Update the most recent unconverted scan for this referral code
  UPDATE public.qr_code_scans
  SET 
    converted = true,
    converted_user_id = p_user_id,
    converted_at = NOW()
  WHERE id = (
    SELECT id 
    FROM public.qr_code_scans 
    WHERE referral_code = p_referral_code 
      AND converted = false
    ORDER BY scanned_at DESC
    LIMIT 1
  );

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;