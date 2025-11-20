
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import OptimizedImage from '@/components/ui/optimized-image';
import { 
  Smartphone, 
  QrCode, 
  MapPin, 
  Star, 
  Gift
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

interface PhoneMockupProps {
  demoSteps: DemoStep[];
  activeDemo: number;
}

const PhoneMockup = ({ demoSteps, activeDemo }: PhoneMockupProps) => {
  return (
    <div className="order-1 lg:order-2">
      <Card className="border border-white/20 shadow-2xl backdrop-blur-xl bg-white/10">
        <CardContent className="p-8">
          <div className="relative">
            {/* Mock Phone Frame */}
            <div className="mx-auto w-80 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                {/* Status Bar */}
                <div className="h-6 bg-gray-100 flex items-center justify-between px-4 text-xs">
                  <span>9:41</span>
                  <div className="flex space-x-1">
                    <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
                    <div className="w-6 h-2 bg-green-500 rounded-sm"></div>
                  </div>
                </div>
                
                {/* App Content */}
                <div className="p-4 h-full">
                  <OptimizedImage
                    src={demoSteps[activeDemo].image}
                    alt={demoSteps[activeDemo].title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  
                  {/* Demo-specific UI elements */}
                  {activeDemo === 0 && (
                    <div className="text-center">
                      <QrCode className="w-16 h-16 mx-auto mb-2 text-mansablue" />
                      <p className="text-sm text-gray-600">Scanning QR Code...</p>
                      <Badge className="mt-2 bg-green-100 text-green-800">
                        15% Discount Applied!
                      </Badge>
                    </div>
                  )}
                  
                  {activeDemo === 1 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Nearby Businesses</span>
                        <MapPin className="w-4 h-4 text-mansablue" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Soul Food Kitchen</span>
                          <span className="text-mansablue">0.3 mi</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Beauty Supply Plus</span>
                          <span className="text-mansablue">0.7 mi</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeDemo === 2 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Harmony Soul Food</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">4.8 (124 reviews)</span>
                      </div>
                      <Badge className="bg-mansagold text-mansablue text-xs">
                        10% Off Today
                      </Badge>
                    </div>
                  )}
                  
                  {activeDemo === 3 && (
                    <div className="text-center">
                      <Gift className="w-12 h-12 mx-auto mb-2 text-mansagold" />
                      <p className="text-sm font-medium">Your Points: 250</p>
                      <Button size="sm" className="mt-2 bg-mansablue text-xs">
                        Redeem Reward
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-mansagold text-mansablue p-2 rounded-full shadow-lg">
              <Smartphone className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneMockup;
