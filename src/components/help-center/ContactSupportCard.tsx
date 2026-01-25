
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const ContactSupportCard = () => {
  const handleEmailClick = () => {
    window.location.href = 'mailto:Thomas@1325.AI';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+13127096006';
  };

  const handleLiveChat = () => {
    // For now, redirect to email - can be updated with actual chat service later
    window.location.href = 'mailto:Thomas@1325.AI?subject=Live Chat Support Request';
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-xl text-mansablue flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Contact Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <Mail className="h-4 w-4 text-mansagold mt-1 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">Email Support</p>
            <button 
              onClick={handleEmailClick}
              className="text-mansablue hover:text-mansablue-dark break-all text-left hover:underline"
            >
              Thomas@1325.AI
            </button>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Phone className="h-4 w-4 text-mansagold mt-1 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">Phone Support</p>
            <button 
              onClick={handlePhoneClick}
              className="text-mansablue hover:text-mansablue-dark hover:underline text-left"
            >
              312.709.6006
            </button>
            <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM CST</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <MapPin className="h-4 w-4 text-mansagold mt-1 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">Office Location</p>
            <p className="text-sm text-gray-600">
              1000 E. 111th Street, Suite 1100<br />
              Chicago, Illinois 60628
            </p>
          </div>
        </div>
        
        <Button 
          className="w-full mt-4 bg-mansablue hover:bg-mansablue-dark"
          onClick={handleLiveChat}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Start Live Chat
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContactSupportCard;
