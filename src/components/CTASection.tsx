
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-gradient-to-r from-mansablue to-mansablue-light py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start saving money?</span>
            <span className="block text-blue-100">Join our community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-4">
            <Button
              onClick={() => navigate('/signup/customer')}
              size="lg"
              className="bg-mansagold text-mansablue hover:bg-mansagold-dark"
            >
              Start Earning Rewards
            </Button>
            <Button
              onClick={() => navigate('/signup/business')}
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white hover:bg-mansablue-light"
            >
              List Your Business
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
