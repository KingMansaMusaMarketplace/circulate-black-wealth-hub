
import React from 'react';
import { Building, Crown, Rocket } from 'lucide-react';

interface SubscriptionPageHeaderProps {
  userType: 'customer' | 'business';
  isTrialMode: boolean;
}

const SubscriptionPageHeader: React.FC<SubscriptionPageHeaderProps> = ({ 
  userType, 
  isTrialMode 
}) => {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        {userType === 'business' ? (
          <Building className="h-16 w-16 text-mansablue" />
        ) : (
          <Crown className="h-16 w-16 text-mansagold" />
        )}
      </div>
      
      <h1 className="text-4xl font-bold text-mansablue">
        {userType === 'business' 
          ? 'Choose Your Business Plan' 
          : 'Choose Your Impact Level'
        }
      </h1>
      
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        {userType === 'business' 
          ? 'Grow your business and connect with customers in the Black community. All business plans include a 30-day free trial.'
          : 'Join thousands of community members circulating Black wealth. Every subscription helps strengthen our economic ecosystem.'
        }
      </p>

      {isTrialMode && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <Rocket className="h-5 w-5" />
            <span className="font-medium">
              Welcome! Complete your free trial setup by selecting your plan below.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPageHeader;
