
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
SET search_path = public
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
