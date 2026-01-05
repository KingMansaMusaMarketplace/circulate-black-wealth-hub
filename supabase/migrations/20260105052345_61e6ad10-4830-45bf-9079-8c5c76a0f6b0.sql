-- Add claim-related columns to b2b_external_leads for "Claim Your Business" feature
ALTER TABLE public.b2b_external_leads 
ADD COLUMN IF NOT EXISTS claim_token TEXT,
ADD COLUMN IF NOT EXISTS claim_token_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS claimed_by_user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS claim_status TEXT DEFAULT 'unclaimed' CHECK (claim_status IN ('unclaimed', 'pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS verification_method TEXT,
ADD COLUMN IF NOT EXISTS is_visible_in_directory BOOLEAN DEFAULT true;

-- Create index for faster directory queries
CREATE INDEX IF NOT EXISTS idx_external_leads_directory 
ON public.b2b_external_leads(is_visible_in_directory, claim_status) 
WHERE is_visible_in_directory = true;

-- Create index for claim token lookups
CREATE INDEX IF NOT EXISTS idx_external_leads_claim_token 
ON public.b2b_external_leads(claim_token) 
WHERE claim_token IS NOT NULL;

-- Create business_invitations table for referral program
CREATE TABLE IF NOT EXISTS public.business_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id UUID NOT NULL REFERENCES auth.users(id),
  inviter_business_id UUID REFERENCES public.businesses(id),
  invitee_email TEXT NOT NULL,
  invitee_business_name TEXT,
  invitation_token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'opened', 'signed_up', 'expired')),
  opened_at TIMESTAMPTZ,
  signed_up_at TIMESTAMPTZ,
  converted_business_id UUID REFERENCES public.businesses(id),
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '30 days')
);

-- Enable RLS on business_invitations
ALTER TABLE public.business_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies for business_invitations
CREATE POLICY "Users can view their own invitations"
ON public.business_invitations FOR SELECT
USING (inviter_user_id = auth.uid());

CREATE POLICY "Users can create invitations"
ON public.business_invitations FOR INSERT
WITH CHECK (inviter_user_id = auth.uid());

CREATE POLICY "Users can update their own invitations"
ON public.business_invitations FOR UPDATE
USING (inviter_user_id = auth.uid());

-- Allow anyone to read invitation by token (for claim flow)
CREATE POLICY "Anyone can read invitation by token"
ON public.business_invitations FOR SELECT
USING (true);

-- Create function to generate claim token
CREATE OR REPLACE FUNCTION public.generate_claim_token(lead_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_token TEXT;
BEGIN
  new_token := encode(gen_random_bytes(32), 'hex');
  
  UPDATE b2b_external_leads
  SET 
    claim_token = new_token,
    claim_token_expires_at = now() + interval '7 days',
    claim_status = 'pending'
  WHERE id = lead_id;
  
  RETURN new_token;
END;
$$;

-- Create function to verify and claim a business
CREATE OR REPLACE FUNCTION public.claim_business_lead(
  p_token TEXT,
  p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lead RECORD;
  v_result JSONB;
BEGIN
  -- Find the lead with valid token
  SELECT * INTO v_lead
  FROM b2b_external_leads
  WHERE claim_token = p_token
    AND claim_token_expires_at > now()
    AND claim_status = 'pending';
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired claim token');
  END IF;
  
  -- Update the lead as claimed
  UPDATE b2b_external_leads
  SET 
    claimed_by_user_id = p_user_id,
    claimed_at = now(),
    claim_status = 'verified',
    claim_token = NULL,
    claim_token_expires_at = NULL
  WHERE id = v_lead.id;
  
  RETURN jsonb_build_object(
    'success', true, 
    'lead_id', v_lead.id,
    'business_name', v_lead.business_name
  );
END;
$$;

-- RLS policy updates for b2b_external_leads to allow public viewing
CREATE POLICY "Anyone can view visible external leads"
ON public.b2b_external_leads FOR SELECT
USING (is_visible_in_directory = true);

-- Allow users to update leads they're claiming
CREATE POLICY "Users can claim leads"
ON public.b2b_external_leads FOR UPDATE
USING (
  claim_status = 'pending' 
  AND claim_token IS NOT NULL 
  AND claim_token_expires_at > now()
);