import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { updateMetaTags, pageSEO } from '@/utils/seoUtils';
import { trackFunnelEvent } from '@/lib/analytics/funnel-tracker';
import { OrganizationStructuredData } from '@/components/SEO/OrganizationStructuredData';
import { WebsiteStructuredData } from '@/components/SEO/WebsiteStructuredData';
import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';
import BusinessSubmissionBox from '@/components/homepage/BusinessSubmissionBox';

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
        {/* Screen 1 — Hero */}
        <section className="flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center max-w-5xl mx-auto min-h-[92vh]">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-zinc-800 rounded-full bg-zinc-900/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mansagold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mansagold" />
            </span>
            <span className="text-[10px] uppercase tracking-widest font-medium text-zinc-400 font-mono">
              System Status: Fully Operational
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8 leading-[1.1]">
            Meet <span className="text-mansagold italic font-normal">Kayla</span> and the
            <br className="hidden md:block" /> 42 Agentic AI Employees.
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Orchestrating the world's largest verified Black-owned business directory. 44,000+
            listings powered by institutional-grade intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/what-kayla-does"
              className="px-8 py-4 bg-mansagold text-black font-semibold rounded-sm hover:bg-mansagold-dark transition-colors duration-300 min-w-[200px]"
            >
              Deploy Kayla
            </Link>
            <Link
              to="/directory"
              className="px-8 py-4 text-zinc-400 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 min-w-[200px] hover:text-white"
            >
              View Directory
            </Link>
          </div>

          <div className="mt-20">
            <a
              href="#submit-business"
              className="text-xs uppercase tracking-[0.2em] text-zinc-600 hover:text-mansagold transition-colors"
            >
              Submit your business →
            </a>
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
                  <span className="font-mono text-[10px] text-mansablue mb-4 block">{a.code}</span>
                  <h3 className="text-xl font-medium mb-3 text-white">{a.name}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">{a.desc}</p>
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
              <p className="text-xl text-zinc-400 font-light leading-relaxed">
                Verified listings making 1325.AI the definitive platform for Black-owned
                enterprise. Scaled by AI, built for legacy.
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
