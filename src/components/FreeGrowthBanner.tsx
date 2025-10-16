import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Heart, 
  Zap, 
  Target,
  Calendar,
  BarChart3
} from 'lucide-react';

const FreeGrowthBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-green-500 via-green-600 to-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-white text-green-600 px-6 py-3 text-lg font-bold rounded-full mb-6 inline-flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            PHASE 1: FREE GROWTH - Everything FREE Until Jan 2026!
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            We&apos;re building critical mass first. All features are 100% FREE for everyone - businesses and customers!
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-2 border-white/30">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">✅ Customers</h3>
              <p className="text-xl font-semibold text-white mb-2">ALWAYS FREE</p>
              <p className="text-white/80 text-sm">(You never pay - ever!)</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-2 border-white/30">
            <CardContent className="p-8 text-center">
              <Building2 className="h-16 w-16 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">✅ Businesses</h3>
              <p className="text-xl font-semibold text-white mb-2">FREE until Jan 2026</p>
              <p className="text-white/80 text-sm">(Then affordable paid plans start)</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-2 border-white/30">
            <CardContent className="p-8 text-center">
              <Heart className="h-16 w-16 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">✅ Corporate Sponsors</h3>
              <p className="text-xl font-semibold text-white mb-2">Available Now</p>
              <p className="text-white/80 text-sm">(Support the platform - $500+/mo)</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold mb-8 text-center">Corporate Sponsorship Tiers</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white/5 rounded-xl p-6 text-center border border-white/20">
              <h4 className="text-lg font-bold mb-2">Bronze Partner</h4>
              <p className="text-3xl font-bold mb-2">$500</p>
              <p className="text-sm text-white/70">per month</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 text-center border border-white/20">
              <h4 className="text-lg font-bold mb-2">Silver Partner</h4>
              <p className="text-3xl font-bold mb-2">$1,500</p>
              <p className="text-sm text-white/70">per month</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-xl p-6 text-center border-2 border-yellow-400/50">
              <Badge className="bg-yellow-400 text-gray-900 mb-2">Most Popular</Badge>
              <h4 className="text-lg font-bold mb-2">Gold Partner</h4>
              <p className="text-3xl font-bold mb-2">$5,000</p>
              <p className="text-sm text-white/70">per month</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 text-center border border-white/20">
              <h4 className="text-lg font-bold mb-2">Platinum Partner</h4>
              <p className="text-3xl font-bold mb-2">$15,000</p>
              <p className="text-sm text-white/70">per month</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/sponsor-pricing">
              <Button className="bg-white text-green-600 hover:bg-white/90 font-semibold">
                View Full Sponsorship Details
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-8 mb-12 border-2 border-blue-400/30">
          <div className="text-center mb-6">
            <Badge className="bg-blue-400 text-gray-900 mb-4">Coming January 2026</Badge>
            <h3 className="text-2xl font-bold mb-2">Future Business Pricing</h3>
            <p className="text-white/80 mb-6">
              After the free growth phase, businesses will transition to affordable paid plans
            </p>
          </div>
          
          <div className="max-w-md mx-auto bg-white/10 rounded-xl p-6 text-center border border-white/20">
            <Building2 className="h-12 w-12 text-white mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Business Plan</h4>
            <p className="text-4xl font-bold mb-2">$100</p>
            <p className="text-sm text-white/70 mb-4">per month</p>
            <p className="text-sm text-white/80">
              Full access to loyalty programs, QR codes, analytics, and customer engagement tools
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">Our Phase 1 Success Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-white mr-2" />
                <Target className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Business Signups</h4>
              <p className="text-white/80">Growing our network of Black-owned businesses</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-white mr-2" />
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Customer Transactions</h4>
              <p className="text-white/80">Measuring economic circulation and impact</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white mr-2" />
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Repeat Usage</h4>
              <p className="text-white/80">Building lasting community engagement</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 inline-block mb-8">
            <div className="flex items-center text-2xl font-bold mb-2">
              <Calendar className="h-6 w-6 mr-2" />
              Free Until January 2026
            </div>
            <p className="text-white/80">
              Focus on value creation, community building, and sustainable growth
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="bg-white text-green-600 hover:bg-white/90 font-bold py-3 px-8 text-lg rounded-xl">
                Join FREE as Customer
              </Button>
            </Link>
            
            <Link to="/signup?type=business">
              <Button variant="outline" className="border-mansagold text-mansagold hover:bg-mansagold hover:text-white font-bold py-3 px-8 text-lg rounded-xl">
                Join FREE as Business
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeGrowthBanner;