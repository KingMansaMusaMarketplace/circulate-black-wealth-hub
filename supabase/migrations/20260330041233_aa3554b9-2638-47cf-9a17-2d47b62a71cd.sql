-- Document records table for records management (Service #19)
create table public.document_records (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_size bigint,
  mime_type text,
  document_type text,
  extracted_fields jsonb default '{}'::jsonb,
  ocr_text text,
  expiration_date timestamptz,
  alert_sent boolean default false,
  alert_sent_at timestamptz,
  processing_status text default 'pending',
  processing_error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Document embeddings table using pgvector
create table public.document_embeddings (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.document_records(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  chunk_index int not null default 0,
  chunk_text text not null,
  embedding vector(768),
  created_at timestamptz default now()
);

-- Indexes
create index idx_document_records_business on public.document_records(business_id);
create index idx_document_records_expiration on public.document_records(expiration_date) where expiration_date is not null;
create index idx_document_embeddings_business on public.document_embeddings(business_id);
create index idx_document_embeddings_vector on public.document_embeddings using hnsw (embedding vector_cosine_ops);

-- RLS
alter table public.document_records enable row level security;
alter table public.document_embeddings enable row level security;

create policy "Business owners can manage documents"
  on public.document_records for all to authenticated
  using (exists (select 1 from public.businesses b where b.id = document_records.business_id and b.owner_id = auth.uid()))
  with check (exists (select 1 from public.businesses b where b.id = document_records.business_id and b.owner_id = auth.uid()));

create policy "Admins can view all documents"
  on public.document_records for select to authenticated
  using (public.is_admin_secure());

create policy "Business owners can manage embeddings"
  on public.document_embeddings for all to authenticated
  using (exists (select 1 from public.businesses b where b.id = document_embeddings.business_id and b.owner_id = auth.uid()))
  with check (exists (select 1 from public.businesses b where b.id = document_embeddings.business_id and b.owner_id = auth.uid()));

create policy "Admins can view all embeddings"
  on public.document_embeddings for select to authenticated
  using (public.is_admin_secure());

-- Storage bucket
insert into storage.buckets (id, name, public, file_size_limit)
values ('business_documents', 'business_documents', false, 20971520)
on conflict (id) do nothing;

create policy "Biz owners upload docs"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'business_documents' and exists (select 1 from public.businesses b where b.owner_id = auth.uid() and (storage.foldername(name))[1] = b.id::text));

create policy "Biz owners view docs"
  on storage.objects for select to authenticated
  using (bucket_id = 'business_documents' and exists (select 1 from public.businesses b where b.owner_id = auth.uid() and (storage.foldername(name))[1] = b.id::text));

create policy "Biz owners delete docs"
  on storage.objects for delete to authenticated
  using (bucket_id = 'business_documents' and exists (select 1 from public.businesses b where b.owner_id = auth.uid() and (storage.foldername(name))[1] = b.id::text));

-- Vector similarity search RPC
create or replace function public.match_document_chunks(
  query_embedding vector(768),
  match_business_id uuid,
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (id uuid, document_id uuid, chunk_text text, similarity float)
language sql stable security definer
set search_path = public
as $$
  select de.id, de.document_id, de.chunk_text,
    1 - (de.embedding <=> query_embedding) as similarity
  from public.document_embeddings de
  where de.business_id = match_business_id
    and 1 - (de.embedding <=> query_embedding) > match_threshold
  order by de.embedding <=> query_embedding
  limit match_count;
$$;

-- Updated_at trigger
create or replace function public.update_document_records_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;

create trigger update_document_records_updated_at
  before update on public.document_records
  for each row execute function public.update_document_records_updated_at();