
import React from 'react';
import { BusinessProfile } from '@/lib/api/business-api';
import VerificationTab from '../verification/VerificationTab';

interface BusinessVerificationContentProps {
  profile?: BusinessProfile | null;
}

const BusinessVerificationContent: React.FC<BusinessVerificationContentProps> = ({ profile }) => {
  return <VerificationTab />;
};

export default BusinessVerificationContent;
