
-- ============================================================
-- FIX 1: Remove PII from business_directory view
-- The view should NOT expose email/phone to all authenticated users
-- ============================================================
DROP VIEW IF EXISTS public.business_directory;
CREATE VIEW public.business_directory
WITH (security_invoker = true)
AS
SELECT id, business_name, name, description, category, address, city, state, zip_code,
    website, logo_url, banner_url, is_verified, average_rating, review_count,
    created_at, updated_at, latitude, longitude, listing_status, is_founding_member, is_founding_sponsor
FROM businesses
WHERE (is_verified = true) OR (listing_status = 'live'::text);

GRANT SELECT ON public.business_directory TO authenticated, anon;

-- ============================================================
-- FIX 2: Fix business_documents storage policies
-- The existing policies reference b.name (business name column)
-- instead of name (storage object path)
-- ============================================================
DROP POLICY IF EXISTS "Biz owners view docs" ON storage.objects;
DROP POLICY IF EXISTS "Biz owners upload docs" ON storage.objects;
DROP POLICY IF EXISTS "Biz owners delete docs" ON storage.objects;

CREATE POLICY "Biz owners view docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'business_documents'
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.owner_id = auth.uid()
        AND (storage.foldername(objects.name))[1] = b.id::text
    )
  );

CREATE POLICY "Biz owners upload docs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'business_documents'
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.owner_id = auth.uid()
        AND (storage.foldername(objects.name))[1] = b.id::text
    )
  );

CREATE POLICY "Biz owners delete docs" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'business_documents'
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.owner_id = auth.uid()
        AND (storage.foldername(objects.name))[1] = b.id::text
    )
  );

-- ============================================================
-- FIX 3: Fix business_assets storage policies
-- Same issue: storage.foldername(businesses.name) should be
-- storage.foldername(objects.name)
-- Path structure: business_images/{businessId}/...
-- So [2] index on the object path is correct
-- ============================================================
DROP POLICY IF EXISTS "Business owners can upload their images" ON storage.objects;
DROP POLICY IF EXISTS "Business owners can update their images" ON storage.objects;
DROP POLICY IF EXISTS "Business owners can delete their images" ON storage.objects;

CREATE POLICY "Business owners can upload their images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'business_assets'
  AND (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE owner_id = auth.uid()
      AND id::text = (storage.foldername(objects.name))[2]
    )
    OR EXISTS (
      SELECT 1 FROM public.businesses
      WHERE location_manager_id = auth.uid()
      AND id::text = (storage.foldername(objects.name))[2]
    )
  )
);

CREATE POLICY "Business owners can update their images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'business_assets'
  AND (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE owner_id = auth.uid()
      AND id::text = (storage.foldername(objects.name))[2]
    )
    OR EXISTS (
      SELECT 1 FROM public.businesses
      WHERE location_manager_id = auth.uid()
      AND id::text = (storage.foldername(objects.name))[2]
    )
  )
);

CREATE POLICY "Business owners can delete their images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'business_assets'
  AND (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE owner_id = auth.uid()
      AND id::text = (storage.foldername(objects.name))[2]
    )
    OR EXISTS (
      SELECT 1 FROM public.businesses
      WHERE location_manager_id = auth.uid()
      AND id::text = (storage.foldername(objects.name))[2]
    )
  )
);
