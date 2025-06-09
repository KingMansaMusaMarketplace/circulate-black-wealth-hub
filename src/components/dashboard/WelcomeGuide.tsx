
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WelcomeGuideProps {
  userType: 'customer' | 'business';
}

const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ userType }) => {
  const customerSteps = [
    { id: 1, title: 'Complete your profile', completed: true, link: '/profile' },
    { id: 2, title: 'Find nearby businesses', completed: false, link: '/directory' },
    { id: 3, title: 'Scan your first QR code', completed: false, link: '/scanner' },
    { id: 4, title: 'Earn loyalty points', completed: false, link: '/loyalty' }
  ];

  const businessSteps = [
    { id: 1, title: 'Complete business profile', completed: true, link: '/business/profile' },
    { id: 2, title: 'Create your first QR code', completed: false, link: '/business/qr-codes' },
    { id: 3, title: 'Set up loyalty program', completed: false, link: '/business/profile?tab=loyalty' },
    { id: 4, title: 'View analytics', completed: false, link: '/business/profile?tab=analytics' }
  ];

  const steps = userType === 'business' ? businessSteps : customerSteps;
  const completedSteps = steps.filter(step => step.completed).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Getting Started Guide</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-mansablue h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSteps / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{completedSteps}/{steps.length}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
                <span className={step.completed ? 'text-gray-600 line-through' : 'font-medium'}>
                  {step.title}
                </span>
              </div>
              {!step.completed && (
                <Link to={step.link}>
                  <Button size="sm" variant="ghost">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeGuide;
