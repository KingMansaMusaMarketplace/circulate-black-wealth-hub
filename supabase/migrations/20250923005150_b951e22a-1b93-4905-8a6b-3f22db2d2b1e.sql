-- Fix HBCU verification security issues
-- =============================================

-- 1. Add comments to document sensitive columns
COMMENT ON COLUMN public.hbcu_verifications.document_url IS 'SENSITIVE: Contains URLs to student verification documents - access must be logged and restricted';
COMMENT ON COLUMN public.hbcu_verifications.verification_status IS 'SENSITIVE: Contains student verification status - restrict access appropriately';

-- 2. Update RLS policies to allow users to update their own records
CREATE POLICY "Users can update their own HBCU verification"
ON public.hbcu_verifications
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Create a secure view for administrators that doesn't expose direct document URLs
CREATE OR REPLACE VIEW public.hbcu_verifications_admin_summary AS
SELECT 
    hv.id,
    hv.user_id,
    hv.verification_status,
    hv.verified_at,
    hv.verified_by,
    hv.created_at,
    hv.updated_at,
    hv.document_type,
    hv.rejection_reason,
    -- Don't expose direct document URLs in the summary view
    CASE 
        WHEN hv.document_url IS NOT NULL THEN 'Document Available'
        ELSE 'No Document'
    END as document_status,
    -- Join with profiles to get user information
    p.full_name as student_name,
    p.email as student_email
FROM public.hbcu_verifications hv
LEFT JOIN public.profiles p ON hv.user_id = p.id;

-- Apply RLS to the admin summary view
ALTER VIEW public.hbcu_verifications_admin_summary SET (security_invoker = on);

-- 4. Create a secure function for administrators to get document URLs with audit logging
CREATE OR REPLACE FUNCTION public.get_hbcu_verification_document_url(verification_id uuid)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    document_url TEXT;
    verification_user_id UUID;
BEGIN
    -- Only allow admins to access this function
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required to access student verification documents.';
    END IF;
    
    -- Get the document URL and user ID
    SELECT hv.document_url, hv.user_id 
    INTO document_url, verification_user_id
    FROM public.hbcu_verifications hv
    WHERE hv.id = verification_id;
    
    IF document_url IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Log the access for audit purposes
    INSERT INTO public.security_audit_log (
        action,
        table_name,
        record_id,
        user_id,
        timestamp
    ) VALUES (
        'admin_hbcu_document_access',
        'hbcu_verifications',
        verification_id,
        auth.uid(),
        now()
    );
    
    RETURN document_url;
END;
$$;

-- 5. Create storage policies for the hbcu-verification bucket
-- Policy for users to upload their own verification documents
CREATE POLICY "Users can upload their own HBCU verification documents"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'hbcu-verification' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for users to view their own verification documents
CREATE POLICY "Users can view their own HBCU verification documents"
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'hbcu-verification' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for admins to view all HBCU verification documents
CREATE POLICY "Admins can view all HBCU verification documents"
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'hbcu-verification' 
    AND public.is_admin()
);

-- Policy for users to update/replace their own verification documents
CREATE POLICY "Users can update their own HBCU verification documents"
ON storage.objects
FOR UPDATE
USING (
    bucket_id = 'hbcu-verification' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. Create a function to safely check HBCU verification status without exposing sensitive data
CREATE OR REPLACE FUNCTION public.get_user_hbcu_status(target_user_id uuid DEFAULT auth.uid())
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
    verification_status text;
    verified_at timestamptz;
    result JSONB;
BEGIN
    -- Users can only check their own status, unless they are admin
    IF target_user_id != auth.uid() AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. You can only check your own HBCU verification status.';
    END IF;
    
    SELECT 
        hv.verification_status,
        hv.verified_at
    INTO verification_status, verified_at
    FROM public.hbcu_verifications hv
    WHERE hv.user_id = target_user_id
    ORDER BY hv.created_at DESC
    LIMIT 1;
    
    -- Return safe summary without exposing document URLs or sensitive details
    result := jsonb_build_object(
        'status', COALESCE(verification_status, 'not_submitted'),
        'verified_at', verified_at,
        'has_verification', (verification_status IS NOT NULL)
    );
    
    RETURN result;
END;
$$;