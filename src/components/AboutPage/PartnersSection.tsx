
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const PartnersSection = () => {
  const partners = [
    {
      name: "Urban Business Alliance",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Network of urban entrepreneurs focused on business development and expansion."
    },
    {
      name: "Black Economic Initiative",
      logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Research institute dedicated to analyzing and enhancing Black wealth circulation patterns."
    },
    {
      name: "Financial Future Foundation",
      logo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Non-profit organization providing financial literacy education to underserved communities."
    },
    {
      name: "Community Capital Partners",
      logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Investment group focused exclusively on funding Black-owned businesses and initiatives."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-teal-400/20 to-emerald-400/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl"></div>
      </div>
      
      <div className="container-custom relative">
        <div className="text-center mb-12">
          <h2 className="heading-md bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 bg-clip-text text-transparent mb-4">Our Strategic Partners</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 mx-auto mb-6 shadow-lg shadow-amber-400/50"></div>
          <p className="text-white/90 max-w-2xl mx-auto text-lg font-medium">
            Building economic infrastructure requires collaboration. These organizations support our mission.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, index) => {
            const gradients = [
              'from-rose-500 to-pink-600',
              'from-purple-500 to-indigo-600',
              'from-emerald-500 to-teal-600',
              'from-amber-500 to-orange-600'
            ];
            const gradient = gradients[index % gradients.length];
            
            return (
              <Card key={index} className={`bg-gradient-to-br ${gradient} border-2 border-white/30 backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-300`}>
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4 overflow-hidden shadow-lg ring-4 ring-white/50">
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white text-center">{partner.name}</h3>
                  <p className="text-white/90 text-center text-sm leading-relaxed">{partner.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/contact">
            <Button className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-500 hover:via-amber-600 hover:to-orange-600 text-white font-bold group shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
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
