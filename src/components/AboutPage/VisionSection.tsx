
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const VisionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-6 inline-block relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent font-extrabold">
            Vision 2030
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-md"></span>
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg mt-8 font-semibold">
            By 2030, Mansa Musa Marketplace will have created measurable impact in Black communities through 
            intentional economic infrastructure.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="text-center border-b-2 border-gradient-to-r from-purple-200 to-pink-200 pb-6">
              <div className="text-5xl mb-4 flex justify-center animate-pulse">✊🏾</div>
              <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">100,000+</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 text-center font-medium leading-relaxed">
                Black-owned businesses empowered globally through our platform
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-amber-200 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-amber-50">
            <CardHeader className="text-center border-b-2 border-gradient-to-r from-amber-200 to-orange-200 pb-6">
              <div className="text-5xl mb-4 flex justify-center animate-pulse">💵</div>
              <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">$1+ Billion</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 text-center font-medium leading-relaxed">
                Circulated within Black communities through intentional spending
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="text-center border-b-2 border-gradient-to-r from-blue-200 to-cyan-200 pb-6">
              <div className="text-5xl mb-4 flex justify-center animate-pulse">🏦</div>
              <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Financial Services</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 text-center font-medium leading-relaxed">
                Launch of parallel services: cashback, lending, wealth planning
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16 text-center bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border-2 border-purple-200">
          <p className="text-xl text-gray-800 font-extrabold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            This is not a marketplace.<br />
            This is a platform for economic sovereignty.
          </p>
          <Link to="/signup">
            <Button className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white px-10 py-3 text-lg font-bold group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Join The Movement
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
