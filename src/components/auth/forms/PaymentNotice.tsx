import React from 'react';
import { shouldHideStripePayments } from '@/utils/platform-utils';

export const PaymentNotice: React.FC = () => {
  const hidePayments = shouldHideStripePayments();
  
  // Don't show payment notice on iOS
  if (hidePayments) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Marketplace Services for Businesses:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• List your business in our directory</li>
          <li>• Generate QR codes for customer check-ins</li>
          <li>• Track customer visits and analytics</li>
          <li>• Manage your loyalty program rewards</li>
          <li>• Accept bookings and appointments</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">Physical services and marketplace tools</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Marketplace Services for Businesses:</h4>
      <ul className="text-xs text-gray-600 space-y-1">
        <li>• List your business in our directory</li>
        <li>• Generate QR codes for customer check-ins</li>
        <li>• Track customer visits and analytics</li>
        <li>• Manage your loyalty program rewards</li>
        <li>• Accept bookings and appointments</li>
      </ul>
      <p className="text-xs text-gray-500 mt-2">Physical services and marketplace tools</p>
    </div>
  );
};
