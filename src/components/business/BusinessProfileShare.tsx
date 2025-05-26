
import React from 'react';
import EnhancedSocialShare from '@/components/social/EnhancedSocialShare';

interface BusinessProfileShareProps {
  businessId: string;
  businessName: string;
  businessDescription?: string;
  businessImage?: string;
}

const BusinessProfileShare: React.FC<BusinessProfileShareProps> = ({
  businessId,
  businessName,
  businessDescription,
  businessImage
}) => {
  return (
    <EnhancedSocialShare
      businessId={businessId}
      businessName={businessName}
      businessDescription={businessDescription}
      businessImage={businessImage}
      showStats={true}
      className="mt-6"
    />
  );
};

export default BusinessProfileShare;
