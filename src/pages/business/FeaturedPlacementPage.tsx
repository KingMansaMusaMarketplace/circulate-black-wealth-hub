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

  useEffect(() => {
    if (!profile?.id) return;
    supabase.from('featured_placements')
      .select('*')
      .eq('business_id', profile.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setActive(data || []));
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
            <h2 className="text-2xl font-bold mb-4">Your placements</h2>
            <div className="space-y-2">
              {active.map((p) => (
                <Card key={p.id}>
                  <CardContent className="py-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium capitalize">{p.tier} placement</div>
                      <div className="text-sm text-muted-foreground">
                        {p.category || 'all categories'} · {p.city || 'all cities'}
                      </div>
                    </div>
                    <Badge variant={p.status === 'active' ? 'default' : 'secondary'}>{p.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </IOSPaymentBlocker>
    </div>
  );
}
