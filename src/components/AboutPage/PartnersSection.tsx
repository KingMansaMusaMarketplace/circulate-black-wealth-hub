
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const PartnersSection = () => {
  const partners = [
    {
      name: "Urban Business Alliance",
      logo: "UBA",
      description: "Network of urban entrepreneurs focused on business development and expansion."
    },
    {
      name: "Black Economic Initiative",
      logo: "BEI",
      description: "Research institute dedicated to analyzing and enhancing Black wealth circulation patterns."
    },
    {
      name: "Financial Future Foundation",
      logo: "FFF",
      description: "Non-profit organization providing financial literacy education to underserved communities."
    },
    {
      name: "Community Capital Partners",
      logo: "CCP",
      description: "Investment group focused exclusively on funding Black-owned businesses and initiatives."
    }
  ];

  return (
    <section className="py-20 bg-mansablue text-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-4">Our Strategic Partners</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <p className="text-white/80 max-w-2xl mx-auto">
            Building economic infrastructure requires collaboration. These organizations support our mission.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-mansablue mb-4">
                  <span className="font-bold text-xl">{partner.logo}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{partner.name}</h3>
                <p className="text-white/80 text-center text-sm">{partner.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/partners">
            <Button className="bg-mansagold hover:bg-mansagold-dark text-white group">
              Become A Partner
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
