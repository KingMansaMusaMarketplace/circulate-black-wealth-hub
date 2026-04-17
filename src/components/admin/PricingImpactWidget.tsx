import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, RefreshCw, DollarSign, Users, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ImpactData {
  activeSubs: number;
  oldMRR: number;
  newMRR: number;
  monthlyUplift: number;
  annualUplift: number;
  upliftPct: number;
  newTierMRR: { count: number; mrr: number };
  unmapped: { count: number; mrr: number };
  byTier: Record<string, { count: number; oldMRR: number; newMRR: number }>;
  generatedAt: string;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const PricingImpactWidget = () => {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res, error: fnErr } = await supabase.functions.invoke('pricing-impact');
      if (fnErr) throw fnErr;
      if (res?.error) throw new Error(res.error);
      setData(res as ImpactData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load pricing impact');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading && !data) {
    return (
      <Card className="p-6 space-y-4 bg-card/50 backdrop-blur border-border">
        <Skeleton className="h-8 w-64" />
        <div className="grid md:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-mansagold" />
            <h2 className="text-xl font-bold text-foreground">Pricing Impact — Old vs. New</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Live MRR comparison from active Stripe subscriptions
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-muted/40 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-1">
                <DollarSign className="h-3 w-3" /> Old MRR
              </div>
              <div className="text-2xl font-bold text-foreground line-through opacity-70">
                {fmt(data.oldMRR)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">at previous prices</div>
            </div>

            <div className="p-4 rounded-lg bg-mansagold/10 border border-mansagold/30">
              <div className="flex items-center gap-2 text-mansagold text-xs uppercase tracking-wide mb-1">
                <DollarSign className="h-3 w-3" /> New MRR
              </div>
              <div className="text-2xl font-bold text-foreground">{fmt(data.newMRR)}</div>
              <div className="text-xs text-muted-foreground mt-1">at current prices</div>
            </div>

            <div className="p-4 rounded-lg bg-mansagold/10 border border-mansagold/30">
              <div className="flex items-center gap-2 text-mansagold text-xs uppercase tracking-wide mb-1">
                <TrendingUp className="h-3 w-3" /> Monthly Uplift
              </div>
              <div className="text-2xl font-bold text-mansagold">
                +{fmt(data.monthlyUplift)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                +{fmt(data.annualUplift)}/yr {data.upliftPct > 0 && `· +${data.upliftPct.toFixed(1)}%`}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-muted/30 border border-border flex items-center gap-3">
              <Users className="h-5 w-5 text-mansagold" />
              <div>
                <div className="text-2xl font-bold text-foreground">{data.activeSubs}</div>
                <div className="text-xs text-muted-foreground">active subscriptions</div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-mansagold" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {data.newTierMRR.count} · {fmt(data.newTierMRR.mrr)}
                </div>
                <div className="text-xs text-muted-foreground">net-new tier MRR (Founding Sponsor)</div>
              </div>
            </div>
          </div>

          {Object.keys(data.byTier).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Breakdown by tier</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground border-b border-border">
                      <th className="py-2 pr-4">Tier</th>
                      <th className="py-2 pr-4 text-right">Subs</th>
                      <th className="py-2 pr-4 text-right">Old MRR</th>
                      <th className="py-2 pr-4 text-right">New MRR</th>
                      <th className="py-2 text-right">Δ / mo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.byTier)
                      .sort(([, a], [, b]) => b.newMRR - a.newMRR)
                      .map(([label, row]) => {
                        const delta = row.newMRR - row.oldMRR;
                        return (
                          <tr key={label} className="border-b border-border/50">
                            <td className="py-2 pr-4 text-foreground">{label}</td>
                            <td className="py-2 pr-4 text-right text-foreground">{row.count}</td>
                            <td className="py-2 pr-4 text-right text-muted-foreground">
                              {fmt(row.oldMRR)}
                            </td>
                            <td className="py-2 pr-4 text-right text-foreground font-medium">
                              {fmt(row.newMRR)}
                            </td>
                            <td className="py-2 text-right">
                              {delta > 0 ? (
                                <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">
                                  +{fmt(delta)}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {data.unmapped.count > 0 && (
            <p className="text-xs text-muted-foreground mt-4">
              {data.unmapped.count} subscription(s) on unmapped prices ({fmt(data.unmapped.mrr)}/mo)
              counted at face value.
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            Updated {new Date(data.generatedAt).toLocaleString()}
          </p>
        </>
      )}
    </Card>
  );
};

export default PricingImpactWidget;
