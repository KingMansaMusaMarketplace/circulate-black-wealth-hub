
-- =============================================
-- FIX 1: Prevent anon users from reading email/phone on businesses table
-- Use column-level privileges to revoke access to sensitive columns
-- =============================================

-- Revoke column-level SELECT on sensitive columns from anon role
REVOKE SELECT (email, phone, owner_id) ON public.businesses FROM anon;

-- =============================================
-- FIX 2: Restrict rag_embeddings to authenticated users only
-- =============================================

-- Drop the overly permissive public read policy
DROP POLICY IF EXISTS "Anyone can read embeddings" ON public.rag_embeddings;

-- Create a new policy restricted to authenticated users
CREATE POLICY "Authenticated users can read embeddings"
ON public.rag_embeddings
FOR SELECT
TO authenticated
USING (true);

-- =============================================
-- FIX 3: Restrict answering_call_logs INSERT to service_role only
-- The edge function uses service_role key, so anon/authenticated don't need direct insert
-- =============================================

DROP POLICY IF EXISTS "Service can insert call logs" ON public.answering_call_logs;

CREATE POLICY "Service role can insert call logs"
ON public.answering_call_logs
FOR INSERT
TO service_role
WITH CHECK (true);
