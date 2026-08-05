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
      supabase.from('businesses').select('id', { count: 'exact', head: true })
        .eq('listing_status', 'live').eq('claim_status', 'unclaimed').is('claim_invited_at', null).not('email', 'is', null),
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

  useEffect(() => { load(); }, []);

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

  return (
    <>
      <Helmet><title>Claim Campaigns | 1325.AI Admin</title></Helmet>
      <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold">Claim Campaigns</h1>
              <p className="text-muted-foreground mt-1">
                Invite unclaimed directory listings to claim their business and start a paid plan.
              </p>
            </div>
            <Button variant="outline" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Ready to invite', value: stats.unclaimed, icon: Users },
              { label: 'Invited', value: stats.invited, icon: Mail },
              { label: 'Claimed', value: stats.claimed, icon: Send },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <s.icon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-2xl font-bold">{s.value.toLocaleString()}</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle className="text-lg">New campaign</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cname">Campaign name</Label>
                  <Input id="cname" value={form.name} placeholder="Atlanta pilot"
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="climit">Emails per batch (max 500)</Label>
                  <Input id="climit" type="number" min={1} max={500} value={form.daily_limit}
                    onChange={(e) => setForm({ ...form, daily_limit: Number(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="ccity">City (optional)</Label>
                  <Input id="ccity" value={form.target_city} placeholder="Atlanta"
                    onChange={(e) => setForm({ ...form, target_city: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="cstate">State (optional)</Label>
                  <Input id="cstate" value={form.target_state} placeholder="GA"
                    onChange={(e) => setForm({ ...form, target_state: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="ccat">Category (optional)</Label>
                  <Input id="ccat" value={form.target_category} placeholder="Barbershop"
                    onChange={(e) => setForm({ ...form, target_category: e.target.value })} />
                </div>
              </div>
              <Button onClick={createCampaign} disabled={creating}>
                {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Create campaign
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-16 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
                Loading campaigns…
              </div>
            ) : campaigns.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">
                No campaigns yet. Create one above — start small with a single city.
              </CardContent></Card>
            ) : campaigns.map((c) => (
              <Card key={c.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{c.name}</h3>
                        <Badge variant="secondary">{c.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {[c.target_city, c.target_state, c.target_category].filter(Boolean).join(' · ') || 'All listings'}
                        {' · '}{c.daily_limit} per batch
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sent {c.total_sent} · Claimed {c.total_claimed}
                        {c.last_run_at ? ` · Last run ${new Date(c.last_run_at).toLocaleString()}` : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" disabled={busy === c.id} onClick={() => runBatch(c.id, true)}>
                        Preview count
                      </Button>
                      <Button disabled={busy === c.id} onClick={() => runBatch(c.id, false)}>
                        {busy === c.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                        Send batch
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimCampaignsPage;
