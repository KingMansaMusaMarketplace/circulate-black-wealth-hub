import React from 'react';
import { shouldHideStripePayments } from '@/utils/platform-utils';

export const PaymentNotice: React.FC = () => {
  const hidePayments = shouldHideStripePayments();
  
  // Don't show payment notice on iOS
  if (hidePayments) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Business Features:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Business profile in the marketplace</li>
          <li>• Unlimited QR code generation</li>
          <li>• Customer analytics dashboard</li>
          <li>• Loyalty program management</li>
        </ul>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Business Subscription:</h4>
      <ul className="text-xs text-gray-600 space-y-1">
        <li>• $100/month subscription fee</li>
        <li>• Business profile in the marketplace</li>
        <li>• Unlimited QR code generation</li>
        <li>• Customer analytics dashboard</li>
        <li>• Loyalty program management</li>
      </ul>
    </div>
  );
};
