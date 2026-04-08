import { useCachedSponsors } from '@/hooks/useCachedSponsors';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Crown, Award, Diamond, ArrowRight } from 'lucide-react';
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

const tierConfig: Record<string, { gradient: string; glow: string; label: string; borderColor: string; accentColor: string }> = {
  platinum: {
    gradient: 'from-[#c9b8ff] via-[#a78bfa] to-[#7c3aed]',
    glow: 'shadow-[0_0_60px_rgba(139,92,246,0.3),0_0_120px_rgba(139,92,246,0.1)]',
    label: 'PLATINUM FOUNDING SPONSOR',
    borderColor: 'border-violet-500/30',
    accentColor: 'text-violet-300',
  },
  gold: {
    gradient: 'from-mansagold via-amber-400 to-mansagold',
    glow: 'shadow-[0_0_30px_rgba(217,169,56,0.2)]',
    label: 'GOLD PARTNER',
    borderColor: 'border-mansagold/30',
    accentColor: 'text-mansagold',
  },
  silver: {
    gradient: 'from-slate-300 via-gray-200 to-slate-400',
    glow: 'shadow-[0_0_20px_rgba(148,163,184,0.15)]',
    label: 'SILVER PARTNER',
    borderColor: 'border-slate-400/30',
    accentColor: 'text-slate-300',
  },
  bronze: {
    gradient: 'from-orange-500 via-amber-600 to-orange-600',
    glow: 'shadow-[0_0_20px_rgba(194,120,50,0.15)]',
    label: 'BRONZE PARTNER',
    borderColor: 'border-orange-500/30',
    accentColor: 'text-orange-300',
  },
};

