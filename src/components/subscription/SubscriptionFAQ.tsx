
import React from 'react';

interface SubscriptionFAQProps {
  userType: 'customer' | 'business';
}

const SubscriptionFAQ: React.FC<SubscriptionFAQProps> = ({ userType }) => {
  return (
    <div className="text-center space-y-4 pt-12">
      <h3 className="text-2xl font-bold text-mansablue">
        Questions About Subscriptions?
      </h3>
      <p className="text-gray-600 max-w-2xl mx-auto">
        {userType === 'business' 
          ? 'All business subscriptions come with a 30-day free trial and can be cancelled anytime. Start building your customer base today!'
          : 'All subscriptions come with a 30-day money-back guarantee. You can cancel or change your plan anytime.'
        }
      </p>
    </div>
  );
};

export default SubscriptionFAQ;
