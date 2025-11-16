
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import BusinessFormContent from './business-form/BusinessFormContent';

const BusinessForm = () => {
  return (
    <div className="relative animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue/20 to-mansagold/20 rounded-3xl blur-xl" />
      <Card className="relative bg-card/95 backdrop-blur-sm border-2 border-border/40 shadow-xl rounded-3xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mansablue via-purple-600 to-mansagold" />
        <CardContent className="pt-8 pb-8">
          <BusinessFormContent />
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessForm;
