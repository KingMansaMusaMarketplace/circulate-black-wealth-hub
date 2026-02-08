import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import logo1325 from '@/assets/1325-ai-logo.png';
import mansaMusaLogo from '@/assets/mansa-musa-logo.png';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

/**
 * Detects if running as iOS native app (Capacitor)
 * Used to show Mansa Musa branding for App Store submission
 */
const useIsIOSApp = () => {
  return useMemo(() => {
    try {
      return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
    } catch {
      return false;
    }
  }, []);
};

const Logo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isIOSApp = useIsIOSApp();

  // Use Mansa Musa branding for iOS App Store, 1325.AI for web
  const logoSrc = isIOSApp ? mansaMusaLogo : logo1325;
  const brandName = isIOSApp ? 'Mansa Musa' : '1325.AI';
  const tagline = isIOSApp 
    ? 'The Premier Black Business Marketplace' 
    : 'Building the Future of Digital Commerce | AI';

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Clickable logo that opens modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button 
            className="group focus:outline-none flex-shrink-0"
            aria-label="View full logo"
          >
            <img 
              src={logoSrc} 
              alt={brandName} 
              className="h-10 sm:h-14 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.6)] cursor-pointer"
            />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-slate-900/95 border-mansagold/30 backdrop-blur-xl p-8">
          <div className="flex flex-col items-center gap-6">
            <img 
              src={logoSrc} 
              alt={`${brandName} - ${tagline}`} 
              className="w-full max-w-md object-contain animate-scale-in"
            />
            <p className="text-mansagold font-mono text-lg tracking-wider text-center">
              {tagline}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Home link - hidden on very small screens */}
      <Link 
        to="/" 
        className="hidden xs:block text-base sm:text-xl font-mono font-bold tracking-wider text-mansagold transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] truncate max-w-[100px] sm:max-w-none"
      >
        {brandName}
      </Link>
    </div>
  );
};

export default Logo;
