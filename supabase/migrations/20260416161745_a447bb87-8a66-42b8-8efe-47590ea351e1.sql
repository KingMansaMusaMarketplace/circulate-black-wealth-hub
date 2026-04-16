
-- AI Chat Sessions for Shopping Assistant
CREATE TABLE public.ai_chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create chat sessions"
  ON public.ai_chat_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own sessions"
  ON public.ai_chat_sessions FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.ai_chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON public.ai_chat_sessions FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_ai_chat_sessions_user_id ON public.ai_chat_sessions(user_id);

-- AI Review Summaries (cached)
CREATE TABLE public.ai_review_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  review_count INTEGER NOT NULL DEFAULT 0,
  review_hash TEXT,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id)
);

ALTER TABLE public.ai_review_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view review summaries"
  ON public.ai_review_summaries FOR SELECT
  USING (true);

CREATE INDEX idx_ai_review_summaries_business ON public.ai_review_summaries(business_id);
