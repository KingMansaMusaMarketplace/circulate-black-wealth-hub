import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, ArrowRight } from 'lucide-react';

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
      className="block w-full bg-black border-b border-mansagold/40 text-mansagold hover:bg-mansagold/10 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm text-center">
        <Gift className="w-4 h-4 shrink-0" />
        <span>
          <strong>Holiday Special (Oct 1 – Dec 31):</strong> 1325.AI Pro is{' '}
          <strong>$149/mo</strong> (regularly <span className="line-through">$299</span>) locked in forever.
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 font-bold underline">
          Claim Your Spot <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
};

export default HolidayAnnouncementBar;
