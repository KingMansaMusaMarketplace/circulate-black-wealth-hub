import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import {
  DollarSign,
  Activity,
  TrendingUp,
  Briefcase,
  Zap,
  Sparkles,
  QrCode,
  Star,
  Crown,
  Users,
  Code2,
  PhoneCall,
  Home,
  Car,
  Building2,
  Calendar,
  HandCoins,
} from 'lucide-react';

// Featured Placement monthly pricing (USD) — must match create-featured-placement-checkout edge fn
const FEATURED_MRR: Record<string, number> = {
  bronze: 20,
  silver: 50,
  gold: 100,
  platinum: 200,
};

// Marketing topup packs — derive USD from credit delta (matches create-marketing-topup-checkout)
const TOPUP_USD_BY_CREDITS: Record<number, number> = { 25: 9, 100: 25, 500: 79 };

// Business subscription tiers (matches /pricing). Lowercase-normalized lookup.
const SUBSCRIPTION_MRR: Record<string, number> = {
  essentials: 19,
  starter: 79,
  pro: 299,
  enterprise: 899,
  founding_pro: 149, // Founders' Lock — first 100 businesses
  founding: 149,
};

// API developer tier MRR (matches create-api-subscription-checkout)
const API_TIER_MRR: Record<string, number> = {
  free: 0,
  pro: 299,
  enterprise: 999,
};

// Corporate Sponsor tier MRR (estimates — Stripe price IDs are env-driven)
const SPONSOR_MRR: Record<string, number> = {
  bronze: 500,
  silver: 1500,
  gold: 5000,
  platinum: 10000,
  founding: 2500,
};

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

