-- Disable admin-only column trigger briefly for backfill
ALTER TABLE public.businesses DISABLE TRIGGER USER;

UPDATE public.businesses b
   SET email = u.email
  FROM auth.users u
 WHERE b.owner_id = u.id
   AND (b.email IS NULL OR b.email = '')
   AND u.email IS NOT NULL;

ALTER TABLE public.businesses ENABLE TRIGGER USER;