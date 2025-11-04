import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCapacitor } from '@/hooks/use-capacitor';

export const NativeFeaturesPromo = () => {
  const { isNative } = useCapacitor();

  return (
    <div className="bg-gradient-to-r from-primary to-primary-glow py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-4 text-white">
            <div className="flex-shrink-0">
              <div className="bg-white/20 rounded-full p-4">
                <Smartphone className="w-8 h-8" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                <Zap className="w-5 h-5" />
                Native Mobile Features
              </h3>
              <p className="text-white/90 text-sm">
                {isNative 
                  ? "Experience our powerful native features: haptic feedback, background location, push notifications, and offline support!"
                  : "See how our native mobile app provides features that go beyond web browsing"
                }
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <Link to="/native-features-demo">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
                >
                  Try Features →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
