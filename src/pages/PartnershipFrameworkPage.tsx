import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Handshake,
  Users,
  Building2,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Calendar,
  Shield,
  MessageSquare,
  Home,
  Briefcase,
  Megaphone,
  GraduationCap,
  Lock,
  Sparkles,
  Database,
  Network,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PARTNER_EMAIL = 'Partner@1325.AI';

const openMail = (subject?: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  const href = `mailto:${PARTNER_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
  try {
    const w = window.open(href, '_blank');
    if (!w) {
      (window.top ?? window).location.href = href;
    }
  } catch {
    // ignore — fall through to clipboard
  }
  navigator.clipboard?.writeText(PARTNER_EMAIL).then(
    () => toast.success(`${PARTNER_EMAIL} copied to your clipboard`),
    () => undefined
  );
};

const PartnershipFrameworkPage: React.FC = () => {
  const navigate = useNavigate();

  const headlineStats = [
    { value: '42', label: 'Agentic AI Employees' },
    { value: '7', label: 'Operating Divisions' },
    { value: '~4', label: 'Roles Covered' },
    { value: '$18K+', label: 'Monthly Salary Equivalent' },
    { value: '$1.04M', label: '5-Year Cumulative Value' },
  ];

  const dealTerms = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: '20% Recurring Revenue Share',
      body: 'Your organization earns 20% of member-business revenue routed through your community — for the full five-year term.',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Revenue Starts Day 60',
      body: 'Your share begins the day the workforce goes live, at the close of the 60-day onboarding window.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Not Billed Against Your Budget',
      body: 'The agentic workforce is delivered as part of the partnership. Our success is tied to yours, not to an invoice.',
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: '5-Year Operating Partnership',
      body: 'Two months to launch, fifty-eight months to compound results — grants, member growth, and shared revenue.',
    },
  ];

  const divisions = [
    { icon: <Briefcase className="w-5 h-5" />, name: 'Executive Office', count: 9, focus: 'Daily leadership briefs, decisions log, institutional memory' },
    { icon: <DollarSign className="w-5 h-5" />, name: 'Finance & Stewardship', count: 8, focus: 'Grant sourcing and drafting, budgets, giving reports' },
    { icon: <Users className="w-5 h-5" />, name: 'Member Operations', count: 6, focus: 'Renewals, onboarding, lapse recovery, member records' },
    { icon: <Megaphone className="w-5 h-5" />, name: 'Communications', count: 6, focus: 'Weekly newsletter, announcements, social, press' },
    { icon: <GraduationCap className="w-5 h-5" />, name: 'Youth & Programs', count: 5, focus: 'Program logistics, event prep, youth engagement tracking' },
    { icon: <Lock className="w-5 h-5" />, name: 'Security & Compliance', count: 5, focus: 'Monthly compliance log, filings calendar, access control' },
    { icon: <Sparkles className="w-5 h-5" />, name: 'Impact & Digital Equity', count: 3, focus: 'Outcome reporting, impact dashboards, digital access' },
  ];

  const onboarding = [
    { window: 'Days 1–14', title: 'Discovery & Mapping', body: 'We meet your leaders, inventory your forms and systems, and map each division to a named person on your side.' },
    { window: 'Days 15–30', title: 'Build & Train', body: 'Agents are configured on your data, your voice, and your calendar. First draft outputs come back for review.' },
    { window: 'Days 31–45', title: 'Live Pilot', body: 'Grants, renewals, and the weekly newsletter run for real, with your leaders approving every send.' },
    { window: 'Days 46–60', title: 'Full Deployment', body: 'All 42 Agentic AI Employees live across 7 divisions. Directory goes live. Revenue share begins.' },
  ];

  const governance = [
    'Your organization owns its data end-to-end — members, donors, documents, and outputs.',
    'Full export in open formats at any time, on request, at no cost.',
    'Clean exit: no penalty, no lock-in, no hostage data.',
    'Encrypted at rest and in transit; role-based access tied to your named leaders.',
    'Built on patent-pending technology — U.S. Provisional Patent Application No. 63/969,202 — 27 claims pending.',
  ];

  const whoFor = [
    'Denominations & church networks',
    'Chambers of commerce',
    'Fraternal orders & civic bodies',
    'Trade & professional associations',
    'Franchise systems',
    'Multi-location brands',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-mansablue-dark via-[hsl(210,100%,12%)] to-[hsl(210,100%,8%)]">
      <Helmet>
        <title>Enterprise Partnership | 20% Revenue Share — 1325.AI</title>
        <meta
          name="description"
          content="A five-year operating partnership powered by Kayla and 42 Agentic AI Employees, with a 20% recurring revenue share for your organization. 60-day onboarding."
        />
        <meta property="og:title" content="Enterprise Partnership | 20% Revenue Share — 1325.AI" />
        <meta
          property="og:description"
          content="Kayla and 42 Agentic AI Employees run your back office. Your organization earns 20% recurring revenue share."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-white/70 hover:text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <div className="h-4 w-px bg-white/20" />
            <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">
              <Handshake className="w-3 h-3 mr-1" />
              Enterprise Partnership
            </Badge>
          </div>
          <a
            href="mailto:Partner@1325.AI"
            onClick={openMail()}
            className="hidden sm:inline-flex items-center gap-2 text-sm text-mansagold hover:text-mansagold/80"
          >
            <MessageSquare className="w-4 h-4" />
            Partner@1325.AI
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <p className="text-mansagold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            Enterprise Partnership Framework
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight max-w-4xl mx-auto">
            We run your back office.
            <br />
            <span className="text-mansagold">You earn 20% of the revenue.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-3xl mx-auto">
            A five-year operating partnership powered by Kayla and 42 Agentic AI Employees — live inside
            60 days, with a recurring revenue share paid to your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <a
              href="mailto:Partner@1325.AI?subject=Enterprise%20Partnership%20Inquiry"
              onClick={openMail('Enterprise Partnership Inquiry')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-mansagold text-mansablue-dark font-bold rounded-full hover:bg-mansagold/90 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Request a Partnership Briefing
            </a>
            <a
              href="mailto:Partner@1325.AI?subject=Revenue%20Share%20Details"
              onClick={openMail('Revenue Share Details')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/25 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Ask about revenue sharing
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Headline stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-14"
        >
          {headlineStats.map((s) => (
            <Card key={s.label} className="p-5 text-center bg-white/5 border-mansagold/25">
              <div className="text-3xl font-bold text-mansagold mb-1">{s.value}</div>
              <div className="text-xs text-white/70 leading-snug">{s.label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Problem / Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid md:grid-cols-2 gap-6 mb-14"
        >
          <Card className="p-8 bg-white/5 border-white/10">
            <h2 className="text-xl font-bold text-white mb-3">The Problem</h2>
            <p className="text-white/75 leading-relaxed">
              Legacy institutions carry decades of mission on the shoulders of a small executive team
              and a volunteer board. Grants slip through the cracks. Members lapse without follow-up.
              Communications stall and compliance work piles up — not for lack of will, but for lack of
              administrative capacity the budget cannot afford.
            </p>
          </Card>
          <Card className="p-8 bg-white/5 border-mansagold/30">
            <h2 className="text-xl font-bold text-white mb-3">The Solution</h2>
            <p className="text-white/85 leading-relaxed">
              1325.AI deploys 42 Agentic AI Employees — autonomous workers organized into 7 divisions,
              each reporting through Kayla to a named leader on your side. They draft grants, run member
              renewals, produce the weekly newsletter, maintain the compliance log, and brief leadership
              daily. No chatbots. No widgets. A working administrative staff whose outputs you own.
            </p>
          </Card>
        </motion.div>

        {/* The Deal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-14"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-mansagold" />
            The Deal
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {dealTerms.map((t) => (
              <Card key={t.title} className="p-6 bg-white/5 border-white/10">
                <div className="w-11 h-11 rounded-lg bg-mansagold/20 flex items-center justify-center text-mansagold mb-4">
                  {t.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{t.body}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Divisions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-14"
        >
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-mansagold" />
            42 Agentic AI Employees, 7 Divisions
          </h2>
          <p className="text-white/60 mb-6">
            Every division reports through Kayla to a named leader in your organization.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {divisions.map((d) => (
              <Card key={d.name} className="p-5 bg-white/5 border-white/10 hover:border-mansagold/40 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-mansagold/20 flex items-center justify-center text-mansagold">
                    {d.icon}
                  </div>
                  <Badge className="bg-mansagold/15 text-mansagold border-mansagold/30">
                    {d.count} agents
                  </Badge>
                </div>
                <h3 className="font-bold text-white mb-1">{d.name}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{d.focus}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Discoverability via MCP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mb-14"
        >
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Network className="w-6 h-6 text-mansagold" />
            Discovery Through AI
          </h2>
          <p className="text-white/60 mb-6">
            Because 1325.AI is built as an MCP server, your members and businesses get found inside the
            AI tools people already use every day.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            <Card className="p-6 bg-white/5 border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">Searchable by ChatGPT, Claude & Cursor</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Members can ask their AI assistant: “Find me a Black-owned barber in Atlanta,” or “Who can
                handle bookkeeping for my church?” — and it pulls real businesses from your partnership
                network.
              </p>
            </Card>
            <Card className="p-6 bg-white/5 border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">Built-In Distribution</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Your businesses show up where people are already asking. No separate ad campaign, no extra
                marketing spend, no new app to download.
              </p>
            </Card>
            <Card className="p-6 bg-white/5 border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">A Live Connector for Your Members</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                The partnership is not just a directory — it is a live AI connection. Your members can reach
                the platform directly from the AI assistants they already use.
              </p>
            </Card>
          </div>
        </motion.div>

        {/* Onboarding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-14"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-mansagold" />
            60-Day Onboarding, Inside the 5-Year Term
          </h2>
          <Card className="p-6 md:p-8 bg-white/5 border-white/10">
            <div className="space-y-6">
              {onboarding.map((step, i) => (
                <div key={step.window} className="flex items-start gap-4 pb-6 border-b border-white/10 last:border-0 last:pb-0">
                  <div className="w-9 h-9 rounded-full bg-mansagold/20 flex items-center justify-center text-mansagold font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-mansagold text-xs font-semibold tracking-widest uppercase mb-1">
                      {step.window}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Governance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid md:grid-cols-2 gap-6 mb-14"
        >
          <Card className="p-8 bg-white/5 border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-mansagold" />
              Data Governance & Exit Terms
            </h2>
            <ul className="space-y-3">
              {governance.map((g) => (
                <li key={g} className="flex items-start gap-2 text-white/75 text-sm leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-mansagold mt-0.5 flex-shrink-0" />
                  {g}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-8 bg-white/5 border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-mansagold" />
              Who This Is For
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {whoFor.map((w) => (
                <div key={w} className="flex items-start gap-2 text-white/75 text-sm">
                  <ArrowRight className="w-4 h-4 text-mansagold mt-0.5 flex-shrink-0" />
                  {w}
                </div>
              ))}
            </div>
            <p className="text-white/55 text-xs mt-5 leading-relaxed">
              Terms are set per organization based on network size, category mix, and member volume.
            </p>
          </Card>
        </motion.div>

        {/* Close */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-8 md:p-10 text-center bg-gradient-to-r from-mansablue to-mansablue-dark border-mansagold/30">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Let's build this together.
            </h2>
            <p className="text-white/75 max-w-2xl mx-auto mb-7">
              Send us your organization, your member count, and the work that keeps falling through the
              cracks. We'll come back with a partnership blueprint built around your leaders.
            </p>
            <a
              href="mailto:Partner@1325.AI?subject=Enterprise%20Partnership%20Inquiry"
              onClick={openMail('Enterprise Partnership Inquiry')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-mansagold text-mansablue-dark font-bold rounded-full hover:bg-mansagold/90 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              Partner@1325.AI
            </a>
            <p className="text-white/50 text-xs mt-6">
              1325.AI — a Mansa Musa Marketplace company • U.S. Provisional Patent Application No.
              63/969,202 — 27 claims pending
            </p>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default PartnershipFrameworkPage;
