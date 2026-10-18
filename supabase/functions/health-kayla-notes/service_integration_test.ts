import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

const url = Deno.env.get('SUPABASE_URL') ?? 'https://agoclnqfyinwjxdmjnns.supabase.co';
// Public project API key, never a service-role or authenticated user token.
const anon = Deno.env.get('SUPABASE_ANON_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFub2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ';
for (const fn of ['health-kayla-notes', 'health-kayla-review']) {
  Deno.test({ name: `deployed ${fn} rejects anonymous generation`, ignore: !url || !anon, fn: async () => {
    const response = await fetch(`${url}/functions/v1/${fn}`, { method: 'POST', headers: { apikey: anon ?? '', 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'generate', clinic_id: '00000000-0000-0000-0000-000000000001', sample_visit_id: 'visit-knee-v1' }) });
    await response.text(); assertEquals(response.status, 401);
  } });
  Deno.test({ name: `deployed ${fn} rejects invalid authenticated caller`, ignore: !url || !anon, fn: async () => {
    const response = await fetch(`${url}/functions/v1/${fn}`, { method: 'POST', headers: { apikey: anon ?? '', Authorization: 'Bearer invalid-fictional-token', 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'decision', owner_id: '00000000-0000-0000-0000-000000000002' }) });
    await response.text(); assertEquals(response.status, 401);
  } });
}