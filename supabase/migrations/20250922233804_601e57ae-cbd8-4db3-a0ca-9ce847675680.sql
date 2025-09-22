-- Fix security issues with business_verifications table

-- Add documentation comments for sensitive data
COMMENT ON TABLE public.business_verifications IS 'Contains sensitive business verification documents and data. Access restricted to business owner and verification administrators only.';
COMMENT ON COLUMN public.business_verifications.registration_document_url IS 'SENSITIVE - Business registration document URL, protected by RLS';
COMMENT ON COLUMN public.business_verifications.ownership_document_url IS 'SENSITIVE - Ownership document URL, protected by RLS';
COMMENT ON COLUMN public.business_verifications.address_document_url IS 'SENSITIVE - Address verification document URL, protected by RLS';

-- Add missing admin policies for verification management
CREATE POLICY "Admins can view all business verifications" 
ON public.business_verifications 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update verification status" 
ON public.business_verifications 
FOR UPDATE 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Create a secure view for admins that excludes direct document URLs for initial review
CREATE OR REPLACE VIEW public.business_verifications_admin_summary AS
SELECT 
    bv.id,
    bv.business_id,
    bv.verification_status,
    bv.ownership_percentage,
    bv.submitted_at,
    bv.verified_at,
    bv.verified_by,
    bv.rejection_reason,
    bv.admin_notes,
    b.business_name,
    b.owner_id,
    p.full_name as owner_name,
    b.email as business_email,
    -- Indicate presence of documents without exposing URLs
    CASE WHEN bv.registration_document_url IS NOT NULL THEN 'uploaded' ELSE 'missing' END as registration_document_status,
    CASE WHEN bv.ownership_document_url IS NOT NULL THEN 'uploaded' ELSE 'missing' END as ownership_document_status,
    CASE WHEN bv.address_document_url IS NOT NULL THEN 'uploaded' ELSE 'missing' END as address_document_status
FROM public.business_verifications bv
JOIN public.businesses b ON bv.business_id = b.id
LEFT JOIN public.profiles p ON b.owner_id = p.id;

-- Apply security to the admin view
ALTER VIEW public.business_verifications_admin_summary SET (security_invoker = true);

-- Add comment explaining the security model
COMMENT ON VIEW public.business_verifications_admin_summary IS 'Admin summary view for business verifications. Shows document status without exposing URLs. Uses SECURITY INVOKER for proper RLS enforcement.';

-- Create a function for admins to securely access document URLs only when needed
CREATE OR REPLACE FUNCTION public.get_verification_document_urls(verification_id uuid)
RETURNS TABLE(
    registration_url text,
    ownership_url text,
    address_url text
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    -- Only allow admins to access this function
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required to access document URLs.';
    END IF;
    
    -- Log the access for audit purposes
    INSERT INTO public.security_audit_log (
        action,
        table_name,
        record_id,
        user_id,
        timestamp
    ) VALUES (
        'admin_document_access',
        'business_verifications',
        verification_id,
        auth.uid(),
        now()
    );
    
    RETURN QUERY
    SELECT 
        bv.registration_document_url,
        bv.ownership_document_url,
        bv.address_document_url
    FROM public.business_verifications bv
    WHERE bv.id = verification_id;
END;
$$;