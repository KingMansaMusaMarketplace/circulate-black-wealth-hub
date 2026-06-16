import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  Building2,
  Users,
  DollarSign,
  Target,
  Megaphone,
  UserPlus,
  Bot,
  Layers,
  Percent,
  Code2,
  Gift,
  Star,
  Database,
  CalendarDays,
  GraduationCap,
  Landmark,
  BedDouble,
  Car,
  Sparkles,
} from 'lucide-react';

const wedgeStreams = [
  {
    icon: Building2,
    name: 'Business Subscriptions',
    description: 'Essentials $19 · Starter $79 · Pro $299 · Enterprise $899/mo',
    revenue: '$355 Blended ARPU',
  },
  {
    icon: Bot,
    name: 'Kayla AI Subscriptions',
    description: '42 agentic AI employees · ~4 Roles Covered · $18,000+/mo savings',
    revenue: 'Embedded in tiers',
  },
  {
    icon: Users,
    name: 'Corporate Sponsors',
    description: 'Non-dilutive runway from Fortune 500 mission partners',
    revenue: '$250K–$1M / yr',
  },
];

const expansionStreams = [
  { icon: DollarSign, name: 'B2B Transaction Fees', note: '1–3% commission' },
  { icon: Target, name: 'Proximity Ads', note: 'CPM-based' },
  { icon: UserPlus, name: 'Agent Commissions', note: 'Referral network' },
  { icon: Layers, name: 'White-Label Licensing', note: 'Tenant-branded' },
  { icon: Code2, name: 'Premium API', note: 'Developer platform' },
  { icon: Gift, name: 'Loyalty Program Fees', note: 'Rewards engine' },
  { icon: Star, name: 'Listing Boosts', note: 'Featured placement' },
  { icon: Database, name: 'Data & Insights', note: 'Anonymized licensing' },
  { icon: CalendarDays, name: 'Event Sponsorships', note: 'Tickets + brand' },
  { icon: GraduationCap, name: 'Certifications', note: 'Training revenue' },
  { icon: Landmark, name: 'Embedded Financing', note: 'Capital access' },
  { icon: BedDouble, name: 'Mansa Stays', note: 'Rental commissions' },
  { icon: Car, name: 'Noire Rideshare', note: 'Ride commissions' },
  { icon: Sparkles, name: 'Gemini Enterprise', note: '$25K + $8K/mo' },
];

const PitchSlide6BusinessModel: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center px-6 py-6">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
            <span className="text-mansagold">17</span> Revenue Streams
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-3xl mx-auto">
            <span className="text-mansagold font-semibold">3 Launch Wedges</span> drive years 1–2 ·
            <span className="text-white/80 font-semibold"> 14 Expansion Layers</span> unlock the platform ceiling
          </p>
        </motion.div>

        {/* WEDGE SECTION */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-mansagold/40" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-mansagold uppercase">
              Launch Wedge · Years 1–2
            </span>
            <div className="h-px flex-1 bg-mansagold/40" />
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {wedgeStreams.map((stream, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="p-4 bg-gradient-to-br from-mansagold/15 to-black/80 border-2 border-mansagold h-full relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-[9px] font-black tracking-widest text-mansagold/80 bg-mansagold/10 px-2 py-0.5 rounded">
                    WEDGE
                  </div>
                  <div className="w-12 h-12 bg-mansagold/20 rounded-xl flex items-center justify-center mb-3">
                    <stream.icon className="w-6 h-6 text-mansagold" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">{stream.name}</h3>
                  <p className="text-white/70 text-xs mb-2 leading-snug">{stream.description}</p>
                  <div className="text-sm font-bold text-mansagold">{stream.revenue}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* EXPANSION SECTION */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-white/20" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
              Expansion Layer · Year 2+
            </span>
            <div className="h-px flex-1 bg-white/20" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {expansionStreams.map((stream, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.03 }}
              >
                <Card className="p-2.5 bg-black/60 border border-white/15 hover:border-white/40 transition-all h-full">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center flex-shrink-0">
                      <stream.icon className="w-3.5 h-3.5 text-white/80" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-white leading-tight">{stream.name}</div>
                      <div className="text-[10px] text-white/50 leading-tight mt-0.5">{stream.note}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* METRICS STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-3 md:p-4 bg-black/80 border-2 border-mansagold">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-base md:text-lg font-bold text-white mb-0.5">
                  Disciplined Wedge → 17-Stream Platform
                </h3>
                <p className="text-white/70 font-medium text-xs">
                  86% Gross Margin · 142% NRR · 2.8-mo CAC Payback
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-mansagold">$2.4M</div>
                  <div className="text-[10px] text-white font-semibold">2026 Target ARR</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-white">$355</div>
                  <div className="text-[10px] text-white/60 font-semibold">Blended ARPU</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide6BusinessModel;
