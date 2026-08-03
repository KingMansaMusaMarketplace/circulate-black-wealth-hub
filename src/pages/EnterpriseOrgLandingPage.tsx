import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  Network,
  Sparkles,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  PENDING_ORG_JOIN_KEY,
  useEnterpriseOrg,
  useJoinOrg,
  useOrgMembership,
} from '@/hooks/use-enterprise-org';
import { AGENT_DIVISIONS, TOTAL_AGENTS } from '@/lib/enterprise/agent-divisions';

import aamesLogo from '@/assets/aames-logo.png.asset.json';

const DEFAULT_SLUG = 'aames';

const EnterpriseOrgLandingPage: React.FC = () => {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const slug = routeSlug ?? DEFAULT_SLUG;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const { data: org, isLoading } = useEnterpriseOrg(slug);
  const { data: membership } = useOrgMembership(org?.id);
  const joinOrg = useJoinOrg();

  const isAames = (org?.slug || DEFAULT_SLUG) === 'aames';
  const shortName = org?.short_name || org?.name || 'Your organization';

  // If the visitor was sent to sign up and has now returned signed in,
  // finish the join automatically.
  useEffect(() => {
    if (!user || !org?.id || membership) return;
    let pending: string | null = null;
    try {
      pending = window.localStorage.getItem(PENDING_ORG_JOIN_KEY);
    } catch {
      pending = null;
    }
    if (!pending) return;
    const [pendingSlug, memberType] = pending.split('|');
    if (pendingSlug !== slug) return;
    try {
      window.localStorage.removeItem(PENDING_ORG_JOIN_KEY);
    } catch {
      /* ignore */
    }
    joinOrg.mutate(
      {
        orgId: org.id,
        memberType: memberType === 'business_owner' ? 'business_owner' : 'member',
        source: 'landing_page',
      },
      {
        onSuccess: () => {
          toast.success(`You're connected to ${shortName}.`);
          if (memberType === 'business_owner') navigate('/business-signup');
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, org?.id, membership]);

  const handleJoin = (memberType: 'member' | 'business_owner') => {
    if (!org?.id) return;

    if (!user) {
      try {
        window.localStorage.setItem(PENDING_ORG_JOIN_KEY, `${slug}|${memberType}`);
      } catch {
        /* ignore */
      }
      navigate(`/signup?redirect=${encodeURIComponent(`/${slug === DEFAULT_SLUG ? 'aames' : `enterprise/${slug}`}`)}`);
      return;
    }

    joinOrg.mutate(
      { orgId: org.id, memberType, source: searchParams.get('src') ?? 'landing_page' },
      {
        onSuccess: () => {
          toast.success(
            memberType === 'business_owner'
              ? 'Connected. Let’s get your business listed.'
              : `Welcome in — you're now linked to ${shortName}.`
          );
          if (memberType === 'business_owner') navigate('/business-signup');
        },
        onError: (e: any) => toast.error(e?.message ?? 'Could not complete that right now.'),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Partner page not found</h1>
        <p className="text-muted-foreground">
          This organization page isn’t available yet.
        </p>
        <Button onClick={() => navigate('/')}>Go to 1325.AI</Button>
      </div>
    );
  }

  const brand = { borderColor: org.accent_color };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#050a18] to-[#030712]">
      <Helmet>
        <title>{`${shortName} × 1325.AI — Free Membership Portal`}</title>
        <meta
          name="description"
          content={`${org.name} has partnered with 1325.AI. Members and member-owned businesses get free access to the directory, Kayla, and the ${TOTAL_AGENTS} Agentic AI Employees.`}
        />
        <link rel="canonical" href={`https://1325.ai/${slug === DEFAULT_SLUG ? 'aames' : `enterprise/${slug}`}`} />
        <meta property="og:title" content={`${shortName} × 1325.AI`} />
        <meta property="og:description" content={org.tagline ?? `${org.name} partners with 1325.AI.`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-14 sm:pt-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            background: `radial-gradient(60% 50% at 50% 0%, ${org.accent_color} 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
        <div className="container relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Co-brand lock-up */}
            <div className="mb-8 flex items-center justify-center gap-4 sm:gap-6">
              {isAames ? (
                <img
                  src={aamesLogo.url}
                  alt="The Association of African Methodist Episcopal Scouts logo"
                  className="h-20 w-20 rounded-full bg-white p-1 sm:h-28 sm:w-28"
                  loading="eager"
                />
              ) : (
                <span
                  className="rounded-xl border px-4 py-2 text-lg font-bold tracking-wide text-white sm:text-2xl"
                  style={{ ...brand, backgroundColor: `${org.primary_color}33` }}
                >
                  {shortName}
                </span>
              )}
              <span className="text-xl text-white/40 sm:text-2xl">×</span>
              <span className="font-mono text-lg tracking-wider text-mansagold sm:text-2xl">
                1325.AI
              </span>
            </div>


            <Badge
              variant="outline"
              className="mb-6 border-mansagold/40 bg-mansagold/10 text-mansagold"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Official Partnership · No cost to members
            </Badge>

            <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-white sm:text-5xl">
              {shortName} has partnered with 1325.AI.
              <span className="block text-mansagold">Your membership is free.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
              {org.tagline ??
                'A full agentic back office for the organization, and a free directory listing for every member-owned business.'}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                disabled={joinOrg.isPending}
                onClick={() => handleJoin('member')}
                className="w-full bg-gradient-to-r from-mansagold-dark via-mansagold to-mansagold-dark text-base font-semibold text-white shadow-lg hover:brightness-110 sm:w-auto"
              >
                {joinOrg.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Users className="mr-2 h-4 w-4" />
                )}
                I’m a member of {shortName}
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={joinOrg.isPending}
                onClick={() => handleJoin('business_owner')}
                className="w-full border-white/25 bg-white/5 text-base font-semibold text-white hover:bg-white/10 sm:w-auto"
              >
                <Building2 className="mr-2 h-4 w-4" />
                I own a business
              </Button>
            </div>

            {membership && (
              <p className="mt-5 inline-flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                You’re registered with {shortName}.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-5xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: Users,
                title: 'Free for every member',
                body: `${shortName} negotiated zero cost for members. Create your account, get listed, and start using the platform.`,
              },
              {
                icon: Building2,
                title: 'Your business gets found',
                body: 'Member-owned businesses join a verified directory with loyalty, bookings, and payment tools built in.',
              },
              {
                icon: Network,
                title: 'Discoverable by AI',
                body: '1325.AI is an MCP server, so ChatGPT, Claude, and Cursor can surface member businesses directly in answers.',
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
              >
                <item.icon className="mb-3 h-6 w-6 text-mansagold" />
                <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The agentic back office */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
            What {shortName} leadership gets
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-300">
            Kayla and {TOTAL_AGENTS} Agentic AI Employees, organized into seven divisions, each
            reporting to a named {shortName} leader.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AGENT_DIVISIONS.map((division) => (
              <Card
                key={division.name}
                className="border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <division.icon className="h-5 w-5 text-mansagold" />
                  <Badge variant="outline" className="border-white/15 text-xs text-slate-300">
                    {division.headcount} agents
                  </Badge>
                </div>
                <h3 className="mb-1.5 text-base font-semibold text-white">{division.name}</h3>
                <p className="mb-3 text-sm leading-relaxed text-slate-400">{division.summary}</p>
                <p className="text-xs uppercase tracking-wide text-mansagold/80">
                  Live {division.onboardingWeek}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-4 pb-20 pt-6">
        <div className="container mx-auto max-w-3xl">
          <Card className="border-mansagold/25 bg-white/[0.04] p-8 text-center backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white">Claim your free membership</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              It takes under two minutes. Business owners can list right after signing up.
            </p>
            <Button
              size="lg"
              disabled={joinOrg.isPending}
              onClick={() => handleJoin('member')}
              className="mt-6 bg-gradient-to-r from-mansagold-dark via-mansagold to-mansagold-dark font-semibold text-white hover:brightness-110"
            >
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default EnterpriseOrgLandingPage;
