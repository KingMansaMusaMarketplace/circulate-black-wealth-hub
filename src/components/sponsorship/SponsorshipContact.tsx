
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SponsorshipContact = () => {
  return (
    <div className="py-16 bg-mansablue text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Your Sponsorship Team</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Have questions? Our dedicated sponsorship team is here to help you navigate the process.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-mansablue-dark p-8 flex flex-col justify-center items-center">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                  alt="Sponsorship Director" 
                  className="w-40 h-40 object-cover rounded-full mb-4 border-4 border-white"
                />
                <h3 className="text-xl font-semibold text-white text-center">Maya Johnson</h3>
                <p className="text-white/80 text-center">Director of Corporate Partnerships</p>
              </div>
              
              <CardContent className="md:w-2/3 p-8 bg-white text-gray-800">
                <p className="text-lg mb-6">
                  "I'm dedicated to creating meaningful partnerships that drive economic empowerment while delivering value to our corporate sponsors. Let's discuss how we can align your organizational goals with our community impact."
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-mansablue mr-3" />
                    <a href="mailto:partnerships@mansamusamarketplace.com" className="text-mansablue hover:underline">
                      partnerships@mansamusamarketplace.com
                    </a>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-mansablue mr-3" />
                    <a href="tel:+1-555-867-5309" className="text-mansablue hover:underline">
                      (555) 867-5309
                    </a>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="bg-mansablue hover:bg-mansablue-dark w-full sm:w-auto">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule a Call
                    </Button>
                  </div>
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
