-- Remove broad SELECT policies on public buckets that allow file enumeration
-- Public bucket files are still accessible via direct URLs without SELECT policies

DROP POLICY IF EXISTS "Anyone can view business assets" ON storage.objects;
DROP POLICY IF EXISTS "Marketing assets are publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to sponsor logos" ON storage.objects;