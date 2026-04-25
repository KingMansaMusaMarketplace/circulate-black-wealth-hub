import { useCachedSponsors } from '@/hooks/useCachedSponsors';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { generatePlaceholder } from '@/utils/imageOptimizer';
import apparelRedefinedLogo from '@/assets/apparel-redefined-logo.png';
import mansaKundaLogo from '@/assets/mansa-kunda-logo.png';
import mansaMusaLogo from '@/assets/mansa-musa-logo.png';

interface Sponsor {
  id: string;
  tier: string;
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  status: string;
  descriptor?: string;
}

const tierLabels: Record<string, string> = {
  platinum: 'Founding Platinum Partner',
  gold: 'Gold Partner',
  silver: 'Silver Partner',
  bronze: 'Bronze Partner',
};

export const PublicSponsorDisplay = () => {
  const { data: sponsors, isLoading } = useCachedSponsors();

  const miguelWilsonSponsor: Sponsor = {
    id: 'miguel-wilson-collection',
    tier: 'platinum',
    company_name: 'Miguel Wilson Collection',
    logo_url: 'https://www.miguelwilson.com/wp-content/uploads/2022/02/miguelnew.jpg',
    website_url: 'https://miguelwilson.com',
    status: 'active',
    descriptor: 'Luxury menswear · Phipps Plaza, Atlanta',
  };

  const apparelRedefinedSponsor: Sponsor = {
    id: 'apparel-redefined',
    tier: 'gold',
    company_name: 'Apparel Redefined',
    logo_url: apparelRedefinedLogo,
    website_url: 'https://apparelredefined.com',
    status: 'active',
  };

  const mansaKundaSponsor: Sponsor = {
    id: 'mansa-kunda',
    tier: 'gold',
    company_name: 'Mansa Kunda',
    logo_url: mansaKundaLogo,
    website_url: 'https://mansakunda.com',
    status: 'active',
  };

  const mansaMusaSponsor: Sponsor = {
    id: 'mansa-musa-marketplace',
    tier: 'gold',
    company_name: 'Mansa Musa Marketplace',
    logo_url: mansaMusaLogo,
    website_url: null,
    status: 'active',
  };

  const otherTierSponsors = sponsors
    ? sponsors.filter(s => s.tier !== 'platinum' && s.company_name !== 'Mansa Musa Marketplace')
    : [];
  const displaySponsors: Sponsor[] = [
    miguelWilsonSponsor,
    apparelRedefinedSponsor,
    mansaKundaSponsor,
    mansaMusaSponsor,
    ...otherTierSponsors,
  ];

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
    if (!sponsor.id.startsWith('miguel-wilson')) {
      await supabase.rpc('increment_sponsor_click', {
        p_subscription_id: sponsor.id,
      });
    }
    if (sponsor.website_url) {
      window.open(sponsor.website_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return null;
  }

  const platinumSponsors = displaySponsors.filter((s) => s.tier === 'platinum');
  const otherSponsors = displaySponsors.filter((s) => s.tier !== 'platinum');

  const getSponsorLogo = (sponsor: Sponsor) => {
    if (sponsor.logo_url) return sponsor.logo_url;
    return generatePlaceholder(120, 120, sponsor.company_name);
  };

  const getDomain = (url: string | null) => {
    if (!url) return '';
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-black">
      {/* Single, quiet gold radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,_rgba(212,175,55,0.08),_transparent_70%)]" />

      {/* Hairline gold rules top/bottom */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mansagold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mansagold/15 to-transparent" />

      <div className="container mx-auto px-4 relative z-10 max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <p className="text-[11px] md:text-xs font-semibold text-mansagold tracking-[0.35em] uppercase mb-6">
            In Partnership With
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-6 leading-[1.1]">
            The institutions standing
            <br />
            with <span className="text-gradient-gold">1325.AI.</span>
          </h2>
          <p className="text-white/85 text-base md:text-lg leading-relaxed">
            A select group of companies investing in the infrastructure of
            Black economic circulation.
          </p>
        </div>

        {/* Platinum Founding Partner — restrained hero card */}
        {platinumSponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            onClick={() => handleSponsorClick(sponsor)}
            className="relative max-w-4xl mx-auto mb-20 cursor-pointer group"
          >
            <div className="relative bg-black border-2 border-mansagold/50 rounded-2xl overflow-hidden transition-colors duration-300 group-hover:border-mansagold/80">
              {/* Top hairline */}
              <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-mansagold to-transparent" />

              <div className="relative px-8 md:px-14 py-12 md:py-14">
                {/* Eyebrow */}
                <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase mb-10 text-center md:text-left">
                  {tierLabels.platinum}
                </p>

                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12">
                  {/* Logo */}
                  <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-xl bg-white border-2 border-mansagold/30 flex items-center justify-center overflow-hidden p-3">
                    <img
                      src={getSponsorLogo(sponsor)}
                      alt={sponsor.company_name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight mb-4 leading-tight">
                      {sponsor.company_name}
                    </h3>
                    {sponsor.descriptor && (
                      <p className="text-white/80 text-sm md:text-base mb-6 leading-relaxed">
                        {sponsor.descriptor}
                      </p>
                    )}

                    {sponsor.website_url && (
                      <div className="inline-flex items-center gap-2 text-mansagold text-sm md:text-base font-medium tracking-wide border-b border-mansagold/40 pb-1 group-hover:border-mansagold transition-colors">
                        <span>Visit {getDomain(sponsor.website_url)}</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom hairline */}
              <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-mansagold/40 to-transparent" />
            </div>
          </div>
        ))}

        {/* Gold Partners — divider */}
        {otherSponsors.length > 0 && (
          <>
            <div className="flex items-center gap-6 mb-12 max-w-3xl mx-auto">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-mansagold/30" />
              <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase font-semibold">
                Gold Partners
              </p>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-mansagold/30" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {otherSponsors.map((sponsor) => {
                const label = tierLabels[sponsor.tier] || tierLabels.gold;
                return (
                  <div
                    key={sponsor.id}
                    onClick={() => handleSponsorClick(sponsor)}
                    className="relative bg-black border-2 border-mansagold/30 rounded-lg cursor-pointer group transition-colors duration-300 hover:border-mansagold/60"
                  >
                    <div className="p-8 flex flex-col items-center text-center">
                      {/* Tier label */}
                      <p className="text-[10px] text-mansagold tracking-[0.25em] uppercase font-semibold mb-6">
                        {label}
                      </p>

                      {/* Logo */}
                      <div className="w-32 h-32 rounded-lg bg-white border border-mansagold/20 flex items-center justify-center overflow-hidden mb-6 p-3">
                        <img
                          src={getSponsorLogo(sponsor)}
                          alt={sponsor.company_name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Name */}
                      <h4 className="font-playfair text-white text-lg md:text-xl font-semibold tracking-tight">
                        {sponsor.company_name}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="text-center mt-24 max-w-2xl mx-auto">
          <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase mb-4">
            By invitation and review
          </p>
          <h3 className="font-playfair text-2xl md:text-3xl font-semibold text-white mb-8 leading-snug">
            Position your brand at the center of a $1.8 trillion economy.
          </h3>
          <a
            href="/corporate-sponsorship"
            className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-mansagold/60 text-mansagold hover:border-mansagold hover:bg-mansagold/5 font-semibold text-sm md:text-base tracking-wide rounded-md transition-all duration-300"
          >
            Become a Corporate Partner
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Recognition Strip */}
        <div className="mt-24 pt-10 border-t border-mansagold/20">
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
            {[
              'U.S. Patent Pending 63/969,202',
              'Verified Corporation',
              'HBCU Partner Network',
              '33-Agent AI Workforce',
            ].map((item, i, arr) => (
              <span key={item} className="flex items-center gap-x-6">
                <span className="text-[11px] md:text-xs text-white/85 tracking-[0.2em] uppercase font-medium">
                  {item}
                </span>
                {i < arr.length - 1 && <span className="text-mansagold/60">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
