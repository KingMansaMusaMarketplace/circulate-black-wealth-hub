import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TIERS = [
  { id: 'free',       name: 'Free',       price: 0,   calls: 1000,   blurb: 'For prototypes & evaluation.', features: ['1,000 calls/mo', '60 req/min', 'Community support'] },
  { id: 'pro',        name: 'Pro',        price: 299, calls: 10000,  blurb: 'For production integrations.', features: ['10,000 calls/mo', '300 req/min', 'Email support', 'All scopes'], popular: true },
  { id: 'enterprise', name: 'Enterprise', price: 999, calls: 100000, blurb: 'For data partners & banks.',   features: ['100,000 calls/mo', '1,000 req/min', 'SLA + priority', 'Dedicated channel'] },
];

interface Props {
  currentTier: 'free' | 'pro' | 'enterprise';
}

const ApiSubscriptionPlans: React.FC<Props> = ({ currentTier }) => {
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success') {
      toast.success('API subscription activated! Quotas updated.');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (params.get('status') === 'cancelled') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const subscribe = async (tier: string) => {
    setLoading(tier);
    try {
      const { data, error } = await supabase.functions.invoke(
        'create-api-subscription-checkout',
        { body: { tier } },
      );
      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL');
      window.open(data.url, '_blank');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="bg-slate-900/40 border-white/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-mansagold" />
          <CardTitle className="text-white">API Plans</CardTitle>
        </div>
        <CardDescription className="text-white/60">
          Increase your monthly request quota. All paid tiers unlock every API scope.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {TIERS.map((t) => {
            const isCurrent = t.id === currentTier;
            const isPaid = t.id !== 'free';
            return (
              <div
                key={t.id}
                className={cn(
                  'relative rounded-xl border p-5 flex flex-col bg-slate-950/40',
                  isCurrent
                    ? 'border-mansagold ring-1 ring-mansagold/40'
                    : t.popular
                    ? 'border-mansablue/60'
                    : 'border-white/10',
                )}
              >
                {t.popular && !isCurrent && (
                  <Badge className="absolute -top-2 right-4 bg-mansablue text-white border-0">
                    Most popular
                  </Badge>
                )}
                {isCurrent && (
                  <Badge className="absolute -top-2 right-4 bg-mansagold text-black border-0">
                    Current
                  </Badge>
                )}

                <div className="text-white font-semibold text-lg">{t.name}</div>
                <div className="mt-1 text-white">
                  <span className="text-3xl font-bold">${t.price}</span>
                  {isPaid && <span className="text-white/60 text-sm">/mo</span>}
                </div>
                <p className="text-xs text-white/60 mt-1">{t.blurb}</p>

                <ul className="space-y-1.5 mt-4 mb-5 text-sm text-white/80">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button disabled variant="outline" className="mt-auto border-white/10 text-white/60">
                    Active
                  </Button>
                ) : isPaid ? (
                  <Button
                    onClick={() => subscribe(t.id)}
                    disabled={loading !== null}
                    className="mt-auto bg-mansagold hover:bg-mansagold/90 text-black font-medium"
                  >
                    {loading === t.id ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Starting…</>
                    ) : (
                      `Upgrade to ${t.name}`
                    )}
                  </Button>
                ) : (
                  <Button disabled variant="outline" className="mt-auto border-white/10 text-white/40">
                    Default tier
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiSubscriptionPlans;
