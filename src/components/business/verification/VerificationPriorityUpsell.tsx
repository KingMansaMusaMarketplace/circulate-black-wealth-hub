import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { shouldHideStripePayments } from '@/utils/platform-utils';

interface VerificationPriorityUpsellProps {
  businessId: string;
}

interface VerificationRow {
  id: string;
  verification_status: string;
  priority_tier: string | null;
  priority_sla_deadline: string | null;
}

const TIERS = [
  { id: 'priority', name: 'Priority', price: 49, sla: '4-hour SLA', icon: Clock,
    bullets: ['Reviewed within 4 business hours', 'Email + SMS notification', 'Skip the standard queue'] },
  { id: 'same_day', name: 'Same-Day', price: 99, sla: '1-hour SLA', icon: Zap, popular: true,
    bullets: ['Reviewed within 1 business hour (M–F 9–6 CT)', 'Priority human reviewer', 'Highest queue placement'] },
];

export const VerificationPriorityUpsell: React.FC<VerificationPriorityUpsellProps> = ({ businessId }) => {
  const [verification, setVerification] = useState<VerificationRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutTier, setCheckoutTier] = useState<string | null>(null);
  const hidePayments = shouldHideStripePayments();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('business_verifications')
        .select('id, verification_status, priority_tier, priority_sla_deadline')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled) {
        setVerification(data as any);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [businessId]);

  // After checkout return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('priority') === 'success') {
      toast.success('Fast-track activated! Our team is on it.');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (params.get('priority') === 'cancelled') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  if (hidePayments || loading || !verification) return null;
  if (verification.verification_status !== 'pending') return null;

  // Already paid — show status, not upsell
  if (verification.priority_tier && verification.priority_tier !== 'standard') {
    const deadline = verification.priority_sla_deadline ? new Date(verification.priority_sla_deadline) : null;
    return (
      <Card className="p-5 border-mansagold bg-mansagold/5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-mansagold mt-0.5" />
          <div>
            <h3 className="font-semibold">
              {verification.priority_tier === 'same_day' ? 'Same-Day' : 'Priority'} Verification active
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {deadline
                ? `SLA deadline: ${deadline.toLocaleString()}`
                : 'Our team has been notified.'}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const buy = async (tier: string) => {
    setCheckoutTier(tier);
    try {
      const { data, error } = await supabase.functions.invoke('create-verification-priority-checkout', {
        body: { businessId, tier },
      });
      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL');
      window.open(data.url, '_blank');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setCheckoutTier(null);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-mansagold" />
          Skip the line — get verified faster
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Standard review takes 24–48 hours. Need it sooner? Pick a fast-track tier.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {TIERS.map((t) => (
          <Card key={t.id} className={cn('p-5 relative', t.popular && 'border-mansagold ring-1 ring-mansagold')}>
            {t.popular && (
              <Badge className="absolute -top-2 right-3 bg-mansagold text-black hover:bg-mansagold">FASTEST</Badge>
            )}
            <div className="flex items-center gap-2 mb-2">
              <t.icon className="h-4 w-4 text-mansagold" />
              <span className="font-semibold">{t.name}</span>
              <Badge variant="secondary" className="ml-auto">{t.sla}</Badge>
            </div>
            <div className="text-3xl font-bold mb-3">${t.price}<span className="text-sm font-normal text-muted-foreground"> one-time</span></div>
            <ul className="space-y-1.5 text-sm text-muted-foreground mb-4">
              {t.bullets.map((b) => (
                <li key={b} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-mansagold shrink-0 mt-0.5" /><span>{b}</span></li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={t.popular ? 'default' : 'outline'}
              onClick={() => buy(t.id)}
              disabled={checkoutTier !== null}
            >
              {checkoutTier === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : `Get ${t.name}`}
            </Button>
          </Card>
        ))}
      </div>
    </Card>
  );
};
