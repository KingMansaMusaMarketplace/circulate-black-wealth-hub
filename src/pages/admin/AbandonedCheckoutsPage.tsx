import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, Download, Mail, ShoppingCart } from 'lucide-react';

interface Row {
  id: string;
  created: number;
  status: string;
  payment_status: string;
  mode: string;
  amount: number;
  currency: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  customer_id: string | null;
  recovery_url: string | null;
}

interface Summary {
  total_sessions: number;
  completed: number;
  abandoned: number;
  with_contact: number;
  conversion_rate: number;
  potential_value: number;
}

const AbandonedCheckoutsPage: React.FC = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(90);
  const [search, setSearch] = useState('');

  const load = useCallback(async (rangeDays: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-abandoned-checkouts', {
        body: { days: rangeDays },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setRows(data.rows ?? []);
      setSummary(data.summary ?? null);
    } catch (e) {
      toast({
        title: 'Could not load abandoned checkouts',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load(days);
  }, [load, days]);

  const filtered = rows.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (r.email ?? '').toLowerCase().includes(q) ||
      (r.name ?? '').toLowerCase().includes(q)
    );
  });

  const exportCsv = () => {
    const header = ['Date', 'Name', 'Email', 'Phone', 'Amount', 'Currency', 'Type', 'Status', 'Stripe Customer'];
    const lines = filtered.map((r) => [
      new Date(r.created * 1000).toISOString().slice(0, 10),
      r.name ?? '',
      r.email ?? '',
      r.phone ?? '',
      r.amount.toFixed(2),
      r.currency,
      r.mode,
      r.status,
      r.customer_id ?? '',
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const csv = [header.join(','), ...lines].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `abandoned-checkouts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const mailtoFor = (r: Row) => {
    const subject = encodeURIComponent('Finishing your 1325.AI signup');
    const body = encodeURIComponent(
      `Hi ${r.name ? r.name.split(' ')[0] : 'there'},\n\n` +
      `I noticed you started signing up on 1325.AI but didn't get to finish. ` +
      `If you ran into anything confusing or have a question about the plans, just reply here and I'll help personally.\n\n` +
      `You can pick up where you left off any time at https://www.1325.ai/signup\n\n` +
      `Thank you,\nThe 1325.AI Team`
    );
    return `mailto:${r.email}?subject=${subject}&body=${body}`;
  };

  const stat = (label: string, value: string | number, hint?: string) => (
    <Card className="border-border/60 bg-card/60 backdrop-blur">
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <Helmet>
        <title>Abandoned Checkouts | 1325.AI Admin</title>
        <meta name="description" content="Internal report of abandoned Stripe checkouts with contact details for follow-up." />
      </Helmet>

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground md:text-3xl">
              <ShoppingCart className="h-6 w-6 text-primary" />
              Abandoned Checkouts
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              People who started checkout but never paid. Reach out personally.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[30, 90, 180, 365].map((d) => (
              <Button
                key={d}
                size="sm"
                variant={days === d ? 'default' : 'outline'}
                onClick={() => setDays(d)}
              >
                {d}d
              </Button>
            ))}
            <Button size="sm" variant="outline" onClick={() => load(days)} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={exportCsv} disabled={!filtered.length}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
          </div>
        </div>

        {summary && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stat('Abandoned', summary.abandoned, `${summary.with_contact} have an email`)}
            {stat('Completed', summary.completed, `${summary.conversion_rate}% conversion`)}
            {stat('Sessions started', summary.total_sessions, `Last ${summary.total_sessions ? days : days} days`)}
            {stat('Potential value', `$${summary.potential_value.toLocaleString()}`, 'If all abandoned carts closed')}
          </div>
        )}

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle className="text-base">Follow-up list</CardTitle>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email"
              className="max-w-xs"
            />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading from Stripe…
              </div>
            ) : filtered.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No abandoned checkouts in this period.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="py-3 pr-4">Date</th>
                      <th className="py-3 pr-4">Name</th>
                      <th className="py-3 pr-4">Email</th>
                      <th className="py-3 pr-4">Amount</th>
                      <th className="py-3 pr-4">Type</th>
                      <th className="py-3 pr-4">Status</th>
                      <th className="py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className="border-b border-border/40 hover:bg-muted/30">
                        <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">
                          {new Date(r.created * 1000).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4">{r.name || <span className="text-muted-foreground">—</span>}</td>
                        <td className="py-3 pr-4">
                          {r.email || <span className="text-muted-foreground">no email captured</span>}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          {r.amount > 0 ? `$${r.amount.toFixed(2)}` : '—'}
                        </td>
                        <td className="py-3 pr-4 capitalize text-muted-foreground">{r.mode}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={r.status === 'open' ? 'default' : 'secondary'}>
                            {r.status === 'open' ? 'still open' : 'expired'}
                          </Badge>
                        </td>
                        <td className="py-3">
                          {r.email ? (
                            <Button asChild size="sm" variant="outline">
                              <a href={mailtoFor(r)}>
                                <Mail className="mr-2 h-3.5 w-3.5" />
                                Email
                              </a>
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AbandonedCheckoutsPage;
