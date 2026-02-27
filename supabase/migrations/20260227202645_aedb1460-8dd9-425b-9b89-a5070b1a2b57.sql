-- Create marketing-assets storage bucket for generated share cards
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketing-assets', 'marketing-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload marketing assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'marketing-assets' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Public read access for share cards
CREATE POLICY "Marketing assets are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'marketing-assets');

-- Allow users to manage their own files
CREATE POLICY "Users can update their marketing assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'marketing-assets' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Users can delete their marketing assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'marketing-assets' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);