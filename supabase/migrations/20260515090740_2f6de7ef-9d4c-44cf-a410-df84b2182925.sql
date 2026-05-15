DO $$
DECLARE
  uids uuid[] := ARRAY[
    '6a7a0c91-3e47-400a-8392-7644f1e2e782'::uuid,
    'f6d01477-1543-4091-80e4-b720dcd3b464'::uuid,
    '0a20ddd6-8d5d-4caa-b0ac-324a520a0db0'::uuid,
    '69c590d8-4e00-49f0-97f3-fd7f46853a5f'::uuid
  ];
  circle_ids uuid[];
  r record;
BEGIN
  -- Susu circles created by these users
  SELECT array_agg(id) INTO circle_ids FROM public.susu_circles WHERE creator_id = ANY(uids);
  IF circle_ids IS NOT NULL THEN
    DELETE FROM public.susu_escrow WHERE circle_id = ANY(circle_ids);
    DELETE FROM public.susu_memberships WHERE circle_id = ANY(circle_ids);
    DELETE FROM public.susu_circles WHERE id = ANY(circle_ids);
  END IF;

  -- Generic sweep: delete any rows in public schema that FK-reference auth.users or public.profiles(id)
  FOR r IN
    SELECT c.conrelid::regclass::text AS tbl, a.attname AS col
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
    WHERE c.contype = 'f'
      AND (c.confrelid = 'auth.users'::regclass OR c.confrelid = 'public.profiles'::regclass)
      AND c.connamespace = 'public'::regnamespace
  LOOP
    EXECUTE format('DELETE FROM %s WHERE %I = ANY($1)', r.tbl, r.col) USING uids;
  END LOOP;

  DELETE FROM public.profiles WHERE id = ANY(uids);
  DELETE FROM auth.users WHERE id = ANY(uids);
END $$;