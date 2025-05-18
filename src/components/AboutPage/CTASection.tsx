
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="bg-gradient-to-br from-mansablue to-mansablue-dark rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJWNmgydjJ6TTI0IDM0aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0yVjZoMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
          <div className="relative z-10">
            <TrendingUp className="mb-6 mx-auto h-16 w-16 text-mansagold" />
            <h2 className="heading-lg mb-6">Join Us in Building Economic Infrastructure</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
              Be part of the movement that's creating intentional wealth circulation for generations to come.
            </p>
            <Link to="/signup">
              <Button className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg font-medium group">
                Get Early Access 
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
