-- Add enhanced verification methods to business_verifications table
ALTER TABLE public.business_verifications 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS phone_verification_number TEXT,
ADD COLUMN IF NOT EXISTS video_verification_url TEXT,
ADD COLUMN IF NOT EXISTS video_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS video_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS video_verification_notes TEXT,
ADD COLUMN IF NOT EXISTS verification_method TEXT DEFAULT 'documents',
ADD COLUMN IF NOT EXISTS social_verification_links JSONB DEFAULT '[]'::jsonb;

-- Create table for phone verification OTPs
CREATE TABLE IF NOT EXISTS public.phone_verification_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '10 minutes'),
  verified_at TIMESTAMPTZ,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.phone_verification_otps ENABLE ROW LEVEL SECURITY;

-- RLS policies for phone_verification_otps
CREATE POLICY "Users can view their own OTPs"
ON public.phone_verification_otps FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own OTPs"
ON public.phone_verification_otps FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own OTPs"
ON public.phone_verification_otps FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Create index for quick OTP lookups
CREATE INDEX IF NOT EXISTS idx_phone_otps_business_id ON public.phone_verification_otps(business_id);
CREATE INDEX IF NOT EXISTS idx_phone_otps_phone_number ON public.phone_verification_otps(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_otps_expires_at ON public.phone_verification_otps(expires_at);

-- Add comment for documentation
COMMENT ON TABLE public.phone_verification_otps IS 'Stores OTP codes for phone verification during business verification process';
COMMENT ON COLUMN public.business_verifications.verification_method IS 'Primary verification method: documents, phone, video, or combined';