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
  ArrowDownRight,
  ArrowUpRight,
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
  founding_pro: 149,
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
  founding: 1750,
  bronze: 5000,
  silver: 15000,
  gold: 25000,
  platinum: 50000,
};

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const fmtCompact = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return fmt(n);
};

// ---------- KPI hero tile ----------
interface KpiProps {
  label: string;
  value: string;
  hint?: string;
  tone?: 'gold' | 'blue' | 'neutral' | 'positive';
}
const Kpi: React.FC<KpiProps> = ({ label, value, hint, tone = 'neutral' }) => {
  const toneMap = {
    gold: 'text-mansagold',
    blue: 'text-blue-200',
    neutral: 'text-white',
    positive: 'text-emerald-300',
  };
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
      <div className="text-xs font-medium uppercase tracking-widest text-white/70">{label}</div>
      <div className={`mt-4 text-4xl font-bold tabular-nums tracking-tight ${toneMap[tone]}`}>
        {value}
      </div>
      {hint && <div className="mt-2 text-sm text-white/70">{hint}</div>}
    </div>
  );
};

// ---------- Stream row (unified, no rainbow accents) ----------
interface StreamProps {
  icon: React.ReactNode;
  label: string;
  primary: string;
  secondary?: string;
  meta?: string;
  negative?: boolean;
}
const StreamTile: React.FC<StreamProps> = ({ icon, label, primary, secondary, meta, negative }) => (
  <div className="group relative rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-xl transition-all hover:border-mansagold/40 hover:bg-white/15">
    <div className="flex items-start justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-mansagold/30 bg-mansagold/15 text-mansagold">
        {icon}
      </div>
      {negative ? (
        <ArrowDownRight className="h-5 w-5 text-red-400" />
      ) : (
        <ArrowUpRight className="h-5 w-5 text-emerald-400" />
      )}
    </div>
    <div className="mt-4 text-sm font-semibold text-white">{label}</div>
    <div
      className={`mt-2 text-2xl font-bold tabular-nums tracking-tight ${
        negative ? 'text-red-300' : 'text-white'
      }`}
    >
      {primary}
    </div>
    {secondary && (
      <div className="mt-1 text-sm text-white/75 tabular-nums">{secondary}</div>
    )}
    {meta && <div className="mt-2 text-xs text-white/60">{meta}</div>}
  </div>
);

const SectionHeader: React.FC<{ eyebrow: string; title: string; hint?: string }> = ({
  eyebrow,
  title,
  hint,
}) => (
  <div className="mb-5 flex items-end justify-between border-b border-white/15 pb-3">
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-mansagold">{eyebrow}</div>
      <h2 className="mt-1 text-2xl font-bold text-white">{title}</h2>
    </div>
    {hint && <div className="text-sm text-white/70 tabular-nums">{hint}</div>}
  </div>
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
  apple: { mrr: 0, activeCount: 0 },
  corpSubs: { mrr: 0, activeCount: 0, byTier: {} },
  serviceBookings: { total: 0, count: 0, last30: 0 },
};

