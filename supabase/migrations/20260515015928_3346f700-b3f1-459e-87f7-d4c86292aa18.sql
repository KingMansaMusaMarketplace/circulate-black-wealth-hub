
-- Create public bucket for Mansa Stays property photos
insert into storage.buckets (id, name, public)
values ('property-photos', 'property-photos', true)
on conflict (id) do nothing;

-- Anyone can view photos (bucket is public, but explicit policy for clarity)
create policy "Property photos are publicly viewable"
on storage.objects
for select
using (bucket_id = 'property-photos');

-- Authenticated users can upload to their own folder (folder = user id)
create policy "Hosts can upload their own property photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'property-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Hosts can update their own photos
create policy "Hosts can update their own property photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'property-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Hosts can delete their own photos
create policy "Hosts can delete their own property photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'property-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
