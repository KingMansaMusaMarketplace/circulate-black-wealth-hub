import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BASE = `${import.meta.env.VITE_SUPABASE_URL || 'https://agoclnqfyinwjxdmjnns.supabase.co'}/functions/v1`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type Preview = { name: string; title: string; details: string[]; status: string; open: boolean };
type Outcome = { ok: boolean; title: string; message: string };

const LABEL: Record<string, string> = { approve: 'Approve now', deny: 'Decline', revoke: 'Revoke access' };

/** Phone-friendly confirmation for approve/deny buttons in admin emails. Opening the page changes nothing. */
export default function EmailDecisionPage() {
  const [p] = useSearchParams();
  const k = p.get('k') ?? '', id = p.get('id') ?? '', d = p.get('d') ?? '', t = p.get('t') ?? '';
  const [preview, setPreview] = useState<Preview | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [busy, setBusy] = useState(false);

  const call = async (op: 'preview' | 'decide') => {
    const clinical = k === 'clinical';
    const body = clinical ? { action: op === 'preview' ? 'email_preview' : 'email_decide', id, t, d } : { op, kind: k, id, d, t };
    const res = await fetch(`${BASE}/${clinical ? 'health-access' : 'email-decision'}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: `Bearer ${ANON}` }, body: JSON.stringify(body),
    });
    return { status: res.status, data: await res.json().catch(() => ({})) };
  };

  useEffect(() => {
    call('preview').then(({ data }) => {
      if (data?.ok) setPreview(data); else setOutcome({ ok: false, title: 'Link not valid', message: data?.error ?? 'This link is not valid or has expired. Use the Admin Dashboard instead.' });
    }).catch(() => setOutcome({ ok: false, title: 'Could not load', message: 'Check your connection and reopen the email link.' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decide = async () => {
    setBusy(true);
    try {
      const { data } = await call('decide');
      setOutcome({ ok: !!data?.ok, title: data?.title ?? 'Not saved', message: data?.message ?? data?.error ?? 'Nothing was changed. Try again.' });
    } catch { setOutcome({ ok: false, title: 'Not saved', message: 'Check your connection. Nothing was changed.' }); }
    setBusy(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-5">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <p className="text-xs font-bold tracking-widest text-primary">1325.AI · ADMIN DECISION</p>
        {outcome ? (
          <div className="mt-6 text-center">
            {outcome.ok ? <CheckCircle2 className="mx-auto h-16 w-16 text-primary" /> : <XCircle className="mx-auto h-16 w-16 text-destructive" />}
            <h1 className="mt-4 text-2xl font-bold">{outcome.title}</h1>
            <p className="mt-3 text-muted-foreground">{outcome.message}</p>
          </div>
        ) : !preview ? (
          <div className="mt-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : (
          <>
            <h1 className="mt-3 text-2xl font-bold">{preview.title}</h1>
            <div className="mt-4 rounded-xl bg-muted p-4">
              <p className="text-lg font-semibold">{preview.name}</p>
              {preview.details.filter(Boolean).map((x) => <p key={x} className="text-sm text-muted-foreground break-words">{x}</p>)}
            </div>
            {preview.open ? (
              <>
                <p className="mt-4 text-sm text-muted-foreground">Nothing has changed yet. Tap the button to confirm.</p>
                <Button size="lg" variant={d === 'approve' ? 'default' : 'destructive'} className="mt-4 h-14 w-full text-lg" disabled={busy} onClick={decide}>
                  {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : LABEL[d] ?? 'Confirm'}
                </Button>
              </>
            ) : (
              <p className="mt-4 text-muted-foreground">This was already decided (status: {preview.status.replace(/_/g, ' ')}). Nothing to do.</p>
            )}
          </>
        )}
        <a href="/admin-dashboard" className="mt-6 block text-center text-sm text-muted-foreground underline">Open Admin Dashboard instead</a>
      </div>
    </main>
  );
}
