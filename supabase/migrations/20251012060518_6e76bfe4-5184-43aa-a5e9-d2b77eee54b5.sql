-- Create storage bucket for sponsor logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('sponsor-logos', 'sponsor-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to sponsor logos
CREATE POLICY "Public read access to sponsor logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'sponsor-logos');

-- Allow authenticated sponsors to upload their own logo
CREATE POLICY "Sponsors can upload their own logo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sponsor-logos'
  AND auth.uid() IN (
    SELECT user_id 
    FROM corporate_subscriptions 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- Allow sponsors to update their own logo
CREATE POLICY "Sponsors can update their own logo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'sponsor-logos'
  AND auth.uid() IN (
    SELECT user_id 
    FROM corporate_subscriptions 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- Allow sponsors to delete their own logo
CREATE POLICY "Sponsors can delete their own logo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'sponsor-logos'
  AND auth.uid() IN (
    SELECT user_id 
    FROM corporate_subscriptions 
    WHERE id::text = (storage.foldername(name))[1]
  )
);