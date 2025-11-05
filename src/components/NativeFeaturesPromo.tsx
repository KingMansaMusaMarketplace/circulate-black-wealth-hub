import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCapacitor } from '@/hooks/use-capacitor';

export const NativeFeaturesPromo = () => {
  const { isNative } = useCapacitor();

  return (
    <div className="bg-gradient-to-r from-primary to-primary-glow py-8 px-4 sticky top-0 z-40 shadow-lg">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 border-white/30 shadow-2xl animate-in fade-in slide-in-from-top duration-500">
          <div className="flex flex-col md:flex-row items-center gap-4 text-white">
            <div className="flex-shrink-0">
              <div className="bg-white/20 rounded-full p-4 animate-pulse">
                <Smartphone className="w-8 h-8" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                <Zap className="w-5 h-5 animate-pulse" />
                🚀 Native Mobile Features - Way Beyond Web!
              </h3>
              <p className="text-white/90 text-sm font-medium">
                {isNative 
                  ? "✨ Haptic feedback • 📍 Background location • 🔔 Push notifications • 📱 Native share • 🌐 Offline support"
                  : "Experience features impossible in web browsers: haptics, background tracking, and more"
                }
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <Link to="/native-features-showcase">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Test All Features →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
