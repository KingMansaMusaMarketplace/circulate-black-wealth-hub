import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCachedSponsors } from '@/hooks/useCachedSponsors';
import { SPONSOR_TIER_SLOTS } from '@/config/sponsorSlots';

const useDirectoryReach = () =>
  useQuery({
    queryKey: ['sponsors-directory-reach'],
    queryFn: async () => {
      const { count } = await supabase
        .from('businesses')
        .select('id', { count: 'exact', head: true })
        .eq('listing_status', 'live');
      return { businesses: count ?? 0 };
    },
    staleTime: 60 * 60 * 1000,
  });

const SponsorsPage: React.FC = () => {
  const { data: sponsors } = useCachedSponsors();
  const { data: reach } = useDirectoryReach();

  const live = sponsors || [];
  const businessCount = reach?.businesses ?? 0;

  return (
    <>
      <Helmet>
        <title>Corporate Partners & Sponsorship Slots | 1325.AI</title>
        <meta
          name="description"
          content="See the brands partnering with 1325.AI and the corporate sponsorship slots still open across our verified national directory of Black-owned businesses."
        />
        <link rel="canonical" href="https://1325.ai/sponsors" />
      </Helmet>

      <main className="min-h-screen bg-black">
        {/* Hero */}
        <section className="relative py-24 border-b border-mansagold/20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase mb-4">
              Corporate partners
            </p>
            <h1 className="font-playfair text-4xl md:text-6xl font-semibold text-white tracking-tight">
              The partner wall.
            </h1>
            <p className="text-white/85 mt-6 max-w-2xl mx-auto text-lg">
              A limited number of brands are recognized across every surface of 1325.AI —
              the directory, the AI assistant, and the reports that reach our community.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-14">
              {[
                { value: businessCount ? businessCount.toLocaleString() : '—', label: 'Verified businesses' },
                { value: '42', label: 'Agentic AI Employees' },
                { value: '50', label: 'States covered' },
                { value: '45', label: 'Patent claims pending' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-playfair text-3xl md:text-4xl text-mansagold font-semibold">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-xs mt-2 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Current partners */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-playfair text-2xl md:text-3xl text-white text-center mb-12">
              Current partners
            </h2>

            {live.length === 0 ? (
              <p className="text-white/70 text-center max-w-xl mx-auto">
                Founding partner slots are open now. The first brands on this wall are
                recognized permanently as founding partners of the 1325.AI network.
              </p>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-8 max-w-5xl mx-auto">
                {live.map((s) => (
                  <a
                    key={s.id}
                    href={s.website_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="rounded-xl border border-mansagold/25 bg-white/[0.03] p-6 hover:border-mansagold/60 transition-colors"
                  >
                    {s.logo_url ? (
                      <img
                        src={s.logo_url}
                        alt={`${s.company_name} — ${s.tier} partner of 1325.AI`}
                        loading="lazy"
                        className="max-h-14 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-white">{s.company_name}</span>
                    )}
                    <p className="text-[10px] text-mansagold uppercase tracking-[0.2em] mt-4 text-center">
                      {s.tier}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Open slots */}
        <section className="py-20 border-t border-mansagold/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase mb-4">
                Availability
              </p>
              <h2 className="font-playfair text-3xl md:text-4xl text-white">
                Slots still open.
              </h2>
              <p className="text-white/80 mt-4 max-w-2xl mx-auto">
                Each tier is capped. When a tier is full, it stays full for the term.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {SPONSOR_TIER_SLOTS.map((slot, i) => {
                const taken = live.filter((s) => s.tier === slot.tier).length;
                const remaining = Math.max(0, slot.maxSlots - taken);
                const isFull = remaining === 0;

                return (
                  <motion.div
                    key={slot.tier}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-2xl border-2 border-mansagold/25 bg-black p-8 flex flex-col"
                  >
                    <div className="flex items-baseline justify-between mb-3">
                      <h3 className="font-playfair text-xl text-white">{slot.label}</h3>
                      <span
                        className={`text-[10px] uppercase tracking-[0.2em] ${
                          isFull ? 'text-white/50' : 'text-mansagold'
                        }`}
                      >
                        {isFull ? 'Full' : `${remaining} available`}
                      </span>
                    </div>

                    <p className="text-white/75 text-sm mb-6">{slot.blurb}</p>

                    <div className="mb-6 pb-6 border-b border-mansagold/20">
                      <div className="font-playfair text-2xl text-white">{slot.annual}</div>
                      <p className="text-white/70 text-sm mt-1">{slot.monthly}</p>
                    </div>

                    <ul className="space-y-2 mb-8 flex-grow">
                      <li className="flex items-start gap-2 text-white/85 text-sm">
                        <Check className="w-4 h-4 text-mansagold mt-0.5 flex-shrink-0" />
                        Logo on the partner wall and platform footer
                      </li>
                      <li className="flex items-start gap-2 text-white/85 text-sm">
                        <Check className="w-4 h-4 text-mansagold mt-0.5 flex-shrink-0" />
                        Verified impact reporting
                      </li>
                    </ul>

                    {slot.tier === 'founding' ? (
                      <Button
                        asChild
                        className="w-full bg-mansagold hover:bg-mansagold/90 text-slate-900"
                        disabled={isFull}
                      >
                        <Link to="/sponsor-pricing?tier=founding">
                          Reserve this slot
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-mansagold/40 text-white hover:bg-mansagold/10"
                      >
                        <Link to="/corporate-sponsorship#sponsorship-form">
                          Talk to partnerships
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-16">
              <p className="text-white/70 text-sm">
                Questions about a custom engagement?{' '}
                <a href="mailto:Partner@1325.AI" className="text-mansagold hover:underline">
                  Partner@1325.AI
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default SponsorsPage;
