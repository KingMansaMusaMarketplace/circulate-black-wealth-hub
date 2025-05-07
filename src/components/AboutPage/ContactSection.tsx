
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md text-mansablue mb-4">Contact Us</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Reach out to us with questions or to learn more about Mansa Musa Marketplace.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-mansagold/20">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-mansablue rounded-full flex items-center justify-center text-white mb-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Email</h3>
                  <a href="mailto:MMM@mansamusamarketplace.com" className="text-mansablue hover:text-mansagold transition-colors">
                    MMM@mansamusamarketplace.com
                  </a>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-mansablue rounded-full flex items-center justify-center text-white mb-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Telephone</h3>
                  <a href="tel:3127096006" className="text-mansablue hover:text-mansagold transition-colors">
                    312.709.6006
                  </a>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-mansablue rounded-full flex items-center justify-center text-white mb-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Office</h3>
                  <address className="not-italic text-gray-600">
                    1000 E. 111th Street<br />
                    Suite 1100<br />
                    Chicago, Illinois 60628
                  </address>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
