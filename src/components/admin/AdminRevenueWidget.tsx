import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, ArrowRight, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const FEATURED_MRR: Record<string, number> = {
  bronze: 20, silver: 50, gold: 100, platinum: 200,
};
const SUBSCRIPTION_MRR: Record<string, number> = {
  essentials: 19, starter: 79, pro: 299, enterprise: 899,
};
const API_TIER_MRR: Record<string, number> = { free: 0, pro: 299, enterprise: 999 };
const TOPUP_USD_BY_CREDITS: Record<number, number> = { 25: 9, 100: 25, 500: 79 };

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/**
 * Compact revenue snapshot for the Admin Hub. Mirrors the totals on
 * /admin/platform-revenue but stripped to lifetime + MRR + 30-day.
 */
const AdminRevenueWidget: React.FC = () => {
  const [lifetime, setLifetime] = useState(0);
  const [mrr, setMrr] = useState(0);
  const [last30, setLast30] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const thirtyAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      let life = 0;
      let l30 = 0;

      const [{ data: qr }, { data: fp }, { data: vp }, { data: jobs }, { data: mt }] =
        await Promise.all([
          supabase.from('platform_transactions').select('amount_platform_fee, created_at').eq('status', 'succeeded'),
          supabase.from('featured_placements').select('tier').eq('status', 'active'),
          supabase.from('verification_priority_payments').select('amount_cents, paid_at, created_at'),
          supabase.from('job_postings').select('amount_cents, paid_at').not('paid_at', 'is', null),
          supabase.from('marketing_credit_ledger').select('delta, created_at').eq('bucket', 'topup').gt('delta', 0),
        ]);

      (qr ?? []).forEach((r: any) => {
        const v = Number(r.amount_platform_fee || 0);
        life += v;
        if (r.created_at >= thirtyAgo) l30 += v;
      });
      (vp ?? []).forEach((r: any) => {
        const v = Number(r.amount_cents || 0) / 100;
        life += v;
        const ts = r.paid_at || r.created_at;
        if (ts && ts >= thirtyAgo) l30 += v;
      });
      (jobs ?? []).forEach((r: any) => {
        const v = Number(r.amount_cents || 0) / 100;
        life += v;
        if (r.paid_at && r.paid_at >= thirtyAgo) l30 += v;
      });
      (mt ?? []).forEach((r: any) => {
        const v = TOPUP_USD_BY_CREDITS[Number(r.delta)] ?? 0;
        life += v;
        if (r.created_at >= thirtyAgo) l30 += v;
      });

      const monthly = (fp ?? []).reduce(
        (s: number, r: any) => s + (FEATURED_MRR[r.tier] ?? 0),
        0,
      );

      setLifetime(life);
      setMrr(monthly);
      setLast30(l30 + monthly);
      setLoading(false);
    })();
  }, []);

  return (
    <Link to="/admin/platform-revenue" className="block group">
      <Card className="bg-gradient-to-br from-mansagold/15 via-mansagold/5 to-mansablue/10 border-mansagold/30 hover:border-mansagold/60 transition-all overflow-hidden relative">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-mansagold/15 blur-3xl pointer-events-none" />
        <CardContent className="p-5 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-mansagold/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-mansagold" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Platform Revenue</div>
                <div className="text-xs text-white/60">Live across 5 streams</div>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-mansagold opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Lifetime</div>
              <div className="text-lg font-bold text-white">{loading ? '—' : fmt(lifetime)}</div>
            </div>
            <div>
              <div className="text-xs text-white/60 uppercase tracking-wider mb-1">MRR</div>
              <div className="text-lg font-bold text-mansagold">{loading ? '—' : fmt(mrr)}</div>
            </div>
            <div>
              <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Last 30d</div>
              <div className="text-lg font-bold text-white flex items-center gap-1">
                {loading ? '—' : fmt(last30)}
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default AdminRevenueWidget;
