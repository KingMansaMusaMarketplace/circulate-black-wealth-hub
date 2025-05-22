
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Gift, QrCode, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface GuideStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function LoyaltyGuide() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const guideSteps: GuideStep[] = [
    {
      title: "Earn Points",
      description: "Scan QR codes at participating businesses to earn loyalty points. Every scan adds points to your account.",
      icon: <QrCode className="h-10 w-10 text-mansablue" />
    },
    {
      title: "Track Progress",
      description: "Watch your points accumulate on your dashboard. The more points you collect, the higher your status level.",
      icon: <Award className="h-10 w-10 text-mansagold" />
    },
    {
      title: "Redeem Rewards",
      description: "Use your points to claim exciting rewards from local businesses and exclusive discounts.",
      icon: <Gift className="h-10 w-10 text-green-600" />
    }
  ];

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
    }
  };

  // If guide is closed, don't render anything
  if (!isOpen) return null;

  return (
    <Card className="mb-6 border-2 border-mansablue/20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-mansablue">Loyalty Rewards Guide</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={handleClose}
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center md:text-left"
          >
            <div className="flex justify-center md:justify-start mb-2">
              {guideSteps[currentStep].icon}
            </div>
            <h4 className="text-lg font-semibold mb-1">
              Step {currentStep + 1}: {guideSteps[currentStep].title}
            </h4>
            <p className="text-gray-600 mb-4">
              {guideSteps[currentStep].description}
            </p>
          </motion.div>
          
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex space-x-1">
              {guideSteps.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-2 w-2 rounded-full ${index === currentStep ? 'bg-mansablue' : 'bg-gray-300'}`} 
                />
              ))}
            </div>
            <Button 
              onClick={handleNext} 
              className="ml-4"
            >
              {currentStep < guideSteps.length - 1 ? (
                <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
              ) : (
                'Get Started'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoyaltyGuide;
