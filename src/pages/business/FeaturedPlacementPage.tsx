import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Star, Sparkles, Crown, Trophy, Loader2, Settings } from 'lucide-react';
import { IOSPaymentBlocker } from '@/components/platform/IOSPaymentBlocker';

const TIERS = [
  { id: 'bronze',   name: 'Bronze',   price: 20,  icon: Star,     blurb: 'Pin in 1 category for your city.' },
  { id: 'silver',   name: 'Silver',   price: 50,  icon: Sparkles, blurb: 'Pin in 1 category citywide + spotlight rotation.' },
  { id: 'gold',     name: 'Gold',     price: 100, icon: Trophy,   blurb: 'Top of category statewide + spotlight carousel.' },
  { id: 'platinum', name: 'Platinum', price: 200, icon: Crown,    blurb: 'Top placement nationally + homepage spotlight.' },
];

export default function FeaturedPlacementPage() {
  const { user } = useAuth();
  const { profile } = useBusinessProfile();
  const [tier, setTier] = useState<string>('silver');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, { impressions: number; clicks: number }>>({});

  useEffect(() => {
    if (!profile?.id) return;
    (async () => {
      const { data: placements } = await supabase
        .from('featured_placements')
        .select('*')
        .eq('business_id', profile.id)
        .order('created_at', { ascending: false });
      setActive(placements || []);

      if (placements?.length) {
        const ids = placements.map((p: any) => p.id);
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const { data: events } = await supabase
          .from('featured_placement_events')
          .select('placement_id, event_type')
          .in('placement_id', ids)
          .gte('created_at', since);
        const agg: Record<string, { impressions: number; clicks: number }> = {};
        ids.forEach((id) => { agg[id] = { impressions: 0, clicks: 0 }; });
        (events || []).forEach((e: any) => {
          if (e.event_type === 'impression') agg[e.placement_id].impressions++;
          else if (e.event_type === 'click') agg[e.placement_id].clicks++;
        });
        setStats(agg);
      }
    })();
  }, [profile?.id]);

  const checkout = async () => {
    if (!user) { toast.error('Sign in required'); return; }
    if (!profile?.id) { toast.error('Create a business profile first'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-featured-placement-checkout', {
        body: { businessId: profile.id, tier, category, city },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
      else throw new Error(data?.error || 'No checkout URL');
    } catch (e: any) {
      toast.error(e.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const openPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
      else throw new Error('No portal URL');
    } catch (e: any) {
      toast.error(e.message || 'Could not open billing portal');
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <Helmet>
        <title>Featured Placement — Promote Your Business | 1325.AI</title>
        <meta name="description" content="Pin your business at the top of category and city searches. Featured placements from $20/month." />
      </Helmet>

      <h1 className="text-4xl font-bold mb-2">Featured Placement</h1>
      <p className="text-muted-foreground mb-8">
        Pin your business at the top of category & city searches. Cancel anytime.
      </p>

      <IOSPaymentBlocker>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {TIERS.map((t) => {
            const Icon = t.icon;
            const selected = tier === t.id;
            return (
              <Card
                key={t.id}
                className={`cursor-pointer transition ${selected ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'}`}
                onClick={() => setTier(t.id)}
              >
                <CardHeader>
                  <Icon className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="flex items-center justify-between">
                    {t.name}
                    {selected && <Badge>Selected</Badge>}
                  </CardTitle>
                  <CardDescription>${t.price}/mo</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t.blurb}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Targeting</CardTitle>
            <CardDescription>Choose where your business gets promoted.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cat">Category (optional)</Label>
              <Input id="cat" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. food, beauty" />
            </div>
            <div>
              <Label htmlFor="city">City (optional)</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Chicago" />
            </div>
          </CardContent>
        </Card>

        <Button size="lg" onClick={checkout} disabled={loading} className="w-full md:w-auto">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Starting checkout…</> : `Subscribe — $${TIERS.find(x => x.id === tier)?.price}/mo`}
        </Button>

        {active.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your placements</h2>
              <Button variant="outline" size="sm" onClick={openPortal}>
                <Settings className="h-4 w-4 mr-2" />
                Manage subscription
              </Button>
            </div>
            <div className="space-y-2">
              {active.map((p) => {
                const variant =
                  p.status === 'active' ? 'default' :
                  p.status === 'pending' ? 'secondary' : 'outline';
                const s = stats[p.id] || { impressions: 0, clicks: 0 };
                const ctr = s.impressions ? ((s.clicks / s.impressions) * 100).toFixed(1) : '0.0';
                return (
                  <Card key={p.id}>
                    <CardContent className="py-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium capitalize">{p.tier} placement</div>
                          <div className="text-sm text-muted-foreground">
                            {p.category || 'all categories'} · {p.city || 'all cities'}
                            {p.ends_at && p.status === 'active' && (
                              <> · renews {new Date(p.ends_at).toLocaleDateString()}</>
                            )}
                          </div>
                        </div>
                        <Badge variant={variant as any} className="capitalize">{p.status}</Badge>
                      </div>
                      {p.status === 'active' && (
                        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                          <div>
                            <div className="text-xs text-muted-foreground">Impressions (30d)</div>
                            <div className="text-lg font-semibold">{s.impressions.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Clicks (30d)</div>
                            <div className="text-lg font-semibold">{s.clicks.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">CTR</div>
                            <div className="text-lg font-semibold">{ctr}%</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Cancel or change payment method via the Stripe billing portal.
            </p>
          </div>
        )}
      </IOSPaymentBlocker>
    </div>
  );
}
