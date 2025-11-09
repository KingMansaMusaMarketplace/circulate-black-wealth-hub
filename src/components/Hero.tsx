import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/audio-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, GraduationCap, Building2, Users, TrendingUp, Shield, QrCode, BarChart3, CheckCircle, Zap, Heart, Volume2 } from 'lucide-react';
import { getAudioPath } from '@/utils/audio';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-16">
        {/* Phase 1 Free Growth Banner */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-green text-white px-6 py-3 text-lg font-bold rounded-full mb-4 animate-pulse-green">
            <Zap className="mr-2 h-5 w-5" />
            PHASE 1: FREE GROWTH - Everything FREE Until Jan 2026!
          </Badge>
          <p className="text-white/90 text-sm max-w-2xl mx-auto">
            We're building critical mass first. All features are 100% FREE for everyone - businesses and customers!
          </p>
        </div>

        {/* Free Access Badges */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
          <Link to="/signup">
            <Badge className="bg-gradient-green text-white px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full cursor-pointer animate-pulse-green">
              <Star className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
              100% FREE - All Customer Features
            </Badge>
          </Link>
          <Link to="/signup?type=business">
            <Badge className="bg-gradient-blue text-white px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full cursor-pointer animate-pulse-blue">
              <Building2 className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
              100% FREE - All Business Features
            </Badge>
          </Link>
          <Link to="/become-a-sales-agent">
            <Badge className="bg-gradient-sales text-white px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full cursor-pointer animate-pulse-ios">
              <TrendingUp className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
              Earn as Sales Agent - Up to 15%!
            </Badge>
          </Link>
          <Link to="/signup">
            <Badge className="bg-gradient-purple text-white px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full cursor-pointer animate-pulse-purple">
              <Heart className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
              Community First, Revenue Later
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
            
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 mb-6">
              <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed">
                <strong className="text-green-300">FREE FOR EVERYONE:</strong> Join thousands of customers and businesses 
                building economic power together. No subscriptions, no fees, just community wealth creation!
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 mb-8 w-full">
              <Link to="/signup" className="w-full sm:w-auto" style={{ touchAction: 'manipulation' }}>
                <Button 
                  className="bg-mansagold hover:bg-mansagold/90 text-mansablue font-bold py-3 md:py-4 px-4 md:px-6 text-sm sm:text-base md:text-lg rounded-xl w-full sm:w-auto leading-tight cursor-pointer"
                  style={{ touchAction: 'manipulation' }}
                >
                  <span className="text-center pointer-events-none">
                    Join FREE Today
                    <br className="sm:hidden" />
                    <span className="hidden sm:inline"> - </span>
                    No Credit Card Required
                  </span>
                </Button>
              </Link>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <AudioButton
                  audioSrc={getAudioPath('blueprint')}
                  variant="red"
                  className="py-3 md:py-4 px-6 md:px-8 text-base md:text-lg rounded-xl w-full sm:w-auto whitespace-nowrap cursor-pointer"
                >
                  <Volume2 className="mr-2 h-5 w-5" />
                  Hear Our Blueprint
                </AudioButton>
                
                <Link to="/directory" className="w-full sm:w-auto" style={{ touchAction: 'manipulation' }}>
                  <Button 
                    variant="outline"
                    className="py-3 md:py-4 px-6 md:px-8 text-base md:text-lg rounded-xl w-full sm:w-auto whitespace-nowrap border-mansagold text-mansagold hover:bg-mansagold hover:text-mansablue cursor-pointer"
                    style={{ touchAction: 'manipulation' }}
                  >
                    Browse Directory
                  </Button>
                </Link>
              </div>
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
                      <Star className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-sm font-medium">100% FREE</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="text-sm font-medium">Community First</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Updated Plan Cards Grid - All Free */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          <Link to="/signup">
            <Card className="bg-green-500/20 backdrop-blur-lg border border-green-400/30 hover:bg-green-500/25 transition-all cursor-pointer">
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <Badge className="bg-green-500 text-white mb-3 md:mb-4">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    100% FREE
                  </Badge>
                  <h3 className="text-green-100 font-semibold text-base md:text-lg mb-2 md:mb-3">CUSTOMERS</h3>
                  <p className="text-white/90 text-xs md:text-sm">
                    Browse directory, get discounts, earn loyalty points, redeem rewards
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/signup?type=business">
            <Card className="bg-blue-500/20 backdrop-blur-lg border border-blue-400/30 hover:bg-blue-500/25 transition-all cursor-pointer">
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <Badge className="bg-blue-500 text-white mb-3 md:mb-4">
                    <Building2 className="mr-1 h-3 w-3" />
                    100% FREE
                  </Badge>
                  <h3 className="text-blue-200 font-semibold text-base md:text-lg mb-2 md:mb-3">BUSINESSES</h3>
                  <p className="text-white/90 text-xs md:text-sm">
                    Unlimited QR codes, analytics, customer management, promotions
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/signup">
            <Card className="bg-purple-500/20 backdrop-blur-lg border border-purple-400/30 hover:bg-purple-500/25 transition-all cursor-pointer">
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <Badge className="bg-purple-500 text-white mb-3 md:mb-4">
                    <GraduationCap className="mr-1 h-3 w-3" />
                    STUDENTS
                  </Badge>
                  <h3 className="text-purple-200 font-semibold text-base md:text-lg mb-2 md:mb-3">HBCU SPECIAL</h3>
                  <p className="text-white/90 text-xs md:text-sm">
                    Extra rewards, exclusive events, community building
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/directory">
            <Card className="bg-mansagold/20 backdrop-blur-lg border border-mansagold/30 hover:bg-mansagold/25 transition-all cursor-pointer">
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <Badge className="bg-mansagold text-mansablue mb-3 md:mb-4">
                    <Users className="mr-1 h-3 w-3" />
                    EXPLORE
                  </Badge>
                  <h3 className="text-mansagold font-semibold text-base md:text-lg mb-2 md:mb-3">BROWSE NOW</h3>
                  <p className="text-white/90 text-xs md:text-sm">
                    Start exploring businesses across 5 cities today
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Phase 1 Metrics Focus */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">We're Measuring Success by Community, Not Revenue</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-mansagold">Business Signups</div>
              <div className="text-sm text-white/80">Growing our network</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-mansagold">Customer Transactions</div>
              <div className="text-sm text-white/80">Economic circulation</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-mansagold">Repeat Usage</div>
              <div className="text-sm text-white/80">Community engagement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;