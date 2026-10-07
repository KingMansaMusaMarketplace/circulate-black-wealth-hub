import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, ArrowRight, Sparkles } from 'lucide-react';

/** Shows Oct 1 – Dec 31 (inclusive) of the current year. */
export const isHolidaySpecialActive = (d: Date = new Date()) => {
  const m = d.getMonth();
  return m >= 9 && m <= 11;
};

const HolidayAnnouncementBar: React.FC = () => {
  if (!isHolidaySpecialActive()) return null;
  return (
    <Link
      to="/holiday-special"
      className="group block w-full bg-gradient-to-r from-orange-500 via-mansagold to-orange-500 text-black shadow-lg hover:brightness-110 transition"
    >
      <div className="max-w-6xl mx-auto px-4 py-3.5 md:py-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm md:text-lg text-center font-medium">
        <Gift className="w-5 h-5 md:w-6 md:h-6 shrink-0 animate-bounce" />
        <span>
          <strong className="uppercase tracking-wide">Holiday Special</strong>{' '}
          <span className="opacity-80">(Oct 1 – Dec 31):</span> 1325.AI Pro is{' '}
          <strong className="text-lg md:text-2xl">$149/mo</strong>{' '}
          <span className="opacity-80">(regularly <span className="line-through">$299</span>)</span> locked in forever.
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black text-mansagold px-4 py-1.5 text-xs md:text-sm font-bold uppercase tracking-wider group-hover:scale-105 transition-transform">
          <Sparkles className="w-4 h-4" /> Claim Your Spot <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
};

export default HolidayAnnouncementBar;
