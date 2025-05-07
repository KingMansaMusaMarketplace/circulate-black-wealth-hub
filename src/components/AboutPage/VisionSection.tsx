
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const VisionSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md text-mansablue mb-4 inline-block relative">
            Vision 2030
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-mansagold"></span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mt-6">
            By 2030, Mansa Musa Marketplace will have created measurable impact in Black communities through 
            intentional economic infrastructure.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-mansagold/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center border-b border-gray-100 pb-4">
              <div className="text-4xl mb-4 flex justify-center">✊🏾</div>
              <CardTitle className="text-xl">100,000+</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600 text-center">
                Black-owned businesses empowered globally through our platform
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-mansagold/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center border-b border-gray-100 pb-4">
              <div className="text-4xl mb-4 flex justify-center">💵</div>
              <CardTitle className="text-xl">$1+ Billion</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600 text-center">
                Circulated within Black communities through intentional spending
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-mansagold/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center border-b border-gray-100 pb-4">
              <div className="text-4xl mb-4 flex justify-center">🏦</div>
              <CardTitle className="text-xl">Financial Services</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600 text-center">
                Launch of parallel services: cashback, lending, wealth planning
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 font-bold mb-8">
            This is not a marketplace.<br />
            This is a platform for economic sovereignty.
          </p>
          <Link to="/signup">
            <Button className="bg-mansablue hover:bg-mansablue-dark text-white px-8 py-2 text-lg group">
              Join The Movement
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
