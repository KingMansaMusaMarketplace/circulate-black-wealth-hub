import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Row = { id: string; full_name: string; company: string; role: string | null; email: string; phone: string | null; status: string; created_at: string; viewing_started_at: string | null; viewing_expires_at: string | null };

export function osViewState(r: Pick<Row, 'status' | 'viewing_started_at' | 'viewing_expires_at'>, now = Date.now()) {
  if (r.status !== 'approved') return r.status === 'pending' ? 'Waiting' : 'Declined';
  if (!r.viewing_started_at) return 'Approved · not opened yet';
  return r.viewing_expires_at && Date.parse(r.viewing_expires_at) > now ? 'Viewing now' : 'Viewing hour ended';
}

export default function OsAccessRequests() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const load = useCallback(async () => {
    const { data, error } = await (supabase as any).from('os_access_requests').select('id,full_name,company,role,email,phone,status,created_at,viewing_started_at,viewing_expires_at').order('created_at', { ascending: false }).limit(200);
    setRows(error ? [] : data);
  }, []);
  useEffect(() => { load(); }, [load]);

  const decide = async (id: string, d: 'approve' | 'deny') => {
    setBusy(id);
    const { data, error } = await supabase.functions.invoke('os-access', { body: { action: 'admin_decide', id, d } });
    setBusy(null);
    if (error || !data?.ok) toast.error(data?.message ?? 'Not saved. Try again.'); else toast.success(data.message);
    load();
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">1325 OS Walkthrough Requests</h2>
      <p className="text-sm text-muted-foreground">Approving emails the visitor a private link for one 60-minute viewing, starting when they first open it.</p>
      {!rows ? <p>Loading…</p> : rows.length === 0 ? <p className="text-muted-foreground">No requests yet.</p> : (
        <div className="space-y-3">
          {rows.map(r => (
            <div key={r.id} className="rounded-lg border border-border p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{r.full_name} · {r.company}</p>
                <p className="text-sm text-muted-foreground">{[r.role, r.email, r.phone].filter(Boolean).join(' · ')}</p>
                <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()} · {osViewState(r)}</p>
              </div>
              {r.status === 'pending' && <div className="flex gap-2">
                <Button size="sm" disabled={busy === r.id} onClick={() => decide(r.id, 'approve')}>Approve</Button>
                <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => decide(r.id, 'deny')}>Decline</Button>
              </div>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
