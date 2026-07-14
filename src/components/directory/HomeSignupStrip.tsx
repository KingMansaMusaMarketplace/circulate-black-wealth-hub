import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Globe } from 'lucide-react';

const DISMISS_KEY = 'home_signup_strip_dismissed_v1';

/**
 * Slim signup strip shown on the new homepage (Directory at /).
 * Preserves the signup CTA that lived on the old homepage.
 */
const HomeSignupStrip: React.FC = () => {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === '1');
  }, []);

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  return (
    <div className="relative z-20 border-b border-mansagold/30 bg-gradient-to-r from-mansablue/40 via-black/40 to-mansablue/40 backdrop-blur">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-white/90 min-w-0">
          <Globe className="w-4 h-4 text-mansagold flex-shrink-0" />
          <span className="truncate">
            <strong className="text-mansagold">1325.AI</strong> — The Global Black-Owned Business Directory
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/business-signup"
            className="text-xs md:text-sm px-3 py-1.5 rounded-md bg-mansagold text-black font-semibold hover:opacity-90 transition"
          >
            Add your business
          </Link>
          <Link
            to="/signup"
            className="text-xs md:text-sm px-3 py-1.5 rounded-md border border-white/30 text-white font-medium hover:bg-white/10 transition"
          >
            Sign up free
          </Link>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="p-1 rounded hover:bg-white/10 text-white/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeSignupStrip;
