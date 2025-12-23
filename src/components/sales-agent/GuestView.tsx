
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, DollarSign, Medal, Users } from 'lucide-react';

const GuestView: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero section */}
      <div className="text-center py-12 px-4 relative">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-mansagold via-mansagold-light to-white mb-6 shadow-2xl shadow-mansagold/50 animate-float">
          <Users className="h-10 w-10 text-mansablue-dark" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-mansagold via-mansagold-light to-white bg-clip-text text-transparent mb-6 animate-fade-in">
          Become a Mansa Ambassador
        </h2>
        <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Join our growing team of ambassadors and earn commissions by connecting businesses and customers to the Mansa Musa Marketplace.
        </p>
        <Button 
          asChild 
          size="lg" 
          className="bg-gradient-to-r from-mansagold-dark to-mansagold hover:from-mansagold hover:to-mansagold-light text-mansablue-dark font-semibold shadow-xl shadow-mansagold/30 hover:shadow-2xl hover:shadow-mansagold/50 transition-all duration-300 hover:scale-105 animate-fade-in" 
          style={{ animationDelay: '0.2s' }}
        >
          <a href="/login?redirect=/sales-agent">
            Sign In to Apply <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </div>

      {/* Benefits grid */}
      <div className="py-12 px-4 relative">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white via-mansagold-light to-white bg-clip-text text-transparent">
          Benefits of Becoming a Mansa Ambassador
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="group relative bg-white/95 backdrop-blur-xl p-8 rounded-2xl border-2 border-mansagold/20 shadow-xl hover:shadow-2xl hover:shadow-mansagold/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-mansagold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mansagold-dark via-mansagold to-mansagold-light" />
            <div className="relative">
              <div className="bg-gradient-to-br from-mansagold/20 to-mansagold-light/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-8 w-8 text-mansagold" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Earn Commissions</h3>
              <p className="text-foreground/70">
                Receive 10% commission on all subscription fees from businesses and customers you refer to our platform.
              </p>
            </div>
          </div>
          
          <div className="group relative bg-white/95 backdrop-blur-xl p-8 rounded-2xl border-2 border-mansablue/20 shadow-xl hover:shadow-2xl hover:shadow-mansablue/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-mansablue/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mansablue-dark via-mansablue to-mansablue-light" />
            <div className="relative">
              <div className="bg-gradient-to-br from-mansablue/20 to-mansablue-light/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Medal className="h-8 w-8 text-mansablue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Performance Rewards</h3>
              <p className="text-foreground/70">
                Top-performing agents receive bonuses, recognition, and exclusive access to special events.
              </p>
            </div>
          </div>
          
          <div className="group relative bg-white/95 backdrop-blur-xl p-8 rounded-2xl border-2 border-mansagold/20 shadow-xl hover:shadow-2xl hover:shadow-mansagold/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-mansagold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mansagold-dark via-mansagold to-mansagold-light" />
            <div className="relative">
              <div className="bg-gradient-to-br from-mansagold/20 to-mansagold-light/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-mansagold" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Community Impact</h3>
              <p className="text-foreground/70">
                Help build wealth in Black communities by connecting businesses with customers who value supporting them.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-white via-mansagold-light to-white bg-clip-text text-transparent">
          How the Mansa Ambassador Program Works
        </h2>
        
        <ol className="space-y-8">
          <li className="flex gap-6 group">
            <div className="bg-gradient-to-br from-mansagold-dark to-mansagold text-mansablue-dark rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-lg shadow-mansagold/30 group-hover:scale-110 transition-transform duration-300">1</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-white">Sign Up & Apply</h3>
              <p className="text-white/80">
                Create an account and complete the ambassador application. Our team will review your application.
              </p>
            </div>
          </li>
          
          <li className="flex gap-6 group">
            <div className="bg-gradient-to-br from-mansablue-dark to-mansablue text-white rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-lg shadow-mansablue/30 group-hover:scale-110 transition-transform duration-300">2</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-white">Pass the Qualification Test</h3>
              <p className="text-white/80">
                Complete a simple test about Mansa Musa Marketplace to ensure you can represent us effectively.
              </p>
            </div>
          </li>
          
          <li className="flex gap-6 group">
            <div className="bg-gradient-to-br from-mansagold-dark to-mansagold text-mansablue-dark rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-lg shadow-mansagold/30 group-hover:scale-110 transition-transform duration-300">3</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-white">Receive Your Referral Code</h3>
              <p className="text-white/80">
                Once approved, you'll get a unique referral code to share with businesses and customers.
              </p>
            </div>
          </li>
          
          <li className="flex gap-6 group">
            <div className="bg-gradient-to-br from-mansablue-dark to-mansablue text-white rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-lg shadow-mansablue/30 group-hover:scale-110 transition-transform duration-300">4</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-white">Start Earning</h3>
              <p className="text-white/80">
                Every time someone signs up with your code, you'll earn a 10% commission on their subscription fees.
              </p>
            </div>
          </li>
        </ol>
      </div>

      {/* CTA section */}
      <div className="relative bg-gradient-to-br from-mansagold-dark via-mansagold to-mansagold-light py-16 px-4 text-center rounded-3xl overflow-hidden shadow-2xl shadow-mansagold/30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-mansablue-dark">Ready to Become a Mansa Ambassador?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-mansablue-dark/90">
            Sign up today and start earning commissions while helping to build wealth in Black communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-mansablue-dark to-mansablue hover:from-mansablue hover:to-mansablue-light text-white shadow-xl shadow-mansablue/30 hover:shadow-2xl hover:shadow-mansablue/50 transition-all duration-300 hover:scale-105" 
              asChild
            >
              <a href="/login?redirect=/sales-agent">
                Login to Apply
              </a>
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-mansablue-dark hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" 
              asChild
            >
              <a href="/signup">
                Create an Account
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestView;

