
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Users } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-mansablue to-mansablue-dark">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white drop-shadow-md mb-6">
          Ready to Start Circulating Wealth?
        </h2>
        <p className="text-xl text-white/95 drop-shadow-sm mb-8 max-w-2xl mx-auto">
          Join our mission to reach 1 million members supporting Black-owned businesses and creating economic impact.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all min-h-[48px]">
            <Link to="/signup">
              <Users className="mr-2 h-5 w-5" />
              Join as Customer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            size="lg" 
            className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-mansablue backdrop-blur-sm px-8 py-3 shadow-lg hover:shadow-xl transition-all min-h-[48px]"
          >
            <Link to="/signup?type=business">
              <Building2 className="mr-2 h-5 w-5" />
              Join as Business
            </Link>
          </Button>
        </div>
        
        <div className="mt-8">
          <Button asChild variant="ghost" className="text-white hover:text-mansagold-light hover:bg-white/10 drop-shadow-sm min-h-[44px]">
            <Link to="/how-it-works">
              Learn How It Works
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
