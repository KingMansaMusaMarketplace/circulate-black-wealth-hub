
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

const StillNeedHelpSection = () => {
  const handleEmailSupport = () => {
    window.location.href = 'mailto:contact@mansamusamarketplace.com';
  };

  const handlePhoneSupport = () => {
    window.location.href = 'tel:+13127096006';
  };

  return (
    <Card className="bg-gradient-to-r from-mansablue/5 to-mansagold/5 border-mansablue/20">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-bold text-mansablue mb-4">Still Need Help?</h2>
        <p className="text-foreground mb-6 max-w-2xl mx-auto font-medium">
          Can't find what you're looking for? Our support team is here to help you succeed 
          on the Mansa Musa Marketplace platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-mansablue hover:bg-mansablue-dark text-white"
            onClick={handleEmailSupport}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Support
          </Button>
          <Button 
            size="lg" 
            className="bg-white hover:bg-gray-50 text-mansablue border-2 border-mansablue"
            onClick={handlePhoneSupport}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Us
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StillNeedHelpSection;
