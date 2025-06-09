
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Users } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-mansablue to-mansablue-dark">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Start Circulating Wealth?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of community members supporting Black-owned businesses and creating economic impact.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/signup">
            <Button size="lg" className="bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold px-8 py-3">
              <Users className="mr-2 h-5 w-5" />
              Join as Customer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/signup?type=business">
            <Button 
              variant="white" 
              size="lg" 
              className="px-8 py-3"
            >
              <Building2 className="mr-2 h-5 w-5" />
              Join as Business
            </Button>
          </Link>
        </div>
        
        <div className="mt-8">
          <Link to="/how-it-works">
            <Button variant="ghost" className="text-white hover:text-mansagold">
              Learn How It Works
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
