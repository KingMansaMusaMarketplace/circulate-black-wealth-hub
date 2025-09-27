import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Building, 
  QrCode, 
  Gift, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Star,
  Phone
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: {
    title: string;
    description: string;
    features: string[];
    tips?: string[];
  };
}

const customerSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to the Movement',
    description: 'Join the community supporting Black-owned businesses',
    icon: Users,
    content: {
      title: 'Welcome to Mansa Musa Marketplace!',
      description: 'You\'re now part of a movement to circulate wealth within the Black community. Every purchase you make helps strengthen our economic ecosystem.',
      features: [
        'Discover thousands of Black-owned businesses nationwide',
        'Earn loyalty points and rewards for your support',
        'Track your community impact and economic contribution',
        'Connect with like-minded supporters and business owners'
      ],
      tips: [
        'Start by exploring businesses in your area',
        'Follow your favorite businesses for updates',
        'Share businesses with friends to expand the community'
      ]
    }
  },
  {
    id: 'discover',
    title: 'Discover Businesses',
    description: 'Find Black-owned businesses near you',
    icon: Building,
    content: {
      title: 'Explore the Business Directory',
      description: 'Our comprehensive directory features verified Black-owned businesses across all categories and locations.',
      features: [
        'Search by location, category, or business name',
        'View detailed business profiles with photos and reviews',
        'Get directions and contact information',
        'See business hours and special offers'
      ],
      tips: [
        'Use filters to find exactly what you\'re looking for',
        'Read reviews from other community members',
        'Call ahead to confirm hours and availability'
      ]
    }
  },
  {
    id: 'qr-codes',
    title: 'QR Code System',
    description: 'Scan QR codes to support businesses and earn rewards',
    icon: QrCode,
    content: {
      title: 'Scan & Support with QR Codes',
      description: 'Our unique QR code system makes it easy to support businesses and track your impact in real-time.',
      features: [
        'Scan QR codes at participating businesses',
        'Earn loyalty points with every scan',
        'Get exclusive discounts and offers',
        'Track your visits and spending automatically'
      ],
      tips: [
        'Look for QR codes at checkout counters',
        'Scan codes even for small purchases',
        'Ask businesses if they have QR codes available'
      ]
    }
  },
  {
    id: 'rewards',
    title: 'Earn Rewards',
    description: 'Get rewarded for supporting Black-owned businesses',
    icon: Gift,
    content: {
      title: 'Loyalty Points & Rewards',
      description: 'The more you support Black-owned businesses, the more rewards you earn. It\'s our way of saying thank you!',
      features: [
        'Earn points for QR code scans and purchases',
        'Redeem points for discounts and special offers',
        'Get exclusive access to member-only deals',
        'Unlock premium rewards as you reach higher tiers'
      ],
      tips: [
        'Check your points balance regularly',
        'Look for bonus point opportunities',
        'Redeem rewards before they expire'
      ]
    }
  }
];

const businessSteps: OnboardingStep[] = [
  {
    id: 'business-welcome',
    title: 'Welcome Business Owner',
    description: 'Join thousands of Black-owned businesses',
    icon: Building,
    content: {
      title: 'Welcome to Your Business Growth Platform!',
      description: 'You\'re joining a powerful network of Black-owned businesses and supportive customers. Let\'s help you grow your business and strengthen our community.',
      features: [
        'Create a compelling business profile with photos',
        'Generate QR codes to track customer engagement',
        'Access detailed analytics and insights',
        'Connect with a community of loyal customers'
      ],
      tips: [
        'Complete your profile with high-quality photos',
        'Add detailed business information and hours',
        'Respond to customer reviews promptly'
      ]
    }
  },
  {
    id: 'profile-setup',
    title: 'Complete Your Profile',
    description: 'Create an attractive business listing',
    icon: Star,
    content: {
      title: 'Stand Out with a Great Profile',
      description: 'Your business profile is your digital storefront. Make it compelling to attract more customers.',
      features: [
        'Upload high-quality photos of your business',
        'Write compelling descriptions of your products/services',
        'Add your location, hours, and contact information',
        'Showcase customer testimonials and reviews'
      ],
      tips: [
        'Use professional photos that show your products clearly',
        'Keep your business hours updated',
        'Highlight what makes your business unique'
      ]
    }
  },
  {
    id: 'qr-generation',
    title: 'Generate QR Codes',
    description: 'Create QR codes for customer engagement',
    icon: QrCode,
    content: {
      title: 'Engage Customers with QR Codes',
      description: 'QR codes help you track customer visits, build loyalty, and offer rewards that keep customers coming back.',
      features: [
        'Generate unlimited QR codes for your business',
        'Track scans and customer engagement in real-time',
        'Offer points and rewards to repeat customers',
        'Display QR codes at checkout or on receipts'
      ],
      tips: [
        'Place QR codes where customers can easily see them',
        'Train staff to encourage QR code scanning',
        'Offer incentives for first-time scanners'
      ]
    }
  },
  {
    id: 'analytics',
    title: 'Track Your Growth',
    description: 'Monitor your business performance',
    icon: TrendingUp,
    content: {
      title: 'Data-Driven Business Growth',
      description: 'Use our analytics dashboard to understand your customers better and make informed business decisions.',
      features: [
        'View detailed customer engagement metrics',
        'Track QR code scan patterns and trends',
        'Monitor your business growth over time',
        'See your impact on the community economy'
      ],
      tips: [
        'Check your analytics weekly to spot trends',
        'Use customer data to improve your offerings',
        'Set goals and track your progress'
      ]
    }
  }
];

interface WelcomeFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeFlow: React.FC<WelcomeFlowProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  
  const userType = user?.user_metadata?.user_type || 'customer';
  const steps = userType === 'business' ? businessSteps : customerSteps;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete and close
      localStorage.setItem('onboarding_completed', 'true');
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Progress Header */}
          <div className="bg-gradient-to-r from-mansablue to-mansagold p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentStepData.title}</h2>
                  <p className="text-blue-100">{currentStepData.description}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {currentStep + 1} of {steps.length}
              </Badge>
            </div>
            <Progress value={progress} className="bg-white/20" />
          </div>

          {/* Content */}
          <div className="p-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-mansablue">
                  {currentStepData.content.title}
                </CardTitle>
                <CardDescription className="text-lg">
                  {currentStepData.content.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentStepData.content.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                {currentStepData.content.tips && (
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Pro Tips:
                    </h3>
                    <ul className="space-y-1">
                      {currentStepData.content.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-yellow-700">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA for final step */}
                {currentStep === steps.length - 1 && (
                  <div className="bg-gradient-to-r from-mansablue/10 to-mansagold/10 p-6 rounded-lg text-center">
                    <h3 className="font-semibold text-mansablue mb-2">Ready to get started?</h3>
                    <p className="text-gray-600 mb-4">
                      {userType === 'business' 
                        ? 'Complete your business profile and start connecting with customers!'
                        : 'Start exploring Black-owned businesses and making an impact!'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="border-t bg-gray-50 px-8 py-4 flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-gray-500"
              >
                Skip Tutorial
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              
              <Button onClick={handleNext} className="bg-mansablue hover:bg-mansablue/90">
                {currentStep === steps.length - 1 ? (
                  'Get Started!'
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeFlow;