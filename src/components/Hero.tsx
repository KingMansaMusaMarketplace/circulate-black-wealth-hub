
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, GraduationCap, Building2 } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-8">
        {/* Subscription Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Badge className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-base font-semibold rounded-full">
            <Star className="mr-2 h-4 w-4" />
            Start FREE
          </Badge>
          <Badge className="bg-mansagold hover:bg-mansagold-dark text-mansablue px-6 py-3 text-base font-semibold rounded-full">
            <Crown className="mr-2 h-4 w-4" />
            Premium $10/month
          </Badge>
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-base font-semibold rounded-full">
            <GraduationCap className="mr-2 h-4 w-4" />
            FREE Premium for HBCU
          </Badge>
        </div>

        {/* Main Heading */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Save Money &{' '}
            <br className="hidden md:block" />
            Support{' '}
            <span className="text-mansagold">Black-Owned Businesses</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-4">
            Start FREE - Get 10% - 20% discounts while building community wealth!
          </p>
          
          <p className="text-lg text-white/80 max-w-4xl mx-auto">
            Join thousands of customers discovering amazing businesses and making every 
            purchase count toward building generational wealth.
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="space-y-4 max-w-2xl mx-auto mb-8">
          {/* Free Membership */}
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <Badge variant="secondary" className="bg-green-500/20 text-green-100 mr-3">
                      FREE
                    </Badge>
                    <span className="text-green-100 font-semibold text-lg">FREE MEMBERSHIP:</span>
                  </div>
                  <p className="text-white/90">Browse directory, discover businesses, view profiles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Membership */}
          <Card className="bg-mansagold/20 backdrop-blur-lg border border-mansagold/30 hover:bg-mansagold/25 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Badge className="bg-mansagold text-mansablue mr-3">
                      <Crown className="mr-1 h-3 w-3" />
                      $
                    </Badge>
                    <span className="text-mansagold font-semibold text-lg">PREMIUM ($10/month):</span>
                  </div>
                  <p className="text-white/90">
                    Get 10% - 20% discounts, earn points, redeem rewards, 
                    exclusive deals, premium support, mentorship access, advanced networking
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HBCU Students & Staff */}
          <Card className="bg-blue-500/20 backdrop-blur-lg border border-blue-400/30 hover:bg-blue-500/25 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Badge className="bg-blue-500 text-white mr-3">
                      <GraduationCap className="mr-1 h-3 w-3" />
                      🎓
                    </Badge>
                    <span className="text-blue-200 font-semibold text-lg">HBCU STUDENTS & STAFF:</span>
                  </div>
                  <p className="text-white/90 mb-2">Get ALL Premium features FREE with verification!</p>
                  <p className="text-blue-200 text-sm">Upload student ID or staff credentials during signup</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Owners */}
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Badge className="bg-mansagold/80 text-mansablue mr-3">
                      <Building2 className="mr-1 h-3 w-3" />
                      👥
                    </Badge>
                    <span className="text-mansagold font-semibold text-lg">BUSINESS OWNERS:</span>
                  </div>
                  <p className="text-white/90 mb-1">First month FREE!</p>
                  <p className="text-white/80 text-sm">Connect with loyal customers</p>
                  <p className="text-white/80 text-sm">$100/month after trial period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 max-w-md mx-auto">
          <Link to="/signup" className="block">
            <Button className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue font-bold py-4 text-lg rounded-xl">
              Start FREE Today
            </Button>
          </Link>
          
          <Link to="/directory" className="block">
            <Button 
              variant="outline" 
              className="w-full border-white text-white hover:bg-white hover:text-mansablue font-semibold py-4 text-lg rounded-xl"
            >
              Browse Directory
            </Button>
          </Link>
        </div>

        {/* Business Image at Bottom */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            <img 
              src="/lovable-uploads/b85e3c26-f651-49bd-9e25-c036ba533bd3.png" 
              alt="Professional business women working together"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
