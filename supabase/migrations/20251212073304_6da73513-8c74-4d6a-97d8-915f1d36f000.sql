-- Add new columns to business_verifications for enhanced certification
ALTER TABLE public.business_verifications
ADD COLUMN IF NOT EXISTS identity_document_url TEXT,
ADD COLUMN IF NOT EXISTS business_license_url TEXT,
ADD COLUMN IF NOT EXISTS certification_agreement_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS certification_agreement_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS certification_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS certificate_number VARCHAR(30) UNIQUE,
ADD COLUMN IF NOT EXISTS badge_tier VARCHAR(20) DEFAULT 'basic';

-- Create index on certificate_number for quick lookups
CREATE INDEX IF NOT EXISTS idx_business_verifications_certificate_number 
ON public.business_verifications(certificate_number);

-- Create index on expiration for reminder queries
CREATE INDEX IF NOT EXISTS idx_business_verifications_expires_at 
ON public.business_verifications(certification_expires_at);

-- Create verification_certificates table for tracking downloadable certificates
CREATE TABLE IF NOT EXISTS public.verification_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  verification_id UUID NOT NULL REFERENCES public.business_verifications(id) ON DELETE CASCADE,
  certificate_number VARCHAR(30) NOT NULL UNIQUE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  pdf_url TEXT,
  embed_code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  revoked_at TIMESTAMPTZ,
  revoked_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on verification_certificates
ALTER TABLE public.verification_certificates ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active certificates (for public verification)
CREATE POLICY "Anyone can view active certificates"
ON public.verification_certificates
FOR SELECT
USING (is_active = TRUE);

-- Policy: Business owners can view their certificates
CREATE POLICY "Business owners can view their certificates"
ON public.verification_certificates
FOR SELECT
USING (business_id IN (
  SELECT id FROM businesses WHERE owner_id = auth.uid()
));

-- Policy: Admins can manage certificates
CREATE POLICY "Admins can manage certificates"
ON public.verification_certificates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to generate unique certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_part TEXT;
  sequence_num INTEGER;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  -- Get the next sequence number for this year
  SELECT COALESCE(MAX(CAST(SUBSTRING(certificate_number FROM 14) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.business_verifications
  WHERE certificate_number LIKE 'MMM-BOC-' || year_part || '-%';
  
  -- Format: MMM-BOC-YYYY-NNNN
  new_number := 'MMM-BOC-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to approve verification and generate certificate
CREATE OR REPLACE FUNCTION approve_verification_with_certificate(
  p_verification_id UUID,
  p_admin_id UUID,
  p_badge_tier VARCHAR DEFAULT 'certified',
  p_admin_notes TEXT DEFAULT NULL
)
RETURNS TABLE(
  verification_id UUID,
  certificate_number VARCHAR,
  expires_at TIMESTAMPTZ
) AS $$
DECLARE
  v_business_id UUID;
  v_cert_number VARCHAR(30);
  v_expires TIMESTAMPTZ;
BEGIN
  -- Generate certificate number and expiration
  v_cert_number := generate_certificate_number();
  v_expires := NOW() + INTERVAL '1 year';
  
  -- Get business_id from verification
  SELECT bv.business_id INTO v_business_id
  FROM public.business_verifications bv
  WHERE bv.id = p_verification_id;
  
  -- Update verification record
  UPDATE public.business_verifications
  SET 
    verification_status = 'approved',
    verified_by = p_admin_id,
    verified_at = NOW(),
    certificate_number = v_cert_number,
    certification_expires_at = v_expires,
    badge_tier = p_badge_tier,
    admin_notes = p_admin_notes,
    updated_at = NOW()
  WHERE id = p_verification_id;
  
  -- Update business is_verified flag
  UPDATE public.businesses
  SET is_verified = TRUE, updated_at = NOW()
  WHERE id = v_business_id;
  
  -- Create certificate record
  INSERT INTO public.verification_certificates (
    business_id,
    verification_id,
    certificate_number,
    expires_at
  ) VALUES (
    v_business_id,
    p_verification_id,
    v_cert_number,
    v_expires
  );
  
  RETURN QUERY SELECT p_verification_id, v_cert_number, v_expires;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for updated_at on verification_certificates
CREATE TRIGGER update_verification_certificates_updated_at
BEFORE UPDATE ON public.verification_certificates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();