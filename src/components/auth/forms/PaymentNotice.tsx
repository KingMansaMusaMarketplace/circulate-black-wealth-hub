
import React from 'react';
import { Clock } from 'lucide-react';

interface PaymentNoticeProps {
  className?: string;
}

export const PaymentNotice: React.FC<PaymentNoticeProps> = ({ className = "mb-6" }) => {
  return (
    <div className={`${className} bg-mansablue/10 rounded-md p-3 border border-mansablue/30 flex items-center`}>
      <Clock size={18} className="text-mansablue mr-2 flex-shrink-0" />
      <p className="text-sm text-mansablue-dark">
        <span className="font-medium">Payment Processing Coming Soon!</span> You can create your account now and we'll notify you when payment processing is ready.
      </p>
    </div>
  );
};
