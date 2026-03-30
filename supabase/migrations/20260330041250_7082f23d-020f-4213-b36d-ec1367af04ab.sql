-- Fix search_path on the trigger function
create or replace function public.update_document_records_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;