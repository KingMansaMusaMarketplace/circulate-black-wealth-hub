
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import BusinessForm from '../BusinessForm';

const BusinessDetailsContent: React.FC<{ profileId?: string }> = ({ profileId }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Business Information</h2>
        <BusinessForm key={profileId || 'new'} />
      </CardContent>
    </Card>
  );
};

export default BusinessDetailsContent;
