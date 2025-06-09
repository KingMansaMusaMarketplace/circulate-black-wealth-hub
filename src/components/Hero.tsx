
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
      <div className="relative container mx-auto px-4 py-16">
        {/* Subscription Badges - Desktop Layout */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          <Badge className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-full">
            <Star className="mr-3 h-5 w-5" />
            Start FREE
          </Badge>
          <Badge className="bg-mansagold hover:bg-mansagold-dark text-mansablue px-8 py-4 text-lg font-semibold rounded-full">
            <Crown className="mr-3 h-5 w-5" />
            Premium $10/month
          </Badge>
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-full">
            <GraduationCap className="mr-3 h-5 w-5" />
            FREE Premium for HBCU
          </Badge>
        </div>

        {/* Main Content - Desktop Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Column - Text Content */}
          <div className="text-white">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
              Save Money &{' '}
              <br />
              Support{' '}
              <span className="text-mansagold">Black-Owned Businesses</span>
            </h1>
            
            <p className="text-2xl lg:text-3xl text-white/90 leading-relaxed mb-8">
              Start FREE - Get 10% - 20% discounts while building community wealth!
            </p>
            
            <p className="text-xl text-white/80 leading-relaxed mb-12">
              Join thousands of customers discovering amazing businesses and making every 
              purchase count toward building generational wealth.
            </p>

            {/* CTA Buttons - Desktop */}
            <div className="flex gap-6 mb-8">
              <Link to="/signup">
                <Button className="bg-mansagold hover:bg-mansagold/90 text-mansablue font-bold py-4 px-8 text-xl rounded-xl">
                  Start FREE Today
                </Button>
              </Link>
              
              <Link to="/directory">
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-mansablue font-semibold py-4 px-8 text-xl rounded-xl"
                >
                  Browse Directory
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Business Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-lg">
              <img 
                src="/lovable-uploads/b85e3c26-f651-49bd-9e25-c036ba533bd3.png" 
                alt="Professional business women working together"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Subscription Plans - Desktop Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Free Membership */}
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all">
            <CardContent className="p-6">
              <div className="text-center">
                <Badge variant="secondary" className="bg-green-500/20 text-green-100 mb-4">
                  FREE
                </Badge>
                <h3 className="text-green-100 font-semibold text-lg mb-3">FREE MEMBERSHIP</h3>
                <p className="text-white/90 text-sm">Browse directory, discover businesses, view profiles</p>
              </div>
            </CardContent>
          </Card>

          {/* Premium Membership */}
          <Card className="bg-mansagold/20 backdrop-blur-lg border border-mansagold/30 hover:bg-mansagold/25 transition-all">
            <CardContent className="p-6">
              <div className="text-center">
                <Badge className="bg-mansagold text-mansablue mb-4">
                  <Crown className="mr-1 h-3 w-3" />
                  $10
                </Badge>
                <h3 className="text-mansagold font-semibold text-lg mb-3">PREMIUM</h3>
                <p className="text-white/90 text-sm">
                  Get 10% - 20% discounts, earn points, redeem rewards, exclusive deals
                </p>
              </div>
            </CardContent>
          </Card>

          {/* HBCU Students & Staff */}
          <Card className="bg-blue-500/20 backdrop-blur-lg border border-blue-400/30 hover:bg-blue-500/25 transition-all">
            <CardContent className="p-6">
              <div className="text-center">
                <Badge className="bg-blue-500 text-white mb-4">
                  <GraduationCap className="mr-1 h-3 w-3" />
                  🎓
                </Badge>
                <h3 className="text-blue-200 font-semibold text-lg mb-3">HBCU STUDENTS</h3>
                <p className="text-white/90 text-sm mb-2">Get ALL Premium features FREE!</p>
                <p className="text-blue-200 text-xs">Upload student ID during signup</p>
              </div>
            </CardContent>
          </Card>

          {/* Business Owners */}
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all">
            <CardContent className="p-6">
              <div className="text-center">
                <Badge className="bg-mansagold/80 text-mansablue mb-4">
                  <Building2 className="mr-1 h-3 w-3" />
                  👥
                </Badge>
                <h3 className="text-mansagold font-semibold text-lg mb-3">BUSINESS OWNERS</h3>
                <p className="text-white/90 text-sm mb-1">First month FREE!</p>
                <p className="text-white/80 text-xs">$100/month after trial</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
