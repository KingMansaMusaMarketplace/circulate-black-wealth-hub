
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
          <Building className="h-16 w-16 text-mansagold" />
        ) : (
          <Crown className="h-16 w-16 text-mansagold" />
        )}
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-white">
        {userType === 'business' 
          ? 'Choose Your Business Plan' 
          : 'Choose Your Impact Level'
        }
      </h1>
      
      <p className="text-xl text-slate-300 max-w-3xl mx-auto">
        {userType === 'business' 
          ? 'Grow your business and connect with customers in the Black community. All business plans include a 30-day free trial.'
          : 'Join thousands of community members circulating Black wealth. Every subscription helps strengthen our economic ecosystem.'
        }
      </p>

      {isTrialMode && (
        <div className="max-w-2xl mx-auto bg-slate-800/60 border border-white/10 rounded-lg p-4 backdrop-blur-xl">
          <div className="flex items-center justify-center space-x-2 text-mansagold">
            <Rocket className="h-5 w-5" />
            <span className="font-medium text-slate-100">
              Welcome! Complete your free trial setup by selecting your plan below.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPageHeader;
