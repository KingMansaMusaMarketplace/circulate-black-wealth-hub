
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import BusinessForm from '../BusinessForm';

const BusinessDetailsContent: React.FC<{ profileId?: string }> = ({ profileId }) => {
  return (
    <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Business Information</h2>
        <BusinessForm key={profileId || 'new'} />
      </CardContent>
    </Card>
  );
};

export default BusinessDetailsContent;
