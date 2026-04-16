-- Tighten RLS on ai_chat_sessions: require authenticated users for INSERT, and restrict SELECT to owner only
DROP POLICY IF EXISTS "Anyone can create chat sessions" ON public.ai_chat_sessions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.ai_chat_sessions;

-- Delete existing anonymous (null user_id) sessions to remove already-exposed data
DELETE FROM public.ai_chat_sessions WHERE user_id IS NULL;

-- Make user_id NOT NULL going forward
ALTER TABLE public.ai_chat_sessions ALTER COLUMN user_id SET NOT NULL;

CREATE POLICY "Authenticated users can create their own sessions"
ON public.ai_chat_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions"
ON public.ai_chat_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);