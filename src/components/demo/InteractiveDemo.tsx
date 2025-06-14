
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  QrCode, 
  MapPin, 
  Star, 
  Gift,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';

const InteractiveDemo = () => {
  const [activeDemo, setActiveDemo] = useState(0);

  const demoSteps = [
    {
      id: 'scan',
      title: 'Scan QR Code',
      description: 'Simply scan the QR code at checkout to earn points and get instant discounts',
      image: '/lovable-uploads/463fe82d-8622-41a8-8286-28b3ef9532a4.png',
      features: ['Instant 15% discount', '25 loyalty points earned', 'Automatic tracking']
    },
    {
      id: 'discover',
      title: 'Discover Businesses',
      description: 'Browse our directory of Black-owned businesses near you',
      image: '/lovable-uploads/b85e3c26-f651-49bd-9e25-c036ba533bd3.png',
      features: ['Filter by category', 'Search by distance', 'View ratings & reviews']
    },
    {
      id: 'profile',
      title: 'Business Profiles',
      description: 'Detailed business information with photos, reviews, and special offers',
      image: '/lovable-uploads/30f608bd-596a-4257-8272-19ad1bd552f7.png',
      features: ['High-quality photos', 'Customer reviews', 'Exclusive discounts']
    },
    {
      id: 'rewards',
      title: 'Redeem Rewards',
      description: 'Use your earned points for discounts and special offers',
      image: '/lovable-uploads/4a17f10b-e405-454e-bb76-c891478f42f6.png',
      features: ['Track your points', 'Redeem rewards', 'Special member offers']
    }
  ];

  const nextDemo = () => {
    setActiveDemo((prev) => (prev + 1) % demoSteps.length);
  };

  const prevDemo = () => {
    setActiveDemo((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            See How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the Mansa Musa Marketplace through our interactive demo
          </p>
        </div>

        {/* Demo Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm border">
            {demoSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveDemo(index)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeDemo === index
                    ? 'bg-mansablue text-white shadow-sm'
                    : 'text-gray-600 hover:text-mansablue'
                }`}
              >
                {step.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Demo Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-6">
              <Badge className="mb-4 bg-mansagold text-mansablue">
                Step {activeDemo + 1} of {demoSteps.length}
              </Badge>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {demoSteps[activeDemo].title}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {demoSteps[activeDemo].description}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-8">
              {demoSteps[activeDemo].features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-6 h-6 bg-mansablue rounded-full flex items-center justify-center mr-3">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <Button
                onClick={prevDemo}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex space-x-2">
                {demoSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeDemo === index ? 'bg-mansablue' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextDemo}
                className="flex items-center gap-2 bg-mansablue hover:bg-mansablue-dark"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Demo Visual */}
          <div className="order-1 lg:order-2">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
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
                        <img
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
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-mansablue hover:bg-mansablue-dark text-white px-8 py-4"
          >
            <Play className="w-5 h-5 mr-2" />
            Try It Now - Sign Up Free
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
