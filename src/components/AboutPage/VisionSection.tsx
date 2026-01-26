
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const VisionSection = () => {
  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-mansagold/20 to-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-6 inline-block relative bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent font-extrabold">
            Vision 2030
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-gradient-to-r from-mansagold to-amber-500 rounded-full shadow-md"></span>
          </h2>
          <p className="text-blue-100/90 max-w-2xl mx-auto text-lg mt-8 font-semibold">
            By 2030, 1325.AI will have created measurable impact in Black communities through 
            intentional economic infrastructure.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 border-white/10 hover:border-mansagold/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-slate-800/60 backdrop-blur-xl">
            <CardHeader className="text-center border-b-2 border-white/10 pb-6">
              <div className="text-5xl mb-4 flex justify-center animate-pulse">✊🏾</div>
              <CardTitle className="text-2xl font-extrabold text-white">100,000+</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-blue-100/90 text-center font-medium leading-relaxed">
                Black-owned businesses empowered globally through our platform
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-white/10 hover:border-mansagold/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-slate-800/60 backdrop-blur-xl">
            <CardHeader className="text-center border-b-2 border-white/10 pb-6">
              <div className="text-5xl mb-4 flex justify-center animate-pulse">💵</div>
              <CardTitle className="text-2xl font-extrabold text-mansagold">$1+ Billion</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-blue-100/90 text-center font-medium leading-relaxed">
                Circulated within Black communities through intentional spending
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-white/10 hover:border-mansagold/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-slate-800/60 backdrop-blur-xl">
            <CardHeader className="text-center border-b-2 border-white/10 pb-6">
              <div className="text-5xl mb-4 flex justify-center animate-pulse">🏦</div>
              <CardTitle className="text-2xl font-extrabold text-white">Financial Services</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-blue-100/90 text-center font-medium leading-relaxed">
                Launch of parallel services: cashback, lending, wealth planning
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16 text-center bg-slate-800/60 backdrop-blur-xl rounded-2xl p-10 shadow-xl border-2 border-white/10">
          <p className="text-xl text-white font-extrabold mb-8">
            This is not an app.<br />
            This is economic infrastructure. This is the protocol for sovereignty.
          </p>
          <Link to="/signup">
            <Button className="bg-gradient-to-r from-mansagold to-amber-500 hover:from-mansagold/90 hover:to-amber-500/90 text-mansablue px-10 py-3 text-lg font-bold group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
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
