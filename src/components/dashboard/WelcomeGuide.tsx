
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Star, Users, TrendingUp } from 'lucide-react';

interface WelcomeGuideProps {
  userType: 'customer' | 'business';
}

const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ userType }) => {
  const { user } = useAuth();

  const customerSteps = [
    {
      id: 1,
      title: "Discover Black-owned businesses",
      description: "Browse our directory to find amazing local businesses",
      icon: Users,
      completed: true
    },
    {
      id: 2,
      title: "Start scanning QR codes",
      description: "Earn loyalty points by scanning business QR codes",
      icon: Star,
      completed: false
    },
    {
      id: 3,
      title: "Watch your impact grow",
      description: "See how your spending supports the community",
      icon: TrendingUp,
      completed: false
    }
  ];

  const businessSteps = [
    {
      id: 1,
      title: "Complete your business profile",
      description: "Add photos, contact info, and business details",
      icon: Users,
      completed: false
    },
    {
      id: 2,
      title: "Generate QR codes",
      description: "Create QR codes to reward customer visits",
      icon: Star,
      completed: false
    },
    {
      id: 3,
      title: "Track your analytics",
      description: "Monitor customer engagement and loyalty",
      icon: TrendingUp,
      completed: false
    }
  ];

  const steps = userType === 'customer' ? customerSteps : businessSteps;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Welcome back, {user?.user_metadata?.fullName || user?.email}!
        </CardTitle>
        <CardDescription>
          {userType === 'customer' 
            ? "Continue building wealth in the Black community" 
            : "Grow your business and connect with customers"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.completed ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{step.title}</h3>
                    {step.completed && <Badge variant="secondary" className="text-xs">Done</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t">
            <Button className="w-full">
              {userType === 'customer' ? 'Explore Directory' : 'Complete Profile'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeGuide;
