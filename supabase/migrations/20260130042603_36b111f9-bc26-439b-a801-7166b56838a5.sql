-- Create NDA signature tracking table
CREATE TABLE public.nda_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_member_name TEXT NOT NULL,
  team_member_email TEXT,
  role TEXT,
  nda_type TEXT NOT NULL DEFAULT 'team_member',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'viewed', 'signed', 'declined')),
  sent_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_method TEXT CHECK (signature_method IN ('electronic', 'physical', 'docusign', 'hellosign')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.nda_signatures ENABLE ROW LEVEL SECURITY;

-- Admin-only access policy using secure admin check
CREATE POLICY "Admins can manage NDA signatures"
ON public.nda_signatures
FOR ALL
USING (public.is_admin_secure());

-- Create trigger for updated_at
CREATE TRIGGER update_nda_signatures_updated_at
BEFORE UPDATE ON public.nda_signatures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();