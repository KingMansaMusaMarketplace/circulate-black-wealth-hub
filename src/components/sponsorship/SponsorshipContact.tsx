import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar, MapPin, Globe, Smartphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SponsorshipContact = () => {
  const handleScheduleCall = () => {
    window.open('https://calendly.com/mansamusa-partnerships', '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:partners@1325.ai?subject=Corporate Sponsorship Inquiry';
  };

  const handleOfficePhoneClick = () => {
    window.location.href = 'tel:+13127096006';
  };

  const handleMobilePhoneClick = () => {
    window.location.href = 'tel:+17082381249';
  };

  const handleWebsiteClick = () => {
    window.open('https://1325.ai', '_blank');
  };

  return (
    <div className="py-16 bg-mansablue text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Your Sponsorship Team</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Connect directly with our founder to discuss how your organization can make a lasting impact.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 bg-gradient-to-br from-mansablue-dark to-mansablue p-8 flex flex-col justify-center items-center">
                <img 
                  src="/lovable-uploads/king-thomas-3.png" 
                  alt="Thomas Bowling - Founder & CEO" 
                  className="w-44 h-44 object-cover rounded-full mb-6 border-4 border-mansagold shadow-xl"
                />
                <h3 className="text-2xl font-bold text-white text-center">Thomas Bowling</h3>
                <p className="text-mansagold font-semibold text-center tracking-wide">FOUNDER & CEO</p>
              </div>
              
              <CardContent className="md:w-3/5 p-8 bg-white text-gray-800">
                <p className="text-lg mb-6 italic text-gray-600 border-l-4 border-mansagold pl-4">
                  "I'm dedicated to creating meaningful partnerships that drive economic empowerment in our communities. Let's discuss how we can align your organizational goals with lasting community impact."
                </p>
                
                {/* Global Headquarters */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-mansablue mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-mansablue mb-1">Global Headquarters</p>
                      <p className="text-gray-600 text-sm">
                        1000 E. 111th Street<br />
                        Suite 1100<br />
                        Chicago, Illinois 60628
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Office Phone */}
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-mansablue mr-3" />
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Office</span>
                      <button 
                        onClick={handleOfficePhoneClick}
                        className="block text-mansablue hover:underline cursor-pointer font-medium"
                      >
                        (312) 709-6006
                      </button>
                    </div>
                  </div>

                  {/* Mobile Phone */}
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 text-mansablue mr-3" />
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Mobile</span>
                      <button 
                        onClick={handleMobilePhoneClick}
                        className="block text-mansablue hover:underline cursor-pointer font-medium"
                      >
                        (708) 238-1249
                      </button>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-mansablue mr-3" />
                    <button 
                      onClick={handleEmailClick}
                      className="text-mansablue hover:underline cursor-pointer font-medium"
                    >
                      partners@1325.ai
                    </button>
                  </div>

                  {/* Website */}
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-mansablue mr-3" />
                    <button 
                      onClick={handleWebsiteClick}
                      className="text-mansablue hover:underline cursor-pointer font-mono font-medium tracking-wider"
                    >
                      1325.AI
                    </button>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="bg-mansablue hover:bg-mansablue-dark w-full sm:w-auto"
                      onClick={handleScheduleCall}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule a Call
                    </Button>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-400 text-center">
                    © 2025 <span className="font-mono tracking-wider">1325.AI</span>, Inc. All Rights Reserved.
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipContact;
