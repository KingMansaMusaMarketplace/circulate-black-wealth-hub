import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { updateMetaTags, pageSEO } from '@/utils/seoUtils';
import { trackFunnelEvent } from '@/lib/analytics/funnel-tracker';
import { OrganizationStructuredData } from '@/components/SEO/OrganizationStructuredData';
import { WebsiteStructuredData } from '@/components/SEO/WebsiteStructuredData';
import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';
import BusinessSubmissionBox from '@/components/homepage/BusinessSubmissionBox';
import MultiSiteRevenueShareCard from '@/components/homepage/MultiSiteRevenueShareCard';


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

  useEffect(() => {
    trackFunnelEvent('homepage_view');
    queryClient.invalidateQueries();
    updateMetaTags({
      title: 'About 1325.AI — Kayla & 42 Agentic AI Employees',
      description:
        "1325.AI orchestrates the world's largest verified Black-owned business directory — 44,000+ listings powered by Kayla and 42 Agentic AI Employees.",
      path: '/about-1325',
      keywords: pageSEO.home.keywords,
    });
  }, [queryClient]);

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
        {/* Screen 1 — Hero (Layered: Infrastructure headline + Consumer subhead) */}
        <section className="flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center max-w-6xl mx-auto min-h-[92vh]">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-mansagold/30 rounded-full bg-mansagold/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mansagold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mansagold" />
            </span>
            <span className="text-[10px] uppercase tracking-widest font-medium text-mansagold font-mono">
              Live on the Model Context Protocol Registry
            </span>
          </div>

          {/* Investor headline — the infrastructure story */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6 leading-[1.15] text-white">
            The <span className="text-mansagold italic font-normal">MCP infrastructure layer</span>
            <span className="block mt-2 md:mt-3">for the $12T global Black economy.</span>
          </h1>

          {/* TAM proof strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10 text-xs md:text-sm font-mono text-zinc-400">
            <span><span className="text-mansagold">$2.1T</span> U.S.</span>
            <span className="text-zinc-600">·</span>
            <span><span className="text-mansagold">$9.1T</span> Global</span>
            <span className="text-zinc-600">·</span>
            <span><span className="text-mansagold">44,000+</span> Verified Businesses</span>
            <span className="text-zinc-600">·</span>
            <span><span className="text-mansagold">27</span> Patent Claims</span>
          </div>

          {/* Consumer subhead — keeps "buy Black" mission alive */}
          <div className="max-w-3xl mx-auto mb-12 border-t border-zinc-900 pt-8">
            <p className="text-lg md:text-2xl text-white font-light leading-relaxed mb-2">
              The global directory of Black-owned businesses — powered by{' '}
              <span className="text-mansagold italic">Kayla</span> and 42 Agentic AI Employees.
            </p>
            <p className="text-sm md:text-base text-zinc-300 font-light">
              Discover, support, and circulate wealth across 44,000+ verified businesses worldwide.
            </p>
          </div>

          {/* Dual-audience CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Link
              to="/directory"
              className="px-8 py-4 bg-mansagold text-black font-semibold rounded-sm hover:bg-mansagold-dark transition-colors duration-300 min-w-[220px]"
            >
              Shop Black-Owned
            </Link>
            <Link
              to="/what-kayla-does"
              className="px-8 py-4 text-white border border-zinc-700 hover:border-mansagold transition-all duration-300 min-w-[220px]"
            >
              Deploy Kayla
            </Link>
            <Link
              to="/investors"
              className="px-8 py-4 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white transition-all duration-300 min-w-[220px]"
            >
              For Investors →
            </Link>
          </div>

          {/* Founder quote */}
          <blockquote className="max-w-4xl mx-auto mt-8 text-center">
            <p className="text-sm md:text-base lg:text-lg font-medium italic leading-relaxed text-mansagold">
              “For too long, we have been divided economically. 1325.AI is the MCP infrastructure layer that turns Black-owned business into global-scale enterprise.”
            </p>
            <cite className="block mt-3 text-xs md:text-sm uppercase tracking-[0.2em] text-zinc-300 font-mono not-italic">
              — Thomas D. Bowling, Founder & Chief Architect
            </cite>
          </blockquote>

          <div className="mt-16 flex flex-col items-center gap-3">
            <a
              href="#submit-business"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-success text-success-foreground text-sm uppercase tracking-[0.1em] hover:bg-success/90 transition-colors shadow-[0_0_20px_hsl(var(--success)/35%)] hover:shadow-[0_0_28px_hsl(var(--success)/55%)]"
            >
              <span className="font-black">Submit your Business for FREE</span> →
            </a>
            <Link
              to="/team"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-mansagold/40 text-mansagold font-bold text-sm uppercase tracking-[0.1em] hover:bg-mansagold/10 hover:border-mansagold transition-colors"
            >
              Meet The 1325.AI Team →
            </Link>
          </div>
        </section>

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
                  desc: 'Chief Orchestrator. Directs the fleet of 42 agents to curate, verify, and connect 44,000+ businesses to global capital.',
                },
                {
                  code: 'AGENT_02',
                  name: 'The Verifier',
                  desc: 'Ensuring every entry in our 44,000+ directory meets institutional standards for ownership and operational status.',
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
              <h2 className="text-6xl md:text-8xl font-light text-white mb-6 italic">44,000+</h2>
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
