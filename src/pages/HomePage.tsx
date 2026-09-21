import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, TrendingUp, Users, PlayCircle, ArrowRight } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { updateMetaTags, pageSEO } from '@/utils/seoUtils';
import { trackFunnelEvent } from '@/lib/analytics/funnel-tracker';
import { OrganizationStructuredData } from '@/components/SEO/OrganizationStructuredData';
import { WebsiteStructuredData } from '@/components/SEO/WebsiteStructuredData';
import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';
import BusinessSubmissionBox from '@/components/homepage/BusinessSubmissionBox';
import MultiSiteRevenueShareCard from '@/components/homepage/MultiSiteRevenueShareCard';
import { useLiveBusinessCount } from '@/hooks/use-live-business-count';
import SponsorWallStrip from '@/components/sponsors/SponsorWallStrip';


/**
 * HomePage — Kayla-led institutional front door.
 * Three screens: Hero (Kayla + 42 Agentic AI Employees), The Workforce,
 * Scale (44,000+) with the business submission entry point.
 *
 * Pricing, Mansa Stays, Noire Rideshare, and the WhyBand live on their
 * own routes — intentionally kept off the homepage per Boardroom decision.
 */
const HomePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { rounded: liveCount, formatted: liveExact } = useLiveBusinessCount();

  useEffect(() => {
    trackFunnelEvent('homepage_view');
    queryClient.invalidateQueries();
    updateMetaTags({
      title: 'About 1325.AI — Kayla & 42 Agentic AI Employees',
      description:
        `1325.AI orchestrates the world's largest verified Black-owned business directory — ${liveCount} listings powered by Kayla and 42 Agentic AI Employees.`,
      path: '/about-1325',
      keywords: pageSEO.home.keywords,
    });
  }, [queryClient, liveCount]);

  // Smooth-scroll to #submit-business when navigated via hash link.
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <>
      <OrganizationStructuredData />
      <WebsiteStructuredData />

      <div className="bg-black text-zinc-100 selection:bg-mansagold/30 min-h-screen">
        {/* Screen 1 — Hero (VC Institutional) */}
        <section className="flex flex-col items-center px-6 py-16 md:py-20 max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-10 border border-mansagold/30 rounded-full bg-mansagold/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mansagold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mansagold" />
            </span>
            <span className="text-[10px] uppercase tracking-widest font-medium text-mansagold font-mono">
              Live on the Model Context Protocol Registry
            </span>
          </div>

          {/* Credibility metric strip */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 py-8 mb-12 border-y border-white/10">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-mansagold text-3xl font-bold tracking-tight">$2.1T</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/90 mt-1">U.S. Economy Impact</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-mansagold text-3xl font-bold tracking-tight">$9.1T</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/90 mt-1">Global Market Size</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-mansagold text-3xl font-bold tracking-tight">{liveCount}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/90 mt-1">Verified Businesses</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-mansagold text-3xl font-bold tracking-tight">46</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/90 mt-1">Patent Claims</span>
            </div>
          </div>

          {/* Hero content */}
          <div className="max-w-4xl text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] text-white">
              The <span className="text-mansagold italic font-normal">MCP infrastructure layer</span> for the $12T global Black economy.
            </h1>

            <p className="text-lg md:text-2xl text-white font-light leading-relaxed max-w-3xl mx-auto">
              The global directory of Black-owned businesses — powered by{' '}
              <span className="text-mansagold italic">Kayla</span> and 42 Agentic AI Employees.
            </p>
            <p className="text-sm md:text-base text-white/90 font-light">
              Discover, support, and circulate wealth across {liveCount} verified businesses worldwide.
            </p>

            {/* Consolidated CTAs */}
            <div className="pt-4 flex flex-col items-center space-y-8">
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/directory"
                  className="px-8 py-4 bg-mansagold text-black font-bold uppercase tracking-widest text-xs rounded-sm transition-transform hover:scale-105 active:scale-95"
                >
                  Shop Black-Owned
                </Link>
                <Link
                  to="/what-kayla-does"
                  className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-sm transition-transform hover:scale-105 active:scale-95"
                >
                  Deploy Kayla
                </Link>
                <a
                  href="#submit-business"
                  className="px-8 py-4 border border-white/30 text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white hover:text-black transition-all"
                >
                  Submit Your Business — Free
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-white/90">
                <Link to="/investors" className="hover:text-mansagold flex items-center gap-2 group transition-colors">
                  For Investors
                  <span className="w-1 h-1 bg-mansagold rounded-full group-hover:w-4 transition-all" />
                </Link>
                <Link to="/team" className="hover:text-mansagold flex items-center gap-2 group transition-colors">
                  Meet the Team
                  <span className="w-1 h-1 bg-mansagold rounded-full group-hover:w-4 transition-all" />
                </Link>
                <a
                  href="https://www.1325.ai/ultimate-deep-dive.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mansagold flex items-center gap-2 group transition-colors"
                >
                  Founder Video
                  <span className="w-1 h-1 bg-mansagold rounded-full group-hover:w-4 transition-all" />
                </a>
              </div>

              <a
                href="https://www.youtube.com/@1325AI"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch 1325.AI on YouTube"
                className="inline-flex items-center gap-3 px-8 py-4 border border-mansagold/60 text-mansagold font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-mansagold hover:text-black transition-all"
              >
                <Youtube className="w-4 h-4" aria-hidden="true" />
                Watch on YouTube
              </a>
            </div>
          </div>

          {/* Founder quote */}
          <div className="mt-16 pt-8 border-t border-white/10 w-full max-w-3xl">
            <blockquote className="text-center">
              <p className="italic text-white/90 font-light text-sm md:text-base leading-relaxed mb-4">
                “For too long, we have been divided economically. 1325.AI is the MCP infrastructure layer that turns Black-owned business into global-scale enterprise.”
              </p>
              <cite className="not-italic">
                <span className="block text-mansagold text-[10px] font-bold uppercase tracking-[0.3em]">Thomas D. Bowling</span>
                <span className="block text-white/80 text-[9px] uppercase tracking-[0.1em] mt-1 font-mono">Founder &amp; Chief Architect</span>
              </cite>
            </blockquote>
          </div>
        </section>


        {/* Corporate partner wall — shows live partners and open slots */}
        <SponsorWallStrip openSlots={2} />


        {/* Screen 2 — The Workforce */}
        <section className="px-6 py-24 border-t border-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h2 className="text-sm uppercase tracking-[0.3em] text-mansagold font-medium mb-4">
                The Workforce
              </h2>
              <p className="text-3xl font-light text-white">
                Specialized Intelligence. Unified Mission.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900">
              {[
                {
                  code: 'AGENT_01',
                  name: 'Kayla',
                  desc: `Chief Orchestrator. Directs the fleet of 42 agents to curate, verify, and connect ${liveCount} businesses to global capital.`,
                },
                {
                  code: 'AGENT_02',
                  name: 'The Verifier',
                  desc: `Ensuring every entry in our ${liveCount} directory meets institutional standards for ownership and operational status.`,
                },
                {
                  code: 'AGENT_42',
                  name: 'The Connector',
                  desc: 'Autonomous relationship manager matching directory listings with procurement opportunities and strategic partners.',
                },
              ].map((a) => (
                <div key={a.code} className="bg-black p-8 group hover:bg-zinc-950 transition-colors">
                  <span className="font-mono text-sm text-mansablue-light drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] mb-4 block">{a.code}</span>
                  <h3 className="text-xl font-medium mb-3 text-white">{a.name}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">{a.desc}</p>
                  <div className="h-1 w-0 group-hover:w-full bg-mansagold transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screen 3 — Scale + Submit */}
        <section className="px-6 py-24 md:py-32 border-t border-zinc-900">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-6xl md:text-8xl font-light text-white mb-6 italic" title={`${liveExact} verified businesses`}>{liveCount}</h2>
              <p className="text-xl text-zinc-300 font-light leading-relaxed">
                Verified listings making 1325.AI the definitive platform for Black-owned
                enterprise. Scaled by AI Agentic, built for legacy.
              </p>
            </div>

            <div id="submit-business" className="w-full md:max-w-md scroll-mt-24">
              <div className="p-6 border border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
                <h4 className="text-sm uppercase tracking-widest text-mansagold mb-4">
                  Add your business
                </h4>
                <div className="h-px bg-zinc-800 w-full mb-4" />
                <SectionErrorBoundary sectionName="Business Submission">
                  <BusinessSubmissionBox />
                </SectionErrorBoundary>
                <SectionErrorBoundary sectionName="Multi-Site Revenue Sharing">
                  <MultiSiteRevenueShareCard />
                </SectionErrorBoundary>
              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