interface StreamCardProps {
  icon: React.ReactNode;
  label: string;
  total: number;
  sub: string;
  accent?: string;
}
const StreamCard: React.FC<StreamCardProps> = ({ icon, label, total, sub, accent }) => (
  <Card className="bg-card/40 backdrop-blur border-white/10">
    <CardHeader className="pb-3">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-2 ${accent ?? 'bg-primary/15 text-primary'}`}>
        {icon}
      </div>
      <CardTitle className="text-base font-medium">{label}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold tracking-tight">{fmt(total)}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </CardContent>
  </Card>
);

interface RevenueState {
  qr: { total: number; count: number; last30: number };
  featured: { mrr: number; activeCount: number; byTier: Record<string, number> };
  verification: { total: number; count: number; last30: number };
  jobs: { total: number; count: number; last30: number };
  marketing: { total: number; count: number; last30: number };
  apiCalls: number;
  subscriptions: { mrr: number; activeCount: number; byTier: Record<string, number> };
  apiTiers: { mrr: number; activeCount: number };
  answering: { activeCount: number; callsLast30: number };
  stays: { total: number; count: number; last30: number };
  noire: { total: number; count: number; last30: number };
  sponsors: { mrr: number; activeCount: number; byTier: Record<string, number> };
  bhm: { total: number; count: number; last30: number };
  agentCommissions: { total: number; count: number; last30: number };
  apple: { mrr: number; activeCount: number };
  corpSubs: { mrr: number; activeCount: number; byTier: Record<string, number> };
  serviceBookings: { total: number; count: number; last30: number };
}

const EMPTY: RevenueState = {
  qr: { total: 0, count: 0, last30: 0 },
  featured: { mrr: 0, activeCount: 0, byTier: {} },
  verification: { total: 0, count: 0, last30: 0 },
  jobs: { total: 0, count: 0, last30: 0 },
  marketing: { total: 0, count: 0, last30: 0 },
  apiCalls: 0,
  subscriptions: { mrr: 0, activeCount: 0, byTier: {} },
  apiTiers: { mrr: 0, activeCount: 0 },
  answering: { activeCount: 0, callsLast30: 0 },
  stays: { total: 0, count: 0, last30: 0 },
  noire: { total: 0, count: 0, last30: 0 },
  sponsors: { mrr: 0, activeCount: 0, byTier: {} },
  bhm: { total: 0, count: 0, last30: 0 },
  agentCommissions: { total: 0, count: 0, last30: 0 },
};

export default function PlatformRevenuePage() {
  const [s, setS] = useState<RevenueState>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const thirtyAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const monthStart = new Date(); monthStart.setUTCDate(1); monthStart.setUTCHours(0, 0, 0, 0);

      const next: RevenueState = JSON.parse(JSON.stringify(EMPTY));

      // QR transaction fees
      const { data: qrRows } = await supabase
        .from('platform_transactions')
        .select('amount_platform_fee, created_at')
        .eq('status', 'succeeded');
      (qrRows ?? []).forEach((r: any) => {
        const fee = Number(r.amount_platform_fee || 0);
        next.qr.total += fee;
        next.qr.count += 1;
        if (r.created_at >= thirtyAgo) next.qr.last30 += fee;
      });

      // Featured placements (active = recurring MRR)
      const { data: fpRows } = await supabase
        .from('featured_placements')
        .select('tier, status')
        .eq('status', 'active');
      (fpRows ?? []).forEach((r: any) => {
        const price = FEATURED_MRR[r.tier] ?? 0;
        next.featured.mrr += price;
        next.featured.activeCount += 1;
        next.featured.byTier[r.tier] = (next.featured.byTier[r.tier] ?? 0) + 1;
      });

      // Verification priority fast-track
      const { data: vpRows } = await supabase
        .from('verification_priority_payments')
        .select('amount_cents, paid_at, created_at');
      (vpRows ?? []).forEach((r: any) => {
        const amt = Number(r.amount_cents || 0) / 100;
        next.verification.total += amt;
        next.verification.count += 1;
        const ts = r.paid_at || r.created_at;
        if (ts && ts >= thirtyAgo) next.verification.last30 += amt;
      });

      // Job postings (one-time fees)
      const { data: jobRows } = await supabase
        .from('job_postings')
        .select('amount_cents, paid_at, status')
        .not('paid_at', 'is', null);
      (jobRows ?? []).forEach((r: any) => {
        const amt = Number(r.amount_cents || 0) / 100;
        next.jobs.total += amt;
        next.jobs.count += 1;
        if (r.paid_at && r.paid_at >= thirtyAgo) next.jobs.last30 += amt;
      });

      // Marketing topups — derive USD from delta size
      const { data: mtRows } = await supabase
        .from('marketing_credit_ledger')
        .select('delta, created_at, bucket, stripe_session_id')
        .eq('bucket', 'topup')
        .gt('delta', 0);
      (mtRows ?? []).forEach((r: any) => {
        const usd = TOPUP_USD_BY_CREDITS[Number(r.delta)] ?? 0;
        next.marketing.total += usd;
        next.marketing.count += 1;
        if (r.created_at >= thirtyAgo) next.marketing.last30 += usd;
      });

      // API usage
      const { count: ac } = await supabase
        .from('api_usage_logs')
        .select('*', { count: 'exact', head: true })
        .gte('request_timestamp', monthStart.toISOString());
      next.apiCalls = ac ?? 0;

      // Business subscriptions (Essentials / Starter / Pro / Enterprise)
      const { data: subRows } = await supabase
        .from('subscribers')
        .select('subscription_tier, subscribed, status')
        .eq('subscribed', true);
      (subRows ?? []).forEach((r: any) => {
        const key = String(r.subscription_tier ?? '').toLowerCase().trim();
        const price = SUBSCRIPTION_MRR[key] ?? 0;
        if (price > 0) {
          next.subscriptions.mrr += price;
          next.subscriptions.activeCount += 1;
          next.subscriptions.byTier[key] = (next.subscriptions.byTier[key] ?? 0) + 1;
        }
      });

      // Institutional Data API tiers
      const { data: devRows } = await supabase
        .from('developer_accounts')
        .select('tier, tier_price_cents, stripe_subscription_status')
        .eq('stripe_subscription_status', 'active');
      (devRows ?? []).forEach((r: any) => {
        const fromCents = Number(r.tier_price_cents || 0) / 100;
        const fromMap = API_TIER_MRR[String(r.tier ?? '').toLowerCase()] ?? 0;
        const price = fromCents > 0 ? fromCents : fromMap;
        if (price > 0) {
          next.apiTiers.mrr += price;
          next.apiTiers.activeCount += 1;
        }
      });

      // Kayla Answering Service (active deployments + 30d call volume)
      const { count: ansActive } = await supabase
        .from('business_answering_config')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      next.answering.activeCount = ansActive ?? 0;
      const { count: ansCalls } = await supabase
        .from('answering_call_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyAgo);
      next.answering.callsLast30 = ansCalls ?? 0;

      // Mansa Stays — platform_fee on vacation_bookings
      const { data: stayRows } = await supabase
        .from('vacation_bookings')
        .select('platform_fee, created_at, status')
        .neq('status', 'cancelled');
      (stayRows ?? []).forEach((r: any) => {
        const fee = Number(r.platform_fee || 0);
        next.stays.total += fee;
        next.stays.count += 1;
        if (r.created_at && r.created_at >= thirtyAgo) next.stays.last30 += fee;
      });

      // Noire Rideshare — platform_fee on completed rides
      const { data: rideRows } = await supabase
        .from('noir_rides')
        .select('platform_fee, created_at, status');
      (rideRows ?? []).forEach((r: any) => {
        const fee = Number(r.platform_fee || 0);
        next.noire.total += fee;
        next.noire.count += 1;
        if (r.created_at && r.created_at >= thirtyAgo) next.noire.last30 += fee;
      });

      // Corporate Sponsors — active sponsors by tier
      const { data: sponsorRows } = await supabase
        .from('sponsors')
        .select('sponsorship_tier, subscription_status')
        .eq('subscription_status', 'active');
      (sponsorRows ?? []).forEach((r: any) => {
        const key = String(r.sponsorship_tier ?? '').toLowerCase().trim();
        const price = SPONSOR_MRR[key] ?? 0;
        if (price > 0) {
          next.sponsors.mrr += price;
          next.sponsors.activeCount += 1;
          next.sponsors.byTier[key] = (next.sponsors.byTier[key] ?? 0) + 1;
        }
      });

      // BHM Quick Add Listings — paid one-time fees
      const { data: bhmRows } = await supabase
        .from('b2b_external_leads')
        .select('payment_amount, paid_at')
        .eq('source_query', 'bhm_quick_add')
        .eq('validation_status', 'paid');
      (bhmRows ?? []).forEach((r: any) => {
        const amt = Number(r.payment_amount || 0);
        next.bhm.total += amt;
        next.bhm.count += 1;
        if (r.paid_at && r.paid_at >= thirtyAgo) next.bhm.last30 += amt;
      });

      // Sales Agent Commissions (paid out — revenue COST/deduction)
      const { data: commRows } = await supabase
        .from('commission_payments')
        .select('amount, paid_at, status')
        .eq('status', 'paid');
      (commRows ?? []).forEach((r: any) => {
        const amt = Number(r.amount || 0);
        next.agentCommissions.total += amt;
        next.agentCommissions.count += 1;
        if (r.paid_at && r.paid_at >= thirtyAgo) next.agentCommissions.last30 += amt;
      });

      setS(next);
      setLoading(false);
    })();
  }, []);

  const lifetimeTotal = useMemo(
    () =>
      s.qr.total +
      s.verification.total +
      s.jobs.total +
      s.marketing.total +
      s.stays.total +
      s.noire.total +
      s.bhm.total,
    [s],
  );
  const last30Total = useMemo(
    () =>
      s.qr.last30 +
      s.verification.last30 +
      s.jobs.last30 +
      s.marketing.last30 +
      s.stays.last30 +
      s.noire.last30 +
      s.bhm.last30,
    [s],
  );
  const totalMrr =
    s.featured.mrr + s.subscriptions.mrr + s.apiTiers.mrr + s.sponsors.mrr;
  const annualizedFromMrr = totalMrr * 12;
  const netLast30 = last30Total + totalMrr - s.agentCommissions.last30;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712]">
      <Helmet><title>Platform Revenue | Admin</title></Helmet>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-mansablue/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-32 h-[420px] w-[420px] rounded-full bg-mansagold/10 blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="relative container max-w-7xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Platform Revenue</h1>
          <p className="text-muted-foreground mt-2">
            Real-time view of every revenue stream across 1325.AI.
          </p>
        </div>

        {/* Hero totals */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Card className="bg-gradient-to-br from-mansagold/20 to-mansagold/5 border-mansagold/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-mansagold/90 uppercase tracking-wider text-xs">
                Lifetime transactional
              </CardDescription>
              <CardTitle className="text-3xl">{loading ? '—' : fmt(lifetimeTotal)}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              QR + verification + jobs + marketing + stays + rideshare
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-mansablue/30 to-mansablue/5 border-mansablue/40">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-200/80 uppercase tracking-wider text-xs">
                Total MRR
              </CardDescription>
              <CardTitle className="text-3xl">{loading ? '—' : fmt(totalMrr)}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Subs + Featured + API · {fmt(annualizedFromMrr)} ARR
            </CardContent>
          </Card>

          <Card className="bg-card/40 backdrop-blur border-white/10">
            <CardHeader className="pb-2">
              <CardDescription className="uppercase tracking-wider text-xs">
                Last 30 days
              </CardDescription>
              <CardTitle className="text-3xl">{loading ? '—' : fmt(last30Total + totalMrr)}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Includes 1× current MRR run-rate
            </CardContent>
          </Card>
        </div>

        {/* Per-stream breakdown */}
        <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wider text-xs">
          By revenue stream
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <StreamCard
            icon={<Users className="h-5 w-5" />}
            label="Business Subscriptions"
            total={s.subscriptions.mrr}
            sub={`${s.subscriptions.activeCount} active · MRR shown · ${fmt(s.subscriptions.mrr * 12)} ARR`}
            accent="bg-mansablue/20 text-blue-300"
          />
          <StreamCard
            icon={<Crown className="h-5 w-5" />}
            label="Featured Placements"
            total={s.featured.mrr}
            sub={`${s.featured.activeCount} active · MRR · ${fmt(s.featured.mrr * 12)} ARR`}
            accent="bg-mansagold/20 text-mansagold"
          />
          <StreamCard
            icon={<Code2 className="h-5 w-5" />}
            label="Institutional Data API"
            total={s.apiTiers.mrr}
            sub={`${s.apiTiers.activeCount} paid devs · ${s.apiCalls.toLocaleString()} calls this month`}
            accent="bg-cyan-500/15 text-cyan-300"
          />
          <StreamCard
            icon={<QrCode className="h-5 w-5" />}
            label="QR Transaction Fees (1.5%)"
            total={s.qr.total}
            sub={`${s.qr.count} txns · ${fmt(s.qr.last30)} last 30d`}
          />
          <StreamCard
            icon={<Zap className="h-5 w-5" />}
            label="Verification Fast-Track"
            total={s.verification.total}
            sub={`${s.verification.count} purchases · ${fmt(s.verification.last30)} last 30d`}
            accent="bg-amber-500/15 text-amber-400"
          />
          <StreamCard
            icon={<Briefcase className="h-5 w-5" />}
            label="Job Board Postings"
            total={s.jobs.total}
            sub={`${s.jobs.count} paid posts · ${fmt(s.jobs.last30)} last 30d`}
            accent="bg-emerald-500/15 text-emerald-400"
          />
          <StreamCard
            icon={<Sparkles className="h-5 w-5" />}
            label="Marketing Studio Top-ups"
            total={s.marketing.total}
            sub={`${s.marketing.count} packs · ${fmt(s.marketing.last30)} last 30d`}
            accent="bg-purple-500/15 text-purple-400"
          />
          <StreamCard
            icon={<Home className="h-5 w-5" />}
            label="Mansa Stays (commission)"
            total={s.stays.total}
            sub={`${s.stays.count} bookings · ${fmt(s.stays.last30)} last 30d`}
            accent="bg-rose-500/15 text-rose-300"
          />
          <StreamCard
            icon={<Car className="h-5 w-5" />}
            label="Noire Rideshare (platform fee)"
            total={s.noire.total}
            sub={`${s.noire.count} rides · ${fmt(s.noire.last30)} last 30d`}
            accent="bg-indigo-500/15 text-indigo-300"
          />
          <StreamCard
            icon={<PhoneCall className="h-5 w-5" />}
            label="Kayla Answering Service"
            total={0}
            sub={`${s.answering.activeCount} active · ${s.answering.callsLast30.toLocaleString()} calls 30d · bundled in plans`}
            accent="bg-teal-500/15 text-teal-300"
          />
          <StreamCard
            icon={<Building2 className="h-5 w-5" />}
            label="Corporate Sponsors"
            total={s.sponsors.mrr}
            sub={`${s.sponsors.activeCount} active · MRR estimate · ${fmt(s.sponsors.mrr * 12)} ARR`}
            accent="bg-mansagold/20 text-mansagold"
          />
          <StreamCard
            icon={<Calendar className="h-5 w-5" />}
            label="BHM Quick-Add Listings"
            total={s.bhm.total}
            sub={`${s.bhm.count} paid listings · ${fmt(s.bhm.last30)} last 30d`}
            accent="bg-orange-500/15 text-orange-300"
          />
          <StreamCard
            icon={<HandCoins className="h-5 w-5" />}
            label="Sales Agent Commissions (cost)"
            total={-s.agentCommissions.total}
            sub={`${s.agentCommissions.count} payouts · -${fmt(s.agentCommissions.last30)} last 30d`}
            accent="bg-red-500/15 text-red-300"
          />
          <StreamCard
            icon={<Activity className="h-5 w-5" />}
            label="API Calls (this month)"
            total={0}
            sub={`${s.apiCalls.toLocaleString()} requests · metered against tier`}
            accent="bg-slate-500/15 text-slate-300"
          />
        </div>

        {/* Subscription breakdown */}
        {s.subscriptions.activeCount > 0 && (
          <Card className="bg-card/40 backdrop-blur border-white/10 mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-300" />
                <CardTitle className="text-base">Business Subscriptions by Tier</CardTitle>
              </div>
              <CardDescription>Live business plans contributing to MRR</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {(['essentials', 'starter', 'pro', 'enterprise'] as const).map((t) => {
                  const count = s.subscriptions.byTier[t] ?? 0;
                  const sub = count * (SUBSCRIPTION_MRR[t] ?? 0);
                  if (count === 0) return null;
                  return (
                    <Badge key={t} variant="outline" className="px-3 py-1.5 capitalize gap-2 text-sm">
                      {t} × {count}
                      <span className="text-muted-foreground">· {fmt(sub)}/mo</span>
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Featured Placement breakdown */}
        {s.featured.activeCount > 0 && (
          <Card className="bg-card/40 backdrop-blur border-white/10 mb-10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-mansagold" />
                <CardTitle className="text-base">Featured Placements by Tier</CardTitle>
              </div>
              <CardDescription>Live subscriptions contributing to MRR</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {(['bronze', 'silver', 'gold', 'platinum'] as const).map((t) => {
                  const count = s.featured.byTier[t] ?? 0;
                  const sub = count * (FEATURED_MRR[t] ?? 0);
                  if (count === 0) return null;
                  return (
                    <Badge key={t} variant="outline" className="px-3 py-1.5 capitalize gap-2 text-sm">
                      {t} × {count}
                      <span className="text-muted-foreground">· {fmt(sub)}/mo</span>
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Note */}
        <Card className="bg-card/30 backdrop-blur border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Revenue stack</CardTitle>
            </div>
            <CardDescription>13 monetized streams (10 revenue + Sponsors + BHM + Founders' Lock). Sales agent commissions netted out. iOS surfaces hidden per App Store policy.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1.5">
            <div className="flex items-center gap-2"><DollarSign className="h-3.5 w-3.5 text-mansagold" /> Lifetime transactional: <span className="text-foreground font-semibold">{fmt(lifetimeTotal)}</span></div>
            <div className="flex items-center gap-2"><DollarSign className="h-3.5 w-3.5 text-mansagold" /> MRR: <span className="text-foreground font-semibold">{fmt(totalMrr)}</span> · ARR: <span className="text-foreground font-semibold">{fmt(annualizedFromMrr)}</span></div>
            <div className="flex items-center gap-2"><DollarSign className="h-3.5 w-3.5 text-mansagold" /> Last 30d gross (incl. MRR): <span className="text-foreground font-semibold">{fmt(last30Total + totalMrr)}</span></div>
            <div className="flex items-center gap-2"><DollarSign className="h-3.5 w-3.5 text-red-400" /> – Agent commissions paid (30d): <span className="text-foreground font-semibold">-{fmt(s.agentCommissions.last30)}</span></div>
            <div className="flex items-center gap-2 pt-1 border-t border-white/5"><DollarSign className="h-4 w-4 text-emerald-400" /> <span className="text-foreground">Net last 30d:</span> <span className="text-emerald-300 font-bold">{fmt(netLast30)}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