export const PublicSponsorDisplay = () => {
  const { data: sponsors, isLoading } = useCachedSponsors();

  // Override: Miguel Wilson Collection as the Platinum Founding Sponsor
  const miguelWilsonSponsor: Sponsor = {
    id: 'miguel-wilson-collection',
    tier: 'platinum',
    company_name: 'Miguel Wilson Collection',
    logo_url: 'https://www.miguelwilson.com/wp-content/uploads/2022/02/miguelnew.jpg',
    website_url: 'https://miguelwilson.com',
    status: 'active',
  };

  // Replace any DB platinum sponsors with Miguel Wilson, keep other tiers from DB
  const otherTierSponsors = sponsors ? sponsors.filter(s => s.tier !== 'platinum') : [];
  const displaySponsors: Sponsor[] = [miguelWilsonSponsor, ...otherTierSponsors];

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

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#050a18] to-[#000000]" />
      
      {/* Subtle radial glow behind platinum */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-violet-600/[0.04] rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10 max-w-[1600px]">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-6">
            <Diamond className="h-4 w-4 text-mansagold" />
            <span className="text-mansagold/90 text-xs font-semibold tracking-[0.25em] uppercase">
              Corporate Partners
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Powering Economic
            <span className="block bg-gradient-to-r from-mansagold via-amber-400 to-mansagold bg-clip-text text-transparent">
              Infrastructure
            </span>
          </h2>
          <p className="text-white/40 text-base max-w-lg mx-auto leading-relaxed">
            Organizations investing in the future of community wealth circulation
          </p>
        </div>

        {/* Platinum Sponsor — Premium Hero Card */}
        {platinumSponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            onClick={() => handleSponsorClick(sponsor)}
            className="relative mb-16 cursor-pointer group"
          >
            {/* Outer glow ring */}
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-violet-500/40 via-purple-400/20 to-violet-500/40 opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            
            {/* Card */}
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/95 via-[#0f0a1e]/95 to-slate-900/95 backdrop-blur-xl border border-violet-500/20 group-hover:border-violet-400/40 transition-all duration-500 overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
              
              {/* Inner glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-violet-500/[0.06] rounded-full blur-[80px]" />
              
              <div className="relative px-8 md:px-16 py-12 md:py-16">
                {/* Badge row */}
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                      <Crown className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-violet-300/80">
                      Platinum Founding Sponsor
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/[0.06]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-medium tracking-wider uppercase text-emerald-300/80">Active Partner</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  {/* Logo */}
                  <div className="relative flex-shrink-0">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] flex items-center justify-center overflow-hidden group-hover:border-violet-400/30 transition-colors duration-500">
                      <img
                        src={getSponsorLogo(sponsor)}
                        alt={sponsor.company_name}
                        className="max-h-24 md:max-h-28 max-w-24 md:max-w-28 object-contain"
                      />
                    </div>
                    {/* Corner accent */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-violet-400/40 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-violet-400/40 rounded-bl-lg" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 group-hover:text-violet-50 transition-colors">
                      {sponsor.company_name}
                    </h3>
                    <p className="text-white/40 text-sm md:text-base mb-6 max-w-lg">
                      Luxury menswear — Phipps Plaza, Atlanta
                    </p>
                    
                    {sponsor.website_url && (
                      <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20 group-hover:border-violet-400/40 group-hover:from-violet-600/30 group-hover:to-purple-600/30 transition-all duration-300">
                        <ExternalLink className="h-4 w-4 text-violet-300" />
                        <span className="text-sm font-semibold text-violet-200 group-hover:text-white transition-colors">
                          Visit miguelwilson.com
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-violet-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            </div>
          </div>
        ))}

        {/* Divider with label */}
        {otherSponsors.length > 0 && (
          <>
            <div className="flex items-center gap-4 mb-10 max-w-3xl mx-auto">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-mansagold/20" />
              <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-mansagold/20 bg-mansagold/[0.06]">
                <Award className="h-4 w-4 text-mansagold" />
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-mansagold">
                  Gold Partners
                </span>
              </div>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-mansagold/20" />
            </div>

            {/* Gold / Other Sponsors — Clean Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-4xl mx-auto">
              {otherSponsors.map((sponsor) => {
                const config = tierConfig[sponsor.tier] || tierConfig.gold;
                return (
                  <div
                    key={sponsor.id}
                    onClick={() => handleSponsorClick(sponsor)}
                    className="relative rounded-2xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 bg-white/[0.04] border border-mansagold/15 hover:border-mansagold/40 hover:bg-white/[0.07] shadow-lg shadow-black/20 hover:shadow-mansagold/10"
                  >
                    {/* Top gold accent */}
                    <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-mansagold/40 to-transparent rounded-full" />
                    
                    <div className="p-7 flex flex-col items-center text-center">
                      {/* Tier badge */}
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-2 h-2 rounded-full bg-mansagold shadow-sm shadow-mansagold/50" />
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-mansagold">
                          {config.label}
                        </span>
                      </div>

                      {/* Logo */}
                      <div className="w-20 h-20 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center overflow-hidden mb-5 group-hover:border-mansagold/30 transition-colors">
                        <img
                          src={getSponsorLogo(sponsor)}
                          alt={sponsor.company_name}
                          className="max-h-14 max-w-14 object-contain"
                        />
                      </div>

                      {/* Name */}
                      <h4 className="text-white font-bold text-base group-hover:text-mansagold transition-colors">
                        {sponsor.company_name}
                      </h4>

                      {/* Website link */}
                      {sponsor.website_url && (
                        <div className="mt-3 flex items-center gap-1.5 text-mansagold/70 group-hover:text-mansagold transition-colors">
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Visit Website</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="text-center mt-20 md:mt-24">
          <p className="text-white/30 text-sm uppercase tracking-[0.2em] mb-4">
            Join Our Partner Network
          </p>
          <a
            href="/sponsor-pricing"
            className="inline-flex items-center gap-3 px-10 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-mansagold to-amber-500 text-black hover:from-amber-400 hover:to-mansagold transition-all duration-300 shadow-lg shadow-mansagold/20 hover:shadow-xl hover:shadow-mansagold/30 hover:scale-[1.02]"
          >
            Become a Corporate Sponsor
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
