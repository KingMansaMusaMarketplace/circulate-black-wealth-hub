-- Fix 1: corporate_subscriptions exposed Stripe IDs to all authenticated users.
-- Drop broad authenticated SELECT policies. The corporate_subscriptions_public view
-- already exposes the safe columns for public-facing UI. Owners and admins keep access.

DROP POLICY IF EXISTS "Authenticated can view active visible sponsors" ON public.corporate_subscriptions;
DROP POLICY IF EXISTS "Authenticated can view enabled sponsor landing pages" ON public.corporate_subscriptions;
DROP POLICY IF EXISTS "Authenticated users can view approved sponsors" ON public.corporate_subscriptions;

-- Fix 2: rag_embeddings was readable by all authenticated users.
-- RAG retrieval happens in edge functions (service role). Restrict to service_role only.

DROP POLICY IF EXISTS "Authenticated users can read embeddings" ON public.rag_embeddings;