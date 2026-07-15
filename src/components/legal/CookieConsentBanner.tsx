import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'cookie_consent';

/**
 * GDPR/CCPA compliant cookie consent banner.
 * Only shows on web (not native apps) and remembers the user's choice.
 */
const CookieConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show on native apps
    const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
    if (isNative) return;

    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on first load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // While the banner is visible, reserve space at the bottom of the page so it
  // never overlaps form actions (submit buttons, checkboxes, etc.). Reset on hide.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (visible) {
      const prev = document.body.style.paddingBottom;
      const isSmall = typeof window !== 'undefined' && window.innerWidth < 640;
      document.body.style.paddingBottom = isSmall ? '120px' : '180px';
      return () => { document.body.style.paddingBottom = prev; };
    }
  }, [visible]);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: false, date: new Date().toISOString() }));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-2 sm:p-4 md:p-6"
        >
          <div className="relative max-w-4xl mx-auto bg-card border border-border rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Cookie className="h-8 w-8 text-primary shrink-0 hidden sm:block" />

            <div className="flex-1 text-xs sm:text-sm text-muted-foreground pr-6 sm:pr-0">
              <p className="font-semibold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">We value your privacy</p>
              <p className="hidden sm:block">
                We use cookies to enhance your experience, analyze traffic, and personalize content.
                By clicking "Accept," you consent to our use of cookies. See our{' '}
                <Link to="/privacy" className="text-primary underline hover:text-primary/80">
                  Cookie Policy
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary underline hover:text-primary/80">
                  Privacy Policy
                </Link>.
              </p>
              <p className="sm:hidden">
                We use cookies to improve your experience.{' '}
                <Link to="/privacy" className="text-primary underline">Learn more</Link>.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="flex-1 sm:flex-none h-8 sm:h-9 text-xs sm:text-sm"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="flex-1 sm:flex-none h-8 sm:h-9 text-xs sm:text-sm"
              >
                Accept
              </Button>
            </div>

            <button
              onClick={handleDecline}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground sm:hidden"
              aria-label="Close cookie banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;
