-- Step 1: Create businesses_private table for owner contact information
CREATE TABLE public.businesses_private (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL UNIQUE REFERENCES public.businesses(id) ON DELETE CASCADE,
  phone varchar(50),
  email varchar(255),
  owner_contact_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Step 2: Migrate existing phone/email data from businesses to businesses_private
INSERT INTO public.businesses_private (business_id, phone, email)
SELECT id, phone, email 
FROM public.businesses 
WHERE phone IS NOT NULL OR email IS NOT NULL;

-- Step 3: Enable RLS on businesses_private
ALTER TABLE public.businesses_private ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for businesses_private
-- Only business owners and admins can see private contact info
CREATE POLICY "Owners can view their business private data"
ON public.businesses_private
FOR SELECT
USING (
  business_id IN (
    SELECT id FROM public.businesses 
    WHERE owner_id = auth.uid() OR location_manager_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all business private data"
ON public.businesses_private
FOR SELECT
USING (public.is_admin_secure());

CREATE POLICY "Owners can insert their business private data"
ON public.businesses_private
FOR INSERT
WITH CHECK (
  business_id IN (
    SELECT id FROM public.businesses 
    WHERE owner_id = auth.uid() OR location_manager_id = auth.uid()
  )
);

CREATE POLICY "Owners can update their business private data"
ON public.businesses_private
FOR UPDATE
USING (
  business_id IN (
    SELECT id FROM public.businesses 
    WHERE owner_id = auth.uid() OR location_manager_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all business private data"
ON public.businesses_private
FOR ALL
USING (public.is_admin_secure());

-- Step 5: Create updated_at trigger for businesses_private
CREATE TRIGGER update_businesses_private_updated_at
BEFORE UPDATE ON public.businesses_private
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Step 6: Create a helper view for owners to see full business details
CREATE VIEW public.businesses_full_details AS
SELECT 
  b.*,
  bp.phone as owner_phone,
  bp.email as owner_email,
  bp.owner_contact_notes
FROM public.businesses b
LEFT JOIN public.businesses_private bp ON b.id = bp.business_id;

-- Step 7: Grant access to the view
GRANT SELECT ON public.businesses_full_details TO authenticated;

-- Step 8: Create RLS policy for the view
ALTER VIEW public.businesses_full_details SET (security_invoker = on);

-- Step 9: Drop phone and email columns from businesses table
-- (Keeping for now to avoid breaking existing code - will be removed in follow-up migration)
-- ALTER TABLE public.businesses DROP COLUMN phone;
-- ALTER TABLE public.businesses DROP COLUMN email;

-- Step 10: Add comments for documentation
COMMENT ON TABLE public.businesses_private IS 'Stores sensitive owner contact information separately from public business data';
COMMENT ON VIEW public.businesses_full_details IS 'Join view for owners to see their complete business information including private contact details';
COMMENT ON COLUMN public.businesses.phone IS 'DEPRECATED: Use businesses_private table instead. Kept for backward compatibility.';
COMMENT ON COLUMN public.businesses.email IS 'DEPRECATED: Use businesses_private table instead. Kept for backward compatibility.';