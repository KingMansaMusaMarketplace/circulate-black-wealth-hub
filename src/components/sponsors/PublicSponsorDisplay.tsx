import { useCachedSponsors } from '@/hooks/useCachedSponsors';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Star, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { generatePlaceholder } from '@/utils/imageOptimizer';

interface Sponsor {
  id: string;
  tier: string;
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  status: string;
}

const tierConfig: Record<string, { gradient: string; glow: string; label: string }> = {
  platinum: {
    gradient: 'from-purple-500 via-pink-500 to-purple-600',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]',
    label: 'PLATINUM FOUNDING SPONSOR',
  },
  gold: {
    gradient: 'from-mansagold via-amber-500 to-mansagold',
    glow: 'shadow-[0_0_20px_rgba(217,169,56,0.3)]',
    label: 'GOLD SPONSOR',
  },
  silver: {
    gradient: 'from-slate-400 via-gray-300 to-slate-500',
    glow: 'shadow-[0_0_15px_rgba(148,163,184,0.25)]',
    label: 'SILVER SPONSOR',
  },
  bronze: {
    gradient: 'from-orange-600 via-amber-700 to-orange-700',
    glow: 'shadow-[0_0_15px_rgba(194,120,50,0.25)]',
    label: 'BRONZE SPONSOR',
  },
};

export const PublicSponsorDisplay = () => {
  const { data: sponsors, isLoading } = useCachedSponsors();

  useEffect(() => {
    if (sponsors && sponsors.length > 0) {
      sponsors.forEach((sponsor) => {
        supabase.rpc('increment_sponsor_impression', {
          p_subscription_id: sponsor.id,
        });
      });
    }
  }, [sponsors]);

  const handleSponsorClick = async (sponsor: Sponsor) => {
    await supabase.rpc('increment_sponsor_click', {
      p_subscription_id: sponsor.id,
    });
    if (sponsor.website_url) {
      window.open(sponsor.website_url, '_blank', 'noopener,noreferrer');
    }
  };

  // Fallback platinum sponsor when no DB sponsors are available
  const fallbackSponsors: Sponsor[] = [
    {
      id: 'miguel-wilson-collection',
      tier: 'platinum',
      company_name: 'Miguel Wilson Collection',
      logo_url: null,
      website_url: 'https://miguelwilson.com',
      status: 'active',
    },
  ];

  const displaySponsors = sponsors && sponsors.length > 0 ? sponsors : fallbackSponsors;

  if (isLoading) {
    return null;
  }

  const platinumSponsors = sponsors.filter((s) => s.tier === 'platinum');
  const otherSponsors = sponsors.filter((s) => s.tier !== 'platinum');

  const getSponsorLogo = (sponsor: Sponsor) => {
    if (sponsor.logo_url) return sponsor.logo_url;
    return generatePlaceholder(120, 120, sponsor.company_name);
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#050a18] to-[#000000]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="container mx-auto px-4 relative z-10 max-w-[1600px]">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-mansagold" />
            <span className="text-mansagold text-sm font-semibold tracking-[0.2em] uppercase">
              Our Corporate Sponsors
            </span>
            <Sparkles className="h-5 w-5 text-mansagold" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Powering the Future of Black Business
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent mx-auto mb-4" />
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            These organizations invest in our community's economic growth
          </p>
        </div>

        {/* Platinum Sponsors — Full Width */}
        {platinumSponsors.map((sponsor) => {
          const config = tierConfig.platinum;
          return (
            <div
              key={sponsor.id}
              onClick={() => handleSponsorClick(sponsor)}
              className={`relative mb-10 rounded-2xl p-[2px] bg-gradient-to-r ${config.gradient} ${config.glow} cursor-pointer group transition-all duration-300 hover:scale-[1.01]`}
            >
              <div className="rounded-2xl bg-slate-900/90 backdrop-blur-sm p-8">
                <div className="flex items-center gap-2 mb-5">
                  <Star className="h-4 w-4 text-purple-400 fill-purple-400" />
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-purple-300">
                    {config.label}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={getSponsorLogo(sponsor)}
                      alt={sponsor.company_name}
                      className="max-h-20 max-w-20 object-contain"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white">{sponsor.company_name}</h3>
                    {sponsor.website_url && (
                      <span className="inline-flex items-center gap-1.5 text-purple-300 text-sm mt-2 group-hover:text-purple-200 transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Visit Website
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Other Sponsors — Grid */}
        {otherSponsors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherSponsors.map((sponsor) => {
              const config = tierConfig[sponsor.tier] || tierConfig.gold;
              return (
                <div
                  key={sponsor.id}
                  onClick={() => handleSponsorClick(sponsor)}
                  className={`relative rounded-xl p-[1.5px] bg-gradient-to-br ${config.gradient} ${config.glow} cursor-pointer group transition-all duration-300 hover:scale-[1.03]`}
                >
                  <div className="rounded-xl bg-slate-900/90 backdrop-blur-sm p-6 h-full flex flex-col items-center">
                    {/* Tier badge */}
                    <span
                      className={`text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full bg-gradient-to-r ${config.gradient} text-white mb-4`}
                    >
                      {sponsor.tier}
                    </span>

                    {/* Logo */}
                    <div className="w-20 h-20 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden mb-4">
                      <img
                        src={getSponsorLogo(sponsor)}
                        alt={sponsor.company_name}
                        className="max-h-16 max-w-16 object-contain"
                      />
                    </div>

                    {/* Name */}
                    <h4 className="text-white font-semibold text-center text-sm">
                      {sponsor.company_name}
                    </h4>

                    {/* Hover CTA */}
                    {sponsor.website_url && (
                      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="inline-flex items-center gap-1 text-mansagold text-xs">
                          <ExternalLink className="h-3 w-3" />
                          Visit Website
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16 mb-4">
          <p className="text-2xl md:text-3xl font-bold text-white mb-6">
            Interested in sponsoring?
          </p>
          <a
            href="/sponsor-pricing"
            className="inline-block px-10 py-5 text-xl md:text-2xl font-bold rounded-xl bg-gradient-to-r from-mansagold to-amber-500 text-black hover:from-amber-400 hover:to-mansagold transition-all duration-300 shadow-lg shadow-mansagold/30 hover:shadow-xl hover:shadow-mansagold/40 hover:scale-105"
          >
            Become a Sponsor →
          </a>
        </div>
      </div>
    </section>
  );
};
