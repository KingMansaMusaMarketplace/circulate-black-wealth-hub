
-- Create property_cohosts table
CREATE TABLE public.property_cohosts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL,
  host_user_id UUID NOT NULL,
  cohost_email TEXT NOT NULL,
  cohost_user_id UUID,
  permissions TEXT[] NOT NULL DEFAULT ARRAY['messaging', 'calendar'],
  status TEXT NOT NULL DEFAULT 'pending',
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(property_id, cohost_email)
);

-- Enable RLS
ALTER TABLE public.property_cohosts ENABLE ROW LEVEL SECURITY;

-- Host can manage their own co-hosts
CREATE POLICY "Hosts can manage cohosts for their properties"
ON public.property_cohosts
FOR ALL
USING (auth.uid() = host_user_id);

-- Co-hosts can view their own invitations
CREATE POLICY "Cohosts can view their invitations"
ON public.property_cohosts
FOR SELECT
USING (auth.uid() = cohost_user_id OR cohost_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Update trigger
CREATE OR REPLACE FUNCTION public.update_property_cohosts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_property_cohosts_updated_at
BEFORE UPDATE ON public.property_cohosts
FOR EACH ROW
EXECUTE FUNCTION public.update_property_cohosts_updated_at();
