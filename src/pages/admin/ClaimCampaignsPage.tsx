import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Plus, Send, RefreshCw, Users } from 'lucide-react';
import CampaignRecipientsDialog from '@/components/admin/CampaignRecipientsDialog';

interface Campaign {
  id: string;
  name: string;
  target_city: string | null;
  target_state: string | null;
  target_category: string | null;
  daily_limit: number;
  status: string;
  total_sent: number;
  total_claimed: number;
  last_run_at: string | null;
  created_at: string;
}

const ClaimCampaignsPage: React.FC = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [stats, setStats] = useState({ unclaimed: 0, invited: 0, claimed: 0 });
  const [testTo, setTestTo] = useState('Clarence@1325.ai');

  const [form, setForm] = useState({
    name: '',
    target_city: '',
    target_state: 'GA',
    target_category: '',
    daily_limit: 200,
  });

  const load = async () => {
    setLoading(true);
    const [{ data, error }, unclaimed, invited, claimed] = await Promise.all([
      supabase.from('business_claim_campaigns').select('*').order('created_at', { ascending: false }),
      (supabase.rpc as any)('count_claim_ready').then((r: any) => ({ count: Number(r.data ?? 0) })),
      supabase.from('businesses').select('id', { count: 'exact', head: true }).not('claim_invited_at', 'is', null),
      supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('claim_status', 'claimed'),
    ]);

    if (error) {
      toast({ title: 'Failed to load campaigns', description: error.message, variant: 'destructive' });
    } else {
      setCampaigns((data ?? []) as Campaign[]);
    }
    setStats({
      unclaimed: unclaimed.count ?? 0,
      invited: invited.count ?? 0,
      claimed: claimed.count ?? 0,
    });
    setLoading(false);
  };

  const [finder, setFinder] = useState<{ checked: number; found: number; left: number } | null>(null);
  useEffect(() => {
    load();
    supabase.functions.invoke('find-business-emails', { body: { stats: true } }).then(({ data }) => {
      if (data && typeof data.checked === 'number') setFinder(data);
    });
  }, []);

  const createCampaign = async () => {
    if (!form.name.trim()) {
      toast({ title: 'Give the campaign a name', variant: 'destructive' });
      return;
    }
    setCreating(true);
    const { error } = await supabase.from('business_claim_campaigns').insert({
      name: form.name.trim(),
      target_city: form.target_city.trim() || null,
      target_state: form.target_state.trim() || null,
      target_category: form.target_category.trim() || null,
      daily_limit: Math.min(Math.max(Number(form.daily_limit) || 200, 1), 500),
      status: 'draft',
    });
    setCreating(false);
    if (error) {
      toast({ title: 'Could not create campaign', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Campaign created' });
    setForm({ name: '', target_city: '', target_state: 'GA', target_category: '', daily_limit: 200 });
    load();
  };

  const runBatch = async (id: string, dryRun: boolean) => {
    setBusy(id);
    try {
      const { data, error } = await supabase.functions.invoke('send-claim-invitations', {
        body: { campaign_id: id, dry_run: dryRun },
      });
      if (error) throw error;
      const r = data as any;
      toast({
        title: dryRun ? 'Preview complete' : 'Batch sent',
        description: dryRun
          ? `${r?.would_send ?? 0} emails would go out (${r?.blocked ?? 0} on the do-not-email list).`
          : `${r?.sent ?? 0} sent, ${r?.failed ?? 0} failed.`,
      });
      if (!dryRun) load();
    } catch (err: any) {
      toast({ title: 'Send failed', description: err?.message, variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const sendTest = async () => {
    setBusy('test');
    try {
      const { data, error } = await supabase.functions.invoke('send-claim-invitations', {
        body: { test_to: testTo.trim() },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: 'Test sent', description: `Check ${testTo.trim()} in a minute or two.` });
    } catch (err: any) {
      toast({ title: 'Test failed', description: err?.message, variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const statusStyle = (s: string) =>
    s === 'active'
      ? 'bg-mansagold/15 text-mansagold border-mansagold/40'
      : s === 'completed'
      ? 'bg-mansablue-light/15 text-mansablue-light border-mansablue-light/40'
      : 'bg-muted/40 text-muted-foreground border-border';

  const inputCls =
    'bg-background/60 border-mansagold/20 focus-visible:ring-mansagold/60 focus-visible:border-mansagold/60 h-11';

  return (
    <>
      <Helmet><title>Claim Campaigns | 1325.AI Admin</title></Helmet>
      <div className="dark min-h-screen bg-background text-foreground">
        {/* Header band */}
        <div className="relative overflow-hidden border-b border-mansagold/20 bg-gradient-to-br from-mansablue-dark via-background to-background">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_85%_0%,hsl(var(--mansagold)/0.35),transparent_45%)]" />
          <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-10 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mansagold">1325.AI · Growth Operations</p>
              <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Claim Campaigns</h1>
              <p className="mt-3 max-w-2xl text-base text-foreground/75">
                Invite unclaimed directory listings to claim their business and start a paid plan.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={load}
              disabled={loading}
              className="border-mansagold/40 text-mansagold hover:bg-mansagold/10 hover:text-mansagold"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-10">
          {/* Test email */}
          <div className="rounded-2xl border border-mansagold/30 bg-card/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mansagold">Send a test email</p>
            <p className="mt-2 text-sm text-foreground/75">
              Sends one sample claim email (for "Sample Business, Chicago") so you can see it in a real inbox. Nothing is recorded and no business is emailed.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
                className={inputCls}
                aria-label="Test email address"
              />
              <Button
                onClick={sendTest}
                disabled={busy === 'test'}
                className="h-11 bg-mansagold text-mansablue-dark hover:bg-mansagold/90 font-semibold"
              >
                {busy === 'test' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                Send test
              </Button>
            </div>
          </div>

          {finder && (
            <div className="rounded-xl border border-mansagold/20 bg-card/60 px-5 py-3 text-sm text-foreground/85">
              <span className="font-semibold text-mansagold">Website email finder:</span>{' '}
              Sites checked: <b>{finder.checked.toLocaleString()}</b> · Emails found: <b>{finder.found.toLocaleString()}</b> · Left to check: <b>{finder.left.toLocaleString()}</b>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: 'Ready to invite', value: stats.unclaimed, icon: Users },
              { label: 'Invited', value: stats.invited, icon: Mail },
              { label: 'Claimed', value: stats.claimed, icon: Send },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-mansagold/20 bg-card/60 p-6 shadow-[0_10px_30px_-15px_hsl(var(--mansagold)/0.35)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">{s.label}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mansagold/15">
                    <s.icon className="w-4 h-4 text-mansagold" />
                  </span>
                </div>
                <div className="mt-4 text-4xl font-bold tabular-nums">{s.value.toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* New campaign */}
          <Card className="rounded-2xl border-mansagold/20 bg-card/60">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-xl flex items-center gap-2">
                <Plus className="w-5 h-5 text-mansagold" /> New campaign
              </CardTitle>
              <p className="text-sm text-foreground/70">Start small — one city at a time keeps emails out of spam folders.</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="cname" className="text-foreground/85">Campaign name</Label>
                  <Input id="cname" className={inputCls} value={form.name} placeholder="Atlanta pilot"
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="climit" className="text-foreground/85">Emails per batch (max 500)</Label>
                  <Input id="climit" className={inputCls} type="number" min={1} max={500} value={form.daily_limit}
                    onChange={(e) => setForm({ ...form, daily_limit: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ccity" className="text-foreground/85">City (optional)</Label>
                  <Input id="ccity" className={inputCls} value={form.target_city} placeholder="Atlanta"
                    onChange={(e) => setForm({ ...form, target_city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cstate" className="text-foreground/85">State (optional)</Label>
                  <Input id="cstate" className={inputCls} value={form.target_state} placeholder="GA"
                    onChange={(e) => setForm({ ...form, target_state: e.target.value })} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="ccat" className="text-foreground/85">Category (optional)</Label>
                  <Input id="ccat" className={inputCls} value={form.target_category} placeholder="Barbershop"
                    onChange={(e) => setForm({ ...form, target_category: e.target.value })} />
                </div>
              </div>
              <Button
                onClick={createCampaign}
                disabled={creating}
                className="h-11 px-6 bg-mansagold text-mansablue-dark font-semibold hover:bg-mansagold-light"
              >
                {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Create campaign
              </Button>
            </CardContent>
          </Card>

          {/* Campaign list */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-mansagold">Your campaigns</h2>
            {loading ? (
              <div className="text-center py-16 text-foreground/70">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-mansagold" />
                Loading campaigns…
              </div>
            ) : campaigns.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-mansagold/30 py-14 text-center text-foreground/70">
                No campaigns yet. Create one above — start small with a single city.
              </div>
            ) : campaigns.map((c) => (
              <div key={c.id} className="rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:border-mansagold/40">
                <div className="flex flex-wrap items-center justify-between gap-5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{c.name}</h3>
                      <Badge variant="outline" className={`capitalize ${statusStyle(c.status)}`}>{c.status}</Badge>
                    </div>
                    <p className="text-sm text-foreground/70 mt-1">
                      {[c.target_city, c.target_state, c.target_category].filter(Boolean).join(' · ') || 'All listings'}
                      {' · '}{c.daily_limit} per batch
                    </p>
                    <div className="mt-3 flex flex-wrap gap-6 text-sm">
                      <span><span className="font-semibold text-mansagold tabular-nums">{c.total_sent.toLocaleString()}</span> <span className="text-foreground/70">sent</span></span>
                      <span><span className="font-semibold text-mansagold tabular-nums">{c.total_claimed.toLocaleString()}</span> <span className="text-foreground/70">claimed</span></span>
                      {c.last_run_at && <span className="text-foreground/60">Last run {new Date(c.last_run_at).toLocaleString()}</span>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <CampaignRecipientsDialog source={{ kind: 'claim', campaignId: c.id }} title={c.name} />
                    <Button
                      variant="outline"
                      disabled={busy === c.id}
                      onClick={() => runBatch(c.id, true)}
                      className="border-mansagold/40 text-foreground hover:bg-mansagold/10"
                    >
                      Preview count
                    </Button>
                    <Button
                      disabled={busy === c.id}
                      onClick={() => runBatch(c.id, false)}
                      className="bg-mansagold text-mansablue-dark font-semibold hover:bg-mansagold-light"
                    >
                      {busy === c.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                      Send batch
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimCampaignsPage;
