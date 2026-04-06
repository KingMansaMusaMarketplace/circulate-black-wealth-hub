
-- Fix: Make ambassador-materials bucket private and remove public access policy
UPDATE storage.buckets SET public = false WHERE id = 'ambassador-materials';

-- Drop the permissive public policy
DROP POLICY IF EXISTS "Anyone can view ambassador materials" ON storage.objects;

-- Create agent-scoped read policy for ambassador-materials
CREATE POLICY "Active agents can view ambassador materials"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'ambassador-materials'
  AND EXISTS (
    SELECT 1 FROM sales_agents
    WHERE user_id = auth.uid() AND is_active = true
  )
);
