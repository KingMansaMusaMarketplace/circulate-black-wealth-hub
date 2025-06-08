
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, GraduationCap } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  
  const handleSignupClick = () => {
    navigate('/signup');
  };
  
  const handleDirectoryClick = () => {
    navigate('/directory');
  };

  const handleFreeSignupClick = () => {
    navigate('/signup/customer');
  };

  const handlePremiumSignupClick = () => {
    navigate('/signup/customer');
  };

  const handleHBCUSignupClick = () => {
    navigate('/signup/customer');
  };
  
  return (
    <section className="bg-gradient-to-b from-mansablue to-mansablue-dark py-16 md:py-20 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Large blurred circles for depth */}
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-mansagold/10 blur-3xl"></div>
        
        {/* Smaller decorative elements */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 flex space-x-20">
          <div className="w-2 h-2 rounded-full bg-mansagold/40"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="w-2 h-2 rounded-full bg-mansagold/40"></div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 text-white mb-8 md:mb-0">
            {/* Free membership highlight */}
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={handleFreeSignupClick}
                className="bg-green-600 text-white px-3 py-1 text-sm font-medium rounded-full flex items-center hover:bg-green-700 transition-colors cursor-pointer"
              >
                <Star className="h-3 w-3 mr-1" />
                Start FREE
              </button>
              <button
                onClick={handlePremiumSignupClick}
                className="bg-mansagold text-mansablue px-3 py-1 text-sm font-medium rounded-full flex items-center hover:bg-mansagold/90 transition-colors cursor-pointer"
              >
                <Crown className="h-3 w-3 mr-1" />
                Premium $10/month
              </button>
              <button
                onClick={handleHBCUSignupClick}
                className="bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-full flex items-center hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <GraduationCap className="h-3 w-3 mr-1" />
                FREE Premium for HBCU
              </button>
            </div>

            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Save Money &amp; Support</span>
              <span className="block text-mansagold">Black-Owned Businesses</span>
              <span className="block text-lg sm:text-xl md:text-2xl font-normal mt-2 text-white/90">
                Start FREE - Get 10% - 20% discounts while building community wealth!
              </span>
            </h1>
            <p className="mt-3 text-base text-white/80 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl">
              Join thousands of customers discovering amazing businesses and making every purchase count toward building generational wealth.
            </p>
            
            {/* Free vs Premium Features */}
            <div className="mt-6 space-y-3">
              {/* Free Features */}
              <div className="bg-white/10 border border-white/30 rounded-md px-4 py-3">
                <p className="text-sm md:text-base font-medium text-white">
                  <span className="font-bold text-green-400">🆓 FREE MEMBERSHIP:</span> Browse directory, discover businesses, view profiles
                </p>
              </div>

              {/* Premium Features */}
              <div className="bg-mansagold/20 border border-mansagold/40 rounded-md px-4 py-3">
                <p className="text-sm md:text-base font-medium text-white">
                  <span className="font-bold text-mansagold">💰 PREMIUM ($10/month):</span> Get 10% - 20% discounts, earn points, redeem rewards, exclusive deals, premium support, mentorship access, advanced networking
                </p>
              </div>

              {/* HBCU Special Offer */}
              <div className="bg-blue-600/20 border border-blue-400/40 rounded-md px-4 py-3">
                <p className="text-sm md:text-base font-medium text-white">
                  <span className="font-bold text-blue-300">🎓 HBCU STUDENTS &amp; STAFF:</span> Get ALL Premium features FREE with verification!
                  <span className="block mt-1 text-xs text-blue-200">Upload student ID or staff credentials during signup</span>
                </p>
              </div>

              {/* Business Owner Benefits */}
              <div className="bg-white/10 border border-white/30 rounded-md px-4 py-3">
                <p className="text-sm md:text-base font-medium text-white">
                  <span className="font-bold text-mansagold">🏪 BUSINESS OWNERS:</span> First month FREE! Connect with loyal customers
                  <span className="block mt-1">$100/month after trial period</span>
                </p>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 sm:flex sm:justify-start gap-3">
              <div className="rounded-md shadow">
                <Button 
                  onClick={handleSignupClick}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-mansablue bg-mansagold hover:bg-mansagold-dark md:py-4 md:text-lg md:px-10"
                >
                  Start FREE Today
                </Button>
              </div>
              <div className="mt-3 sm:mt-0">
                <Button 
                  onClick={handleDirectoryClick}
                  variant="outline"
                  className="w-full flex items-center justify-center px-8 py-3 border border-white text-white bg-transparent hover:bg-white/10 md:py-4 md:text-lg md:px-10"
                >
                  Browse Directory
                </Button>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative max-w-md">
              {/* Decorative elements around image */}
              <div className="absolute -top-4 -left-4 w-full h-full bg-mansagold/20 rounded-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-mansablue-light/30 rounded-xl"></div>
              
              <img
                className="relative z-10 h-56 w-full object-cover sm:h-72 md:h-96 rounded-lg shadow-lg"
                src="https://images.unsplash.com/photo-1573164713712-03790a178651"
                alt="Happy customers shopping and saving money at Black-owned businesses while earning rewards"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
