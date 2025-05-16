
import React from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentNoticeProps {
  className?: string;
}

export const PaymentNotice: React.FC<PaymentNoticeProps> = ({ className = "mb-6" }) => {
  return (
    <div className={`${className} bg-mansablue/10 rounded-md p-3 border border-mansablue/30 flex items-center`}>
      <CreditCard size={18} className="text-mansablue mr-2 flex-shrink-0" />
      <p className="text-sm text-mansablue-dark">
        <span className="font-medium">Secure Payment Processing</span> - Your subscription will be activated after completing payment. Cancel anytime from your dashboard.
      </p>
    </div>
  );
};
