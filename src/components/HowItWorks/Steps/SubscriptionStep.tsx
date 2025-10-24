
import React from 'react';
import { motion } from 'framer-motion';

interface SubscriptionStepProps {
  isHovered: boolean;
}

const SubscriptionStep: React.FC<SubscriptionStepProps> = ({ isHovered }) => {
  return (
    <motion.div 
      className={`bg-gray-50 rounded-xl p-4 border transition-all duration-300 border-mansablue`}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900">Subscription Plans</h3>
          <div className="bg-mansagold text-white px-2 py-1 rounded text-xs font-medium">
            Best Value
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold">Community Member</h4>
              <span className="font-bold text-mansagold">100% FREE Forever</span>
            </div>
            <ul className="mt-2 space-y-1">
              <li className="text-sm text-gray-600">• Full directory access</li>
              <li className="text-sm text-gray-600">• QR scanning for discounts</li>
              <li className="text-sm text-gray-600">• Loyalty points system</li>
              <li className="text-sm text-gray-600">• Earn and redeem rewards</li>
              <li className="text-sm text-gray-600">• Exclusive deals access</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold">Business Plans</h4>
              <div className="bg-mansablue text-white px-2 py-1 rounded text-xs font-medium">
                Most Popular
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Starter Business</span>
                <span className="font-bold text-mansablue">$39/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Professional Business</span>
                <span className="font-bold text-mansablue">$79/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Multi-Location</span>
                <span className="font-bold text-mansablue">$149/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Enterprise</span>
                <span className="font-bold text-mansablue">$299/month</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1 pt-3 border-t border-gray-200">
              <li className="text-sm text-gray-600">• Business listing in directory</li>
              <li className="text-sm text-gray-600">• Customer analytics dashboard</li>
              <li className="text-sm text-gray-600">• QR code generation</li>
              <li className="text-sm text-gray-600">• Premium support & mentorship</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionStep;
