import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCapacitor } from '@/hooks/use-capacitor';

export const NativeFeaturesPromo = () => {
  const { isNative } = useCapacitor();
  const [isDismissed, setDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-6 px-4 z-40 shadow-lg border-b border-mansagold/20 relative">
      {/* Close Button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white/80 hover:text-white transition-all z-50"
        aria-label="Close banner"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="container mx-auto max-w-4xl">
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-5 border border-mansagold/30 shadow-2xl animate-in fade-in slide-in-from-top duration-500">
          <div className="flex flex-col md:flex-row items-center gap-4 text-white">
            <div className="flex-shrink-0">
              <div className="bg-mansagold/20 rounded-full p-3 animate-pulse">
                <Smartphone className="w-7 h-7 text-mansagold" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold mb-1 flex items-center justify-center md:justify-start gap-2">
                <Zap className="w-4 h-4 text-mansagold animate-pulse" />
                <span className="text-white">🚀 Native Mobile Features</span>
              </h3>
              <p className="text-white/80 text-sm font-medium">
                {isNative 
                  ? "✨ Haptic feedback • 📍 Background location • 🔔 Push notifications • 📱 Native share"
                  : "Experience features beyond web browsers: haptics, background tracking, and more"
                }
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <Link to="/native-features-showcase">
                <Button 
                  variant="secondary" 
                  size="default"
                  className="bg-mansagold text-slate-900 hover:bg-mansagold/90 font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Test Features →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
