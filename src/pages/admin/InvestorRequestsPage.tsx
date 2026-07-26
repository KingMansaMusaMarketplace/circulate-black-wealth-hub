import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, XCircle, ExternalLink, Mail } from 'lucide-react';

interface Row {
  id: string;
  name: string;
  email: string;
  firm: string;
  title: string | null;
  aum: string | null;
  linkedin_url: string | null;
  reason: string | null;
  status: 'pending' | 'approved' | 'denied';
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  approval_email_sent_at: string | null;
}

const InvestorRequestsPage: React.FC = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'pending' | 'approved' | 'denied' | 'all'>('pending');

  const load = async () => {
    setLoading(true);
    let q = supabase.from('investor_access_requests').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter);
    const { data, error } = await q;
    if (error) {
      toast({ title: 'Failed to load', description: error.message, variant: 'destructive' });
    } else {
      setRows((data ?? []) as Row[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const decide = async (id: string, status: 'approved' | 'denied') => {
    const { data: userRes } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('investor_access_requests')
      .update({
        status,
        admin_notes: notesDraft[id] ?? null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: userRes.user?.id ?? null,
      })
      .eq('id', id);
    if (error) return toast({ title: 'Update failed', description: error.message, variant: 'destructive' });

    if (status === 'approved') {
      toast({ title: 'Approved — sending NDA email…' });
      const { data: sendData, error: sendErr } = await supabase.functions.invoke('send-investor-approval', {
        body: { request_id: id },
      });
      if (sendErr || (sendData as any)?.error) {
        toast({
          title: 'Approved, but email failed',
          description: (sendData as any)?.error ?? sendErr?.message ?? 'Unknown error',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'NDA + passcode emailed to investor' });
      }
    } else {
      toast({ title: 'Denied' });
    }
    load();
  };

  const resendEmail = async (id: string) => {
    toast({ title: 'Sending NDA email…' });
    const { data: sendData, error: sendErr } = await supabase.functions.invoke('send-investor-approval', {
      body: { request_id: id },
    });
    if (sendErr || (sendData as any)?.error) {
      toast({
        title: 'Email failed',
        description: (sendData as any)?.error ?? sendErr?.message ?? 'Unknown error',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'NDA + passcode re-sent' });
      load();
    }
  };

  const statusBadge = (s: Row['status']) => {
    const map = {
      pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
      approved: 'bg-green-500/15 text-green-400 border-green-500/30',
      denied: 'bg-red-500/15 text-red-400 border-red-500/30',
    };
    return <Badge className={`${map[s]} border`}>{s}</Badge>;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <Helmet><title>Investor Requests | Admin</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Investor Access Requests</h1>
            <p className="text-slate-400 text-sm mt-1">Review, approve, or deny requests for the NDA-gated data room.</p>
          </div>
          <div className="flex gap-2">
            {(['pending', 'approved', 'denied', 'all'] as const).map((f) => (
              <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'}
                onClick={() => setFilter(f)}
                className={filter === f ? 'bg-mansagold text-slate-900 hover:bg-mansagold/90' : 'border-white/20 text-white hover:bg-white/10'}>
                {f}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-mansagold" /></div>
        ) : rows.length === 0 ? (
          <Card className="bg-white/[0.03] border-white/10 p-10 text-center text-slate-400">No requests in this view.</Card>
        ) : (
          <div className="space-y-4">
            {rows.map((r) => (
              <Card key={r.id} className="bg-white/[0.03] border-white/10 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-semibold">{r.name}</h3>
                      {statusBadge(r.status)}
                    </div>
                    <p className="text-slate-300">{r.firm}{r.title ? ` — ${r.title}` : ''}</p>
                    <a href={`mailto:${r.email}`} className="text-mansagold text-sm hover:underline">{r.email}</a>
                    <p className="text-xs text-slate-500 mt-1">{new Date(r.created_at).toLocaleString()}</p>
                  </div>
                  {r.linkedin_url && (
                    <a href={r.linkedin_url} target="_blank" rel="noreferrer"
                       className="text-sm text-slate-300 hover:text-mansagold flex items-center gap-1">
                      LinkedIn <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-300 mb-4">
                  {r.aum && <div><span className="text-slate-500">AUM:</span> {r.aum}</div>}
                  {r.reason && <div className="md:col-span-2"><span className="text-slate-500">Reason:</span> {r.reason}</div>}
                  {r.admin_notes && <div className="md:col-span-2"><span className="text-slate-500">Admin notes:</span> {r.admin_notes}</div>}
                </div>
                {r.status === 'pending' && (
                  <>
                    <Textarea
                      placeholder="Optional internal notes…"
                      value={notesDraft[r.id] ?? ''}
                      onChange={(e) => setNotesDraft({ ...notesDraft, [r.id]: e.target.value })}
                      className="bg-black/40 border-white/15 text-white mb-3"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => decide(r.id, 'approved')} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-4 w-4 mr-1.5" /> Approve
                      </Button>
                      <Button onClick={() => decide(r.id, 'denied')} variant="outline" className="border-red-500/40 text-red-400 hover:bg-red-500/10">
                        <XCircle className="h-4 w-4 mr-1.5" /> Deny
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorRequestsPage;