export default function PlatformRevenuePage() {
  const [s, setS] = useState<RevenueState>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const thirtyAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const monthStart = new Date();
      monthStart.setUTCDate(1);
      monthStart.setUTCHours(0, 0, 0, 0);

      const next: RevenueState = JSON.parse(JSON.stringify(EMPTY));

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

      const { count: ac } = await supabase
        .from('api_usage_logs')
        .select('*', { count: 'exact', head: true })
        .gte('request_timestamp', monthStart.toISOString());
      next.apiCalls = ac ?? 0;

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

      const { data: rideRows } = await supabase
        .from('noir_rides')
        .select('platform_fee, created_at, status');
      (rideRows ?? []).forEach((r: any) => {
        const fee = Number(r.platform_fee || 0);
        next.noire.total += fee;
        next.noire.count += 1;
        if (r.created_at && r.created_at >= thirtyAgo) next.noire.last30 += fee;
      });

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

      const { data: appleRows } = await supabase
        .from('apple_subscriptions')
        .select('product_id, status, expires_date')
        .eq('status', 'active');
      (appleRows ?? []).forEach((r: any) => {
        const pid = String(r.product_id ?? '').toLowerCase();
        let price = 0;
        for (const [tier, p] of Object.entries(SUBSCRIPTION_MRR)) {
          if (pid.includes(tier)) {
            price = p;
            break;
          }
        }
        if (price > 0) {
          next.apple.mrr += price;
          next.apple.activeCount += 1;
        }
      });

      const { data: corpRows } = await supabase
        .from('corporate_subscriptions')
        .select('tier, status')
        .eq('status', 'active');
      (corpRows ?? []).forEach((r: any) => {
        const key = String(r.tier ?? '').toLowerCase().trim();
        const price = SPONSOR_MRR[key] ?? 0;
        if (price > 0) {
          next.corpSubs.mrr += price;
          next.corpSubs.activeCount += 1;
          next.corpSubs.byTier[key] = (next.corpSubs.byTier[key] ?? 0) + 1;
        }
      });

      const { data: bookRows } = await supabase
        .from('bookings')
        .select('platform_fee, created_at, status')
        .neq('status', 'cancelled');
      (bookRows ?? []).forEach((r: any) => {
        const fee = Number(r.platform_fee || 0);
        next.serviceBookings.total += fee;
        next.serviceBookings.count += 1;
        if (r.created_at && r.created_at >= thirtyAgo) next.serviceBookings.last30 += fee;
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
      s.bhm.total +
      s.serviceBookings.total,
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
      s.bhm.last30 +
      s.serviceBookings.last30,
    [s],
  );
  const totalMrr =
    s.featured.mrr +
    s.subscriptions.mrr +
    s.apiTiers.mrr +
    s.sponsors.mrr +
    s.apple.mrr +
    s.corpSubs.mrr;
  const annualizedFromMrr = totalMrr * 12;
  const netLast30 = last30Total + totalMrr - s.agentCommissions.last30;
  const dash = loading ? '—' : null;

  return (
    <div className="min-h-screen bg-black text-foreground">
      <Helmet>
        <title>Platform Revenue | Admin</title>
      </Helmet>

      {/* Subtle brand glow — restrained, single layer */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-mansablue/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-mansagold/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 py-10 lg:px-10 lg:py-14">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-6 border-b border-white/5 pb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-mansagold/80">
              Executive Dashboard
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl">
              Platform Revenue
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Live view of every 1325.AI revenue stream — recurring, transactional, ancillary.
            </p>
          </div>
          <div className="hidden shrink-0 text-right lg:block">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              As of
            </div>
            <div className="mt-1 text-sm text-foreground/80 tabular-nums">
              {new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>

        {/* KPI hero strip */}
        <div className="mb-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi
            label="Net Last 30 Days"
            value={dash ?? fmt(netLast30)}
            hint="Transactional + MRR – agent commissions"
            tone="positive"
          />
          <Kpi
            label="Monthly Recurring"
            value={dash ?? fmt(totalMrr)}
            hint={`${fmt(annualizedFromMrr)} annualized`}
            tone="blue"
          />
          <Kpi
            label="Annualized Run-Rate"
            value={dash ?? fmtCompact(annualizedFromMrr)}
            hint="MRR × 12"
            tone="gold"
          />
          <Kpi
            label="Lifetime Transactional"
            value={dash ?? fmt(lifetimeTotal)}
            hint="All one-time fees, all-time"
          />
        </div>

        {/* Recurring MRR streams */}
        <section className="mb-12">
          <SectionHeader
            eyebrow="Recurring"
            title="MRR Streams"
            hint={`${fmt(totalMrr)}/mo total`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <StreamTile
              icon={<Users className="h-4 w-4" />}
              label="Business Subscriptions"
              primary={dash ?? fmt(s.subscriptions.mrr) + '/mo'}
              secondary={`${s.subscriptions.activeCount} active plans`}
              meta={`${fmt(s.subscriptions.mrr * 12)} ARR`}
            />
            <StreamTile
              icon={<Crown className="h-4 w-4" />}
              label="Featured Placements"
              primary={dash ?? fmt(s.featured.mrr) + '/mo'}
              secondary={`${s.featured.activeCount} active`}
              meta={`${fmt(s.featured.mrr * 12)} ARR`}
            />
            <StreamTile
              icon={<Building2 className="h-4 w-4" />}
              label="Corporate Sponsors"
              primary={dash ?? fmt(s.sponsors.mrr) + '/mo'}
              secondary={`${s.sponsors.activeCount} active`}
              meta={`${fmt(s.sponsors.mrr * 12)} ARR`}
            />
            <StreamTile
              icon={<Building2 className="h-4 w-4" />}
              label="Corporate B2B Subs"
              primary={dash ?? fmt(s.corpSubs.mrr) + '/mo'}
              secondary={`${s.corpSubs.activeCount} active`}
              meta={`${fmt(s.corpSubs.mrr * 12)} ARR`}
            />
            <StreamTile
              icon={<Code2 className="h-4 w-4" />}
              label="Institutional Data API"
              primary={dash ?? fmt(s.apiTiers.mrr) + '/mo'}
              secondary={`${s.apiTiers.activeCount} paid developers`}
              meta={`${s.apiCalls.toLocaleString()} calls this month`}
            />
            <StreamTile
              icon={<Users className="h-4 w-4" />}
              label="Apple iOS Subscriptions"
              primary={dash ?? fmt(s.apple.mrr) + '/mo'}
              secondary={`${s.apple.activeCount} active`}
              meta={`${fmt(s.apple.mrr * 12)} ARR · UI hidden per App Store`}
            />
          </div>
        </section>

        {/* Transactional */}
        <section className="mb-12">
          <SectionHeader
            eyebrow="Transactional"
            title="One-Time & Per-Event Revenue"
            hint={`${fmt(last30Total)} last 30d · ${fmt(lifetimeTotal)} lifetime`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <StreamTile
              icon={<QrCode className="h-4 w-4" />}
              label="QR Transaction Fees (1.5%)"
              primary={dash ?? fmt(s.qr.total)}
              secondary={`${s.qr.count.toLocaleString()} transactions`}
              meta={`${fmt(s.qr.last30)} last 30d`}
            />
            <StreamTile
              icon={<Zap className="h-4 w-4" />}
              label="Verification Fast-Track"
              primary={dash ?? fmt(s.verification.total)}
              secondary={`${s.verification.count} purchases`}
              meta={`${fmt(s.verification.last30)} last 30d`}
            />
            <StreamTile
              icon={<Briefcase className="h-4 w-4" />}
              label="Job Board Postings"
              primary={dash ?? fmt(s.jobs.total)}
              secondary={`${s.jobs.count} paid posts`}
              meta={`${fmt(s.jobs.last30)} last 30d`}
            />
            <StreamTile
              icon={<Sparkles className="h-4 w-4" />}
              label="Marketing Studio Top-ups"
              primary={dash ?? fmt(s.marketing.total)}
              secondary={`${s.marketing.count} packs`}
              meta={`${fmt(s.marketing.last30)} last 30d`}
            />
            <StreamTile
              icon={<Calendar className="h-4 w-4" />}
              label="BHM Quick-Add Listings"
              primary={dash ?? fmt(s.bhm.total)}
              secondary={`${s.bhm.count} paid listings`}
              meta={`${fmt(s.bhm.last30)} last 30d`}
            />
            <StreamTile
              icon={<Calendar className="h-4 w-4" />}
              label="Service Bookings (fee)"
              primary={dash ?? fmt(s.serviceBookings.total)}
              secondary={`${s.serviceBookings.count} bookings`}
              meta={`${fmt(s.serviceBookings.last30)} last 30d`}
            />
          </div>
        </section>

        {/* Ancillary + Costs */}
        <section className="mb-12">
          <SectionHeader eyebrow="Ancillary" title="Marketplaces, Services & Costs" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <StreamTile
              icon={<Home className="h-4 w-4" />}
              label="Mansa Stays (commission)"
              primary={dash ?? fmt(s.stays.total)}
              secondary={`${s.stays.count} bookings`}
              meta={`${fmt(s.stays.last30)} last 30d`}
            />
            <StreamTile
              icon={<Car className="h-4 w-4" />}
              label="Noire Rideshare (platform fee)"
              primary={dash ?? fmt(s.noire.total)}
              secondary={`${s.noire.count} rides`}
              meta={`${fmt(s.noire.last30)} last 30d`}
            />
            <StreamTile
              icon={<PhoneCall className="h-4 w-4" />}
              label="Kayla Answering Service"
              primary={`${s.answering.activeCount} active`}
              secondary={`${s.answering.callsLast30.toLocaleString()} calls / 30d`}
              meta="Bundled in plans — no direct MRR"
            />
            <StreamTile
              icon={<Activity className="h-4 w-4" />}
              label="API Calls This Month"
              primary={s.apiCalls.toLocaleString()}
              secondary="Metered against tier"
              meta="Volume signal, not revenue"
            />
            <StreamTile
              icon={<HandCoins className="h-4 w-4" />}
              label="Agent Commissions Paid"
              primary={dash ?? `-${fmt(s.agentCommissions.total)}`}
              secondary={`${s.agentCommissions.count} payouts`}
              meta={`-${fmt(s.agentCommissions.last30)} last 30d`}
              negative
            />
          </div>
        </section>

        {/* Breakdown tables */}
        {(s.subscriptions.activeCount > 0 || s.featured.activeCount > 0) && (
          <section className="mb-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {s.subscriptions.activeCount > 0 && (
              <Card className="border-white/10 bg-white/[0.02] backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-mansablue" />
                    <CardTitle className="text-sm font-medium">
                      Business Subscriptions by Tier
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Live business plans contributing to MRR
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(['essentials', 'starter', 'pro', 'enterprise'] as const).map((t) => {
                      const count = s.subscriptions.byTier[t] ?? 0;
                      const sub = count * (SUBSCRIPTION_MRR[t] ?? 0);
                      if (count === 0) return null;
                      return (
                        <Badge
                          key={t}
                          variant="outline"
                          className="gap-2 border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs capitalize"
                        >
                          <span className="text-foreground">
                            {t} × {count}
                          </span>
                          <span className="text-muted-foreground tabular-nums">
                            {fmt(sub)}/mo
                          </span>
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {s.featured.activeCount > 0 && (
              <Card className="border-white/10 bg-white/[0.02] backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-mansagold" />
                    <CardTitle className="text-sm font-medium">
                      Featured Placements by Tier
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Live placements contributing to MRR
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(['bronze', 'silver', 'gold', 'platinum'] as const).map((t) => {
                      const count = s.featured.byTier[t] ?? 0;
                      const sub = count * (FEATURED_MRR[t] ?? 0);
                      if (count === 0) return null;
                      return (
                        <Badge
                          key={t}
                          variant="outline"
                          className="gap-2 border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs capitalize"
                        >
                          <span className="text-foreground">
                            {t} × {count}
                          </span>
                          <span className="text-muted-foreground tabular-nums">
                            {fmt(sub)}/mo
                          </span>
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {/* Revenue stack summary */}
        <Card className="border-white/10 bg-white/[0.02] backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-mansagold" />
              <CardTitle className="text-sm font-medium">Revenue Stack Summary</CardTitle>
            </div>
            <CardDescription className="text-xs">
              16 monetized streams tracked end-to-end. Agent commissions netted. Apple iOS
              subscriptions tracked but UI hidden per App Store policy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-white/5 text-sm">
              <div className="flex items-center justify-between py-2.5">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-3.5 w-3.5 text-mansagold" /> Lifetime transactional
                </dt>
                <dd className="font-semibold tabular-nums">{fmt(lifetimeTotal)}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-3.5 w-3.5 text-mansagold" /> Monthly recurring (MRR)
                </dt>
                <dd className="font-semibold tabular-nums">{fmt(totalMrr)}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-3.5 w-3.5 text-mansagold" /> Annualized run-rate
                </dt>
                <dd className="font-semibold tabular-nums">{fmt(annualizedFromMrr)}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-3.5 w-3.5 text-mansagold" /> Last 30d gross (incl. MRR)
                </dt>
                <dd className="font-semibold tabular-nums">{fmt(last30Total + totalMrr)}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <ArrowDownRight className="h-3.5 w-3.5 text-red-400" /> Agent commissions (30d)
                </dt>
                <dd className="font-semibold tabular-nums text-red-300">
                  -{fmt(s.agentCommissions.last30)}
                </dd>
              </div>
              <div className="flex items-center justify-between pt-3">
                <dt className="flex items-center gap-2 text-foreground">
                  <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                  <span className="font-medium">Net last 30 days</span>
                </dt>
                <dd className="text-lg font-bold tabular-nums text-emerald-300">
                  {fmt(netLast30)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
