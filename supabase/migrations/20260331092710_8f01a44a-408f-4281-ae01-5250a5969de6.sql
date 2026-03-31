
-- ============================================================
-- FIX 1: kayla_outcome_feedback SELECT policy - restrict to admins
-- ============================================================
DROP POLICY IF EXISTS "Admins can read outcome feedback" ON public.kayla_outcome_feedback;

CREATE POLICY "Admins can read outcome feedback" ON public.kayla_outcome_feedback
  FOR SELECT TO authenticated
  USING (public.is_admin_secure());

-- ============================================================
-- FIX 2: Remove transactions from Realtime publication
-- Financial data should NOT be broadcast to all subscribers
-- ============================================================
ALTER PUBLICATION supabase_realtime DROP TABLE public.transactions;

-- ============================================================
-- FIX 3: Add RLS to realtime.messages for channel authorization
-- ============================================================
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

-- Allow users to only receive messages on channels they are authorized for
-- This uses a restrictive approach: only allow if the topic contains the user's ID
-- or is a public topic
CREATE POLICY "Users receive own data channels only"
  ON realtime.messages
  FOR SELECT TO authenticated
  USING (
    -- Allow if topic contains the user's own ID (scoped channels)
    (realtime.topic()::text ILIKE '%' || auth.uid()::text || '%')
    -- Allow admin access to all channels
    OR public.is_admin_secure()
    -- Allow public stat channels
    OR realtime.topic()::text IN ('community_wealth_stats')
  );

-- ============================================================
-- FIX 4: Fix business_documents storage policies
-- Replace storage.foldername(b.name) with storage.foldername(name)
-- where 'name' refers to the storage object path, not business name
-- ============================================================

-- Drop broken policies
DROP POLICY IF EXISTS "Biz owners view docs" ON storage.objects;
DROP POLICY IF EXISTS "Biz owners upload docs" ON storage.objects;
DROP POLICY IF EXISTS "Biz owners delete docs" ON storage.objects;

-- Recreate with correct path logic:
-- Objects are stored as: {business_id}/filename.ext
-- So foldername(objects.name)[1] should equal the business ID

CREATE POLICY "Biz owners view docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'business_documents'
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.owner_id = auth.uid()
        AND (storage.foldername(name))[1] = b.id::text
    )
  );

CREATE POLICY "Biz owners upload docs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'business_documents'
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.owner_id = auth.uid()
        AND (storage.foldername(name))[1] = b.id::text
    )
  );

CREATE POLICY "Biz owners delete docs" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'business_documents'
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.owner_id = auth.uid()
        AND (storage.foldername(name))[1] = b.id::text
    )
  );
