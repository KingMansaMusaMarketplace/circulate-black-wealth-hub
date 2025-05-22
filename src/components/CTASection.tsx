
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-mansablue py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to grow your business?</span>
            <span className="block text-blue-100">Join Mansa Musa today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-4">
            <Button
              onClick={() => navigate('/business-signup')}
              size="lg"
              className="bg-white text-mansablue hover:bg-blue-50"
            >
              For Businesses
            </Button>
            <Button
              onClick={() => navigate('/customer-signup')}
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white hover:bg-blue-700"
            >
              For Customers
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
