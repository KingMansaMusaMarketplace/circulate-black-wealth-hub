import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Loader2, Users } from 'lucide-react';

type Source = { kind: 'claim'; campaignId: string } | { kind: 'holiday' };

interface Row {
  business: string;
  email: string;
  location: string;
  sentAt: string;
  status: string;
  detail: string;
}

const STATUS_STYLE: Record<string, string> = {
  sent: 'bg-mansablue-light/15 text-mansablue-light border-mansablue-light/40',
  claimed: 'bg-mansagold/15 text-mansagold border-mansagold/40',
  failed: 'bg-destructive/15 text-destructive border-destructive/40',
};

export const CampaignRecipientsDialog: React.FC<{ source: Source; title: string; triggerClassName?: string }> = ({
  source,
  title,
  triggerClassName,
}) => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoading(true);
      let raw: any[] = [];
      if (source.kind === 'claim') {
        const { data } = await supabase
          .from('business_claim_invites')
          .select('business_id,email,status,error_message,sent_at,claimed_at,created_at')
          .eq('campaign_id', source.campaignId)
          .order('created_at', { ascending: false })
          .limit(5000);
        raw = (data ?? []).map((r: any) => ({
          business_id: r.business_id,
          email: r.email,
          status: r.claimed_at ? 'claimed' : r.status,
          detail: r.error_message ?? (r.claimed_at ? `Claimed ${new Date(r.claimed_at).toLocaleDateString()}` : ''),
          at: r.sent_at ?? r.created_at,
        }));
      } else {
        const { data } = await supabase
          .from('holiday_campaign_sends')
          .select('business_id,email,wave,status,error,created_at')
          .order('created_at', { ascending: false })
          .limit(5000);
        const waves: Record<number, string> = { 1: 'Launch', 2: 'Reminder', 3: 'Last chance' };
        raw = (data ?? []).map((r: any) => ({
          business_id: r.business_id,
          email: r.email,
          status: r.status,
          detail: [waves[r.wave] ?? `Wave ${r.wave}`, r.error].filter(Boolean).join(' · '),
          at: r.created_at,
        }));
      }

      const ids = [...new Set(raw.map((r) => r.business_id).filter(Boolean))];
      const biz: Record<string, any> = {};
      for (let i = 0; i < ids.length; i += 200) {
        const { data } = await supabase
          .from('businesses')
          .select('id,business_name,city,state')
          .in('id', ids.slice(i, i + 200));
        (data ?? []).forEach((b: any) => (biz[b.id] = b));
      }

      setRows(
        raw.map((r) => {
          const b = biz[r.business_id];
          return {
            business: b?.business_name ?? 'Unknown business',
            email: r.email ?? '',
            location: [b?.city, b?.state].filter(Boolean).join(', '),
            sentAt: r.at ? new Date(r.at).toLocaleString() : '',
            status: r.status ?? '',
            detail: r.detail ?? '',
          };
        }),
      );
      setLoading(false);
    })();
  }, [open, source.kind, source.kind === 'claim' ? source.campaignId : '']);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === 'all' || r.status === filter) &&
        (!s || `${r.business} ${r.email} ${r.location}`.toLowerCase().includes(s)),
    );
  }, [rows, q, filter]);

  const download = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [
      ['Business', 'Email', 'Location', 'Sent', 'Status', 'Details'],
      ...shown.map((r) => [r.business, r.email, r.location, r.sentAt, r.status, r.detail]),
    ]
      .map((line) => line.map(esc).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}-recipients.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length, sent: 0, claimed: 0, failed: 0 };
    rows.forEach((r) => (c[r.status] = (c[r.status] ?? 0) + 1));
    return c;
  }, [rows]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={triggerClassName ?? 'border-mansagold/40 hover:bg-mansagold/10'}>
          <Users className="w-4 h-4 mr-2" /> View recipients
        </Button>
      </DialogTrigger>
      <DialogContent className="dark max-w-5xl bg-background text-foreground border-mansagold/30">
        <DialogHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mansagold">Who received this email</p>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search business, email or city"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs bg-background/60 border-mansagold/20"
          />
          {['all', 'sent', 'claimed', 'failed'].map((f) => (
            <Button
              key={f}
              size="sm"
              variant="outline"
              onClick={() => setFilter(f)}
              className={
                filter === f
                  ? 'bg-mansagold text-mansablue-dark border-mansagold hover:bg-mansagold-light capitalize'
                  : 'border-border capitalize'
              }
            >
              {f} ({counts[f] ?? 0})
            </Button>
          ))}
          <Button
            size="sm"
            onClick={download}
            disabled={!shown.length}
            className="ml-auto bg-mansagold text-mansablue-dark font-semibold hover:bg-mansagold-light"
          >
            <Download className="w-4 h-4 mr-2" /> Download spreadsheet
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-auto rounded-xl border border-border">
          {loading ? (
            <div className="py-16 text-center text-foreground/70">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-mansagold" /> Loading recipients…
            </div>
          ) : shown.length === 0 ? (
            <div className="py-16 text-center text-foreground/70">No emails sent yet for this campaign.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card text-left text-xs uppercase tracking-wider text-foreground/70">
                <tr>
                  <th className="p-3">Business</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Sent</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r, i) => (
                  <tr key={i} className="border-t border-border/60">
                    <td className="p-3 font-medium">{r.business}</td>
                    <td className="p-3 text-foreground/80">{r.email}</td>
                    <td className="p-3 text-foreground/80">{r.location || '—'}</td>
                    <td className="p-3 text-foreground/70 whitespace-nowrap">{r.sentAt}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-xs capitalize ${STATUS_STYLE[r.status] ?? 'border-border text-foreground/70'}`}
                      >
                        {r.status}
                      </span>
                      {r.detail && <div className="mt-1 text-xs text-foreground/60">{r.detail}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignRecipientsDialog;
