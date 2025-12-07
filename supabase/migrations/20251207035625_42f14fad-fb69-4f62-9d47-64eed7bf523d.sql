-- Create business contact requests table
CREATE TABLE public.business_contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.business_contact_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Business owners can view their contact requests
CREATE POLICY "Business owners can view contact requests"
ON public.business_contact_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = business_id AND b.owner_id = auth.uid()
  )
);

-- Policy: Anyone can create a contact request (but we validate server-side)
CREATE POLICY "Anyone can create contact requests"
ON public.business_contact_requests
FOR INSERT
WITH CHECK (true);

-- Policy: Business owners can update status of their requests
CREATE POLICY "Business owners can update contact requests"
ON public.business_contact_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = business_id AND b.owner_id = auth.uid()
  )
);

-- Create index for efficient lookups
CREATE INDEX idx_contact_requests_business_id ON public.business_contact_requests(business_id);
CREATE INDEX idx_contact_requests_status ON public.business_contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON public.business_contact_requests(created_at DESC);