
import React from 'react';

const HowItWorksContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">How the Sales Agent Program Works</h2>
        <ol className="space-y-4 list-decimal list-inside">
          <li className="pl-2">
            <span className="font-medium">Apply to become a sales agent</span>
            <p className="text-gray-600 ml-6 mt-1">
              Fill out the application form with your details.
            </p>
          </li>
          <li className="pl-2">
            <span className="font-medium">Complete the qualification test</span>
            <p className="text-gray-600 ml-6 mt-1">
              Pass a simple test about Mansa Musa Marketplace to ensure you can represent us effectively.
            </p>
          </li>
          <li className="pl-2">
            <span className="font-medium">Receive your unique referral code</span>
            <p className="text-gray-600 ml-6 mt-1">
              Once approved, you'll get a personal referral code to share with potential customers.
            </p>
          </li>
          <li className="pl-2">
            <span className="font-medium">Share your referral code</span>
            <p className="text-gray-600 ml-6 mt-1">
              Share your code with potential customers and business owners through various channels.
            </p>
          </li>
          <li className="pl-2">
            <span className="font-medium">Earn commissions</span>
            <p className="text-gray-600 ml-6 mt-1">
              You'll earn 10% commission on business subscription fees when a business signs up using your code. Note: Commissions are only for business sign-ups, not individual customers.
            </p>
          </li>
          <li className="pl-2">
            <span className="font-medium">Get paid</span>
            <p className="text-gray-600 ml-6 mt-1">
              Commissions are released 30 days after a successful referral.
            </p>
          </li>
        </ol>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Commission Structure</h2>
        <div className="space-y-3">
          <p>
            <span className="font-medium">Commission Rate:</span> 10% of business subscription fees
          </p>
          <p>
            <span className="font-medium">Payment Schedule:</span> 30 days after successful referral
          </p>
          <p>
            <span className="font-medium">Recurring Commissions:</span> Earn commissions on recurring business subscription payments for 2 years
          </p>
          <p className="text-sm text-gray-500 mt-2">
            <span className="font-medium">Important:</span> Sales agent commissions are only earned on business sign-ups, not individual customer sign-ups.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksContent;
