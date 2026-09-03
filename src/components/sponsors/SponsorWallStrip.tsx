import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCachedSponsors } from '@/hooks/useCachedSponsors';
import { MAX_OPEN_TILES_IN_STRIP } from '@/config/sponsorSlots';
import { cn } from '@/lib/utils';

interface SponsorWallStripProps {
  /** How many live sponsor logos to show before open slots. */
  maxLogos?: number;
  /** How many "your brand here" tiles to show. */
  openSlots?: number;
  className?: string;
  heading?: string;
}

/**
 * A slim public band that shows current corporate partners AND the
 * still-available partner slots, so visitors can see the space is for sale.
 */
export const SponsorWallStrip: React.FC<SponsorWallStripProps> = ({
  maxLogos = 5,
  openSlots = 2,
  className,
  heading = 'Presented in partnership with',
}) => {
  const { data: sponsors, isLoading } = useCachedSponsors();

  const liveSponsors = (sponsors || [])
    .filter((s) => s.logo_url)
    .slice(0, maxLogos);

  const tiles = Math.max(
    0,
    Math.min(openSlots, MAX_OPEN_TILES_IN_STRIP, maxLogos - liveSponsors.length + openSlots),
  );

  if (isLoading) return null;

  return (
    <section
      aria-label="Corporate partners"
      className={cn(
        'w-full border-y border-mansagold/20 bg-black/60 backdrop-blur-sm py-6',
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <p className="text-[10px] text-mansagold tracking-[0.3em] uppercase text-center mb-5">
          {heading}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {liveSponsors.map((sponsor) => {
            const logo = (
              <img
                src={sponsor.logo_url as string}
                alt={`${sponsor.company_name} — corporate partner of 1325.AI`}
                loading="lazy"
                className="max-h-10 md:max-h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            );
            return sponsor.website_url ? (
              <a
                key={sponsor.id}
                href={sponsor.website_url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="px-3"
              >
                {logo}
              </a>
            ) : (
              <div key={sponsor.id} className="px-3">
                {logo}
              </div>
            );
          })}

          {Array.from({ length: tiles }).map((_, i) => (
            <Link
              key={`open-${i}`}
              to="/sponsors"
              className="group flex items-center gap-2 rounded-lg border border-dashed border-mansagold/40 px-4 py-3 hover:border-mansagold hover:bg-mansagold/5 transition-colors"
            >
              <span className="text-white/80 text-xs md:text-sm">
                Your brand here — <span className="text-mansagold">Corporate Partnership</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-mansagold group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorWallStrip;
