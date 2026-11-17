CREATE TABLE public.kayla_chat_preferences (
  user_id uuid PRIMARY KEY,
  memory_enabled boolean NOT NULL DEFAULT true,
  adult_confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.kayla_chat_preferences TO authenticated;
GRANT ALL ON public.kayla_chat_preferences TO service_role;

ALTER TABLE public.kayla_chat_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read their own Kayla chat preferences"
  ON public.kayla_chat_preferences FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users create their own Kayla chat preferences"
  ON public.kayla_chat_preferences FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their own Kayla chat preferences"
  ON public.kayla_chat_preferences FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.kayla_chat_preferences_stamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  IF TG_OP = 'INSERT' THEN
    NEW.created_at := now();
    IF NEW.adult_confirmed_at IS NOT NULL THEN
      NEW.adult_confirmed_at := now();
    END IF;
  ELSIF NEW.adult_confirmed_at IS DISTINCT FROM OLD.adult_confirmed_at THEN
    NEW.adult_confirmed_at := CASE WHEN NEW.adult_confirmed_at IS NULL THEN NULL ELSE now() END;
  END IF;
  NEW.user_id := COALESCE(OLD.user_id, NEW.user_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER kayla_chat_preferences_stamp
  BEFORE INSERT OR UPDATE ON public.kayla_chat_preferences
  FOR EACH ROW EXECUTE FUNCTION public.kayla_chat_preferences_stamp();