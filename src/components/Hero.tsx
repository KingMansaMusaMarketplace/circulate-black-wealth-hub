
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, GraduationCap, Building2, TrendingUp, Shield, QrCode, BarChart3 } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-16">
        {/* Subscription Badges - Mobile Responsive */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
          <Link to="/signup">
            <Badge className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full cursor-pointer">
              <Star className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
              Start FREE - Browse directory, discover businesses, view profiles
            </Badge>
          </Link>
          <Link to="/subscription">
            <Badge className="bg-mansagold hover:bg-mansagold-dark text-mansablue px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full cursor-pointer">
              <Crown className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
              Limited Premium Special - $4.99/month (for 1 year)
            </Badge>
          </Link>
          <Link to="/signup">
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full cursor-pointer">
              <GraduationCap className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
              FREE Premium for HBCU
            </Badge>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-20">
          <div className="text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 md:mb-8">
              Save Money &{' '}
              <br className="hidden sm:block" />
              Support{' '}
              <span className="text-mansagold">Black-Owned Businesses</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed mb-6 md:mb-8">
              Get 5% - 30% discounts while building community wealth!
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed mb-8 md:mb-12">
              Join thousands of customers discovering amazing businesses and making every 
              purchase count toward building generational wealth.
            </p>

            {/* CTA Buttons - Mobile Optimized with better text wrapping */}
            <div className="flex flex-col gap-4 mb-8 w-full">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button className="bg-mansagold hover:bg-mansagold/90 text-mansablue font-bold py-3 md:py-4 px-4 md:px-6 text-sm sm:text-base md:text-lg rounded-xl w-full sm:w-auto leading-tight">
                  <span className="text-center">
                    Start FREE Today
                    <br className="sm:hidden" />
                    <span className="hidden sm:inline"> - </span>
                    Browse, Discover, View Profiles
                  </span>
                </Button>
              </Link>
              
              <Link to="/directory" className="w-full sm:w-auto">
                <Button 
                  variant="white"
                  className="py-3 md:py-4 px-6 md:px-8 text-base md:text-lg rounded-xl w-full sm:w-auto whitespace-nowrap"
                >
                  Browse Directory
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative max-w-lg w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/lovable-uploads/487f9aac-a3ad-4b28-8d90-3fd25a3a689b.png" 
                  alt="Professional business woman working on laptop"
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay with key benefits */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="text-white space-y-3">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-sm font-medium">5% - 30% Discounts</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Crown className="h-5 w-5 text-mansagold mr-2" />
                      <span className="text-sm font-medium">$4.99/month</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="text-sm font-medium">Trusted Network</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Updated Plan Cards Grid - Now includes new business tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 max-w-7xl mx-auto">
          <Link to="/signup">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-100 mb-3 md:mb-4">
                    FREE
                  </Badge>
                  <h3 className="text-green-100 font-semibold text-base md:text-lg mb-2 md:mb-3">FREE MEMBERSHIP</h3>
                  <p className="text-white/90 text-xs md:text-sm">Browse directory, discover businesses, view profiles</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/subscription">
            <Card className="bg-mansagold/20 backdrop-blur-lg border border-mansagold/30 hover:bg-mansagold/25 transition-all cursor-pointer">
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <Badge className="bg-mansagold text-mansablue mb-3 md:mb-4">
                    <Crown className="mr-1 h-3 w-3" />
                    $4.99/month
                  </Badge>
                  <h3 className="text-mansagold font-semibold text-base md:text-lg mb-2 md:mb-3">PREMIUM</h3>
                  <p className="text-white/90 text-xs md:text-sm">
                    Get 5% - 30% discounts, earn points, redeem rewards, exclusive deals
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/signup">
            <Card className="bg-blue-500/20 backdrop-blur-lg border border-blue-400/30 hover:bg-blue-500/25 transition-all cursor-pointer">
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <Badge className="bg-blue-500 text-white mb-3 md:mb-4">
                    <GraduationCap className="mr-1 h-3 w-3" />
                    🎓
                  </Badge>
                  <h3 className="text-blue-200 font-semibold text-base md:text-lg mb-2 md:mb-3">HBCU STUDENTS</h3>
                  <p className="text-white/90 text-xs md:text-sm mb-2">Get ALL Premium features FREE!</p>
                  <p className="text-blue-200 text-xs">Upload student ID during signup</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/signup?type=business&tier=business_starter">
            <Card className="bg-purple-500/20 backdrop-blur-lg border border-purple-400/30 hover:bg-purple-500/25 transition-all cursor-pointer">
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <Badge className="bg-purple-500 text-white mb-3 md:mb-4">
                    <QrCode className="mr-1 h-3 w-3" />
                    $29/month
                  </Badge>
                  <h3 className="text-purple-200 font-semibold text-base md:text-lg mb-2 md:mb-3">STARTER BUSINESS</h3>
                  <p className="text-white/90 text-xs md:text-sm mb-1">Up to 3 QR codes</p>
                  <p className="text-white/80 text-xs">30-day free trial</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/signup?type=business&tier=business">
            <Card className="bg-orange-500/20 backdrop-blur-lg border border-orange-400/30 hover:bg-orange-500/25 transition-all cursor-pointer">
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <Badge className="bg-orange-500 text-white mb-3 md:mb-4">
                    <BarChart3 className="mr-1 h-3 w-3" />
                    $100/month
                  </Badge>
                  <h3 className="text-orange-200 font-semibold text-base md:text-lg mb-2 md:mb-3">PROFESSIONAL BUSINESS</h3>
                  <p className="text-white/90 text-xs md:text-sm mb-1">Up to 50 QR codes</p>
                  <p className="text-white/80 text-xs">30-day free trial</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/signup?type=business">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <Badge className="bg-mansagold/80 text-mansablue mb-3 md:mb-4">
                    <Building2 className="mr-1 h-3 w-3" />
                    👥
                  </Badge>
                  <h3 className="text-mansagold font-semibold text-base md:text-lg mb-2 md:mb-3">ALL BUSINESS PLANS</h3>
                  <p className="text-white/90 text-xs md:text-sm mb-1">First month FREE!</p>
                  <p className="text-white/80 text-xs">Compare all plans</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
