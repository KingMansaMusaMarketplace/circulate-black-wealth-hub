import React, { useState, useEffect } from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWA_DISMISS_KEY = '1325_pwa_prompt_dismissed';
const PWA_DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // Check if dismissed recently
    const dismissedAt = localStorage.getItem(PWA_DISMISS_KEY);
    if (dismissedAt && Date.now() - parseInt(dismissedAt) < PWA_DISMISS_DURATION) return;

    // Detect iOS
    const ua = navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isiOS);

    if (isiOS) {
      // Show banner after a delay on iOS
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    // Android / Desktop: listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem(PWA_DISMISS_KEY, Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500 md:left-auto md:right-4 md:max-w-sm">
      <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/40">
        <div className="flex items-start gap-3">
          {/* App icon */}
          <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-mansagold to-amber-500 flex items-center justify-center shadow-lg shadow-mansagold/30">
            <span className="text-slate-900 font-black text-sm">1325</span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm">Install 1325.AI</h3>
            <p className="text-blue-200/70 text-xs mt-0.5">
              {isIOS
                ? 'Tap Share → "Add to Home Screen"'
                : 'Get the full app experience on your device'}
            </p>

            {!isIOS && deferredPrompt && (
              <Button
                size="sm"
                onClick={handleInstall}
                className="mt-2 bg-mansagold hover:bg-mansagold-dark text-slate-900 font-semibold text-xs h-8 px-4"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Install Now
              </Button>
            )}

            {isIOS && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-mansagold">
                <Share2 className="h-3.5 w-3.5" />
                <span>Tap the share button below</span>
              </div>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="shrink-0 text-white/40 hover:text-white/70 transition-colors p-1"
            aria-label="Dismiss install prompt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
