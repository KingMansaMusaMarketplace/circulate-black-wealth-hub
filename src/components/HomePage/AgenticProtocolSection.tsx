import React from 'react';
import { Bot, Workflow, Network, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

const levels = [
  {
    num: '01',
    label: 'Assistants',
    icon: Bot,
    audience: '99% of users',
    title: 'Single-prompt AI tools',
    desc: 'ChatGPT, Claude, Gemini. You ask, they answer. One task at a time.',
    accent: 'from-white/10 to-white/5',
    border: 'border-white/10',
    text: 'text-white/60',
  },
  {
    num: '02',
    label: 'Agent Operators',
    icon: Workflow,
    audience: '0.3% of users',
    title: 'Autonomous task completion',
    desc: 'Manus, Claude Code, Devin. Multi-step execution without hand-holding.',
    accent: 'from-mansablue/20 to-blue-600/10',
    border: 'border-mansablue/30',
    text: 'text-blue-300',
  },
  {
    num: '03',
    label: 'AI Organizations',
    icon: Network,
    audience: '0.05% — where 1325.AI lives',
    title: 'Orchestrated agent teams running entire operations',
    desc: 'Kayla + sub-agents discover, transact, and circulate wealth across the network. The protocol layer powering Level 3 commerce.',
    accent: 'from-mansagold/30 to-amber-500/15',
    border: 'border-mansagold/50',
    text: 'text-mansagold',
    highlighted: true,
  },
];

const AgenticProtocolSection: React.FC = () => {
  return (
    <section className="relative py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mansagold/10 border border-mansagold/30 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-mansagold animate-pulse" />
            <span className="text-xs font-medium tracking-widest uppercase text-mansagold">
              The Agentic Stack
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight">
            While 99% build assistants,
            <br />
            <span className="bg-gradient-to-r from-mansagold via-amber-400 to-mansagold bg-clip-text text-transparent">
              we built the rails AI agents transact on.
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
            {siteConfig.infrastructureTagline} — the infrastructure layer where autonomous AI organizations
            discover, transact, and circulate wealth across an underserved $1.6T market.
          </p>
        </div>

        {/* Three Levels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-12">
          {levels.map((level) => {
            const Icon = level.icon;
            return (
              <div
                key={level.num}
                className={`relative group rounded-2xl border ${level.border} bg-gradient-to-br ${level.accent} backdrop-blur-sm p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 ${
                  level.highlighted ? 'md:scale-105 shadow-[0_0_60px_-15px_rgba(212,175,55,0.4)]' : ''
                }`}
              >
                {level.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-mansagold text-black text-[10px] font-bold tracking-widest uppercase">
                    Our Layer
                  </div>
                )}

                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-black/40 border ${level.border} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${level.text}`} />
                  </div>
                  <span className={`text-4xl md:text-5xl font-bold ${level.text} opacity-100 drop-shadow-[0_0_12px_currentColor]`}>
                    {level.num}
                  </span>
                </div>

                <div className={`text-xs font-semibold tracking-widest uppercase ${level.text} mb-2`}>
                  Level {level.num} · {level.label}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
                  {level.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-5">
                  {level.desc}
                </p>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-[11px] uppercase tracking-wider text-white/40 mb-1">
                    Market reach
                  </div>
                  <div className={`text-sm font-medium ${level.text}`}>
                    {level.audience}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer pillars */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-mansagold mb-3">
                Infrastructure
              </div>
              <ul className="space-y-2">
                {siteConfig.iaasPillars.infrastructure.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                    <ArrowRight className="w-3.5 h-3.5 text-mansagold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-mansagold mb-3">
                Data Platform
              </div>
              <ul className="space-y-2">
                {siteConfig.iaasPillars.dataPlatform.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                    <ArrowRight className="w-3.5 h-3.5 text-mansagold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-mansagold mb-3">
                Applications
              </div>
              <ul className="space-y-2">
                {siteConfig.iaasPillars.applications.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                    <ArrowRight className="w-3.5 h-3.5 text-mansagold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgenticProtocolSection;
