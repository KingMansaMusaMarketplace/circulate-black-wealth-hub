
import React from 'react';
import { TrendingUp, Users, Crown } from 'lucide-react';

interface SubscriptionBenefitsProps {
  userType: 'customer' | 'business';
}

const SubscriptionBenefits: React.FC<SubscriptionBenefitsProps> = ({ userType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-mansablue/10 rounded-full flex items-center justify-center mx-auto">
          <TrendingUp className="h-8 w-8 text-mansablue" />
        </div>
        <h3 className="text-xl font-semibold">
          {userType === 'business' ? 'Grow Your Business' : 'Maximize Your Impact'}
        </h3>
        <p className="text-gray-600">
          {userType === 'business' 
            ? 'Connect with customers and grow your revenue in the Black community'
            : 'Track and amplify your contribution to Black wealth circulation'
          }
        </p>
      </div>

      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-mansagold/10 rounded-full flex items-center justify-center mx-auto">
          <Users className="h-8 w-8 text-mansagold" />
        </div>
        <h3 className="text-xl font-semibold">Support Community</h3>
        <p className="text-gray-600">
          Every subscription directly supports Black business growth and community development
        </p>
      </div>

      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Crown className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold">
          {userType === 'business' ? 'Business Tools & Services' : 'Earn Rewards'}
        </h3>
        <p className="text-gray-600">
          {userType === 'business' 
            ? 'Analytics, QR codes, booking system, and marketing tools for your business'
            : 'Earn points with purchases, redeem at businesses, access deals and events'
          }
        </p>
      </div>
    </div>
  );
};

export default SubscriptionBenefits;
