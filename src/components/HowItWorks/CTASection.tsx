
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-16 bg-mansablue text-white text-center">
      <div className="container-custom">
        <h2 className="heading-lg mb-6">Ready to Start Circulating?</h2>
        <p className="max-w-2xl mx-auto mb-8 text-white/80 text-lg">
          Join Mansa Musa Marketplace today and become part of the movement to strengthen Black economic power.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/signup">
            <Button className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg">
              Get Early Access →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
