
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="bg-gradient-to-br from-mansablue to-mansablue-dark rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="heading-lg mb-6">Your Dollar Is Powerful.<br />Use It Intentionally.</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
            Join Mansa Musa Marketplace today and become part of a movement that's building economic sovereignty one transaction at a time.
          </p>
          <Link to="/signup">
            <Button className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg font-medium">
              Get Early Access →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
