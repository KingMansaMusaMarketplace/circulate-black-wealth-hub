
-- Enable pgvector in public schema
CREATE EXTENSION IF NOT EXISTS vector SCHEMA public;

-- Unified embeddings table for all content types
CREATE TABLE public.rag_embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  content_text TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint to avoid duplicate embeddings
CREATE UNIQUE INDEX idx_rag_embeddings_unique ON public.rag_embeddings (content_type, content_id);

-- Enable RLS
ALTER TABLE public.rag_embeddings ENABLE ROW LEVEL SECURITY;

-- Public read access (this is public directory/review data)
CREATE POLICY "Anyone can read embeddings"
  ON public.rag_embeddings FOR SELECT
  USING (true);

-- Only service role can insert/update/delete (edge functions)
CREATE POLICY "Service role can manage embeddings"
  ON public.rag_embeddings FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Semantic search function
CREATE OR REPLACE FUNCTION public.match_embeddings(
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 10,
  filter_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content_type TEXT,
  content_id UUID,
  content_text TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    re.id,
    re.content_type,
    re.content_id,
    re.content_text,
    re.metadata,
    1 - (re.embedding <=> query_embedding) AS similarity
  FROM public.rag_embeddings re
  WHERE 
    (filter_type IS NULL OR re.content_type = filter_type)
    AND 1 - (re.embedding <=> query_embedding) > match_threshold
  ORDER BY re.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Updated_at trigger
CREATE TRIGGER update_rag_embeddings_updated_at
  BEFORE UPDATE ON public.rag_embeddings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
