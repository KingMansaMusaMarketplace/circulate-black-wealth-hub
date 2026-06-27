import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'rebrand_banner_dismissed_v1';

/**
 * Subtle one-line banner so returning visitors searching for
 * "Mansa Musa Marketplace" know they're in the right place.
 * Dismissible — choice persists in localStorage.
 */
const RebrandBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
    setVisible(false);
  };

  return (
    <div className="relative z-20 bg-black border-b border-mansagold/40">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-3 text-center">
        <p className="text-xs sm:text-sm text-mansagold font-medium">
          Formerly <span className="font-semibold">Mansa Musa Marketplace</span> — now <span className="font-bold">1325.AI</span>. Same mission, smarter platform.
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss rebrand notice"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-mansagold/70 hover:text-mansagold transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default RebrandBanner;
