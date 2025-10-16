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
            PHASE 1: FREE GROWTH STRATEGY
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Community First, Revenue Later
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8">
            Customers ALWAYS free. Businesses FREE until January 2026. 
            Join the movement to strengthen Black economic power!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6 text-center">
              <Building2 className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Businesses</h3>
              <p className="text-white/80">FREE until Jan 2026 - All premium features included</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Customers</h3>
              <p className="text-white/80">ALWAYS FREE - Loyalty programs, QR scanning, rewards</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Growth Focus</h3>
              <p className="text-white/80">Engagement metrics, not revenue targets</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-white/80">Building relationships before monetization</p>
            </CardContent>
          </Card>
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