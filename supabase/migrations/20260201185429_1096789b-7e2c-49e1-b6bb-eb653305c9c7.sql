
-- Create the business_assets storage bucket for business logos, banners, and product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'business_assets', 
  'business_assets', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Policy: Business owners can upload images to their own folder
CREATE POLICY "Business owners can upload their images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business_assets' 
  AND (
    -- Check if user owns a business with this ID (folder structure: business_images/{businessId}/...)
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE owner_id = auth.uid() 
      AND id::text = (storage.foldername(name))[2]
    )
    OR
    -- Also allow location managers
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE location_manager_id = auth.uid() 
      AND id::text = (storage.foldername(name))[2]
    )
  )
);

-- Policy: Business owners can update their images
CREATE POLICY "Business owners can update their images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'business_assets' 
  AND (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE owner_id = auth.uid() 
      AND id::text = (storage.foldername(name))[2]
    )
    OR
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE location_manager_id = auth.uid() 
      AND id::text = (storage.foldername(name))[2]
    )
  )
);

-- Policy: Business owners can delete their images
CREATE POLICY "Business owners can delete their images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'business_assets' 
  AND (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE owner_id = auth.uid() 
      AND id::text = (storage.foldername(name))[2]
    )
    OR
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE location_manager_id = auth.uid() 
      AND id::text = (storage.foldername(name))[2]
    )
  )
);

-- Policy: Anyone can view business assets (public bucket)
CREATE POLICY "Anyone can view business assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'business_assets');
