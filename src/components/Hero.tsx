
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Smartphone, TrendingUp } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-mansablue via-mansablue-dark to-mansagold overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Circulate Wealth in the{' '}
              <span className="text-mansagold">Black Community</span>
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed">
              Discover Black-owned businesses, earn loyalty points, and create lasting economic impact in your community through the Mansa Musa Marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold px-8 py-3 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/directory">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-mansablue px-8 py-3 text-lg"
                >
                  Explore Businesses
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <Users className="h-8 w-8 text-mansagold mx-auto mb-2" />
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-white/80">Businesses</div>
              </div>
              <div className="text-center">
                <Smartphone className="h-8 w-8 text-mansagold mx-auto mb-2" />
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-white/80">QR Scans</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-mansagold mx-auto mb-2" />
                <div className="text-2xl font-bold">$2M+</div>
                <div className="text-sm text-white/80">Circulated</div>
              </div>
            </div>
          </div>
          
          <div className="lg:justify-self-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-mansagold/20 rounded-2xl blur-xl" />
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">Join the Movement</h3>
                <p className="text-white/90 mb-6">
                  Start circulating wealth and supporting Black-owned businesses today.
                </p>
                <div className="space-y-3">
                  <Link to="/signup/customer" className="block">
                    <Button className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue">
                      Join as Customer
                    </Button>
                  </Link>
                  <Link to="/signup/business" className="block">
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-mansablue">
                      Join as Business
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
