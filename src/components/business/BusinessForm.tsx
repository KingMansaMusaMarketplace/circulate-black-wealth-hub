
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import BusinessFormContent from './business-form/BusinessFormContent';

const BusinessForm = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <BusinessFormContent />
      </CardContent>
    </Card>
  );
};

export default BusinessForm;
