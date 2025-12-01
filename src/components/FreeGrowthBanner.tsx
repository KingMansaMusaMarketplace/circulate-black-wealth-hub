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
  BarChart3,
  Check
} from 'lucide-react';

const FreeGrowthBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-slate-900 px-6 py-3 text-lg font-bold rounded-full mb-6 inline-flex items-center shadow-lg">
            <Zap className="mr-2 h-5 w-5" />
            PHASE 1: FREE GROWTH - Everything FREE Until Feb 28, 2026!
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent">
            We&apos;re building critical mass first. All features are 100% FREE for everyone - businesses and customers!
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
          <Card className="bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-yellow-400/50 transition-all">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-white">✅ Customers</h3>
              <p className="text-xl font-semibold text-yellow-300 mb-2">ALWAYS FREE</p>
              <p className="text-blue-200 text-sm">(You never pay - ever!)</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-yellow-400/50 transition-all">
            <CardContent className="p-8 text-center">
              <Building2 className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-white">✅ Businesses</h3>
              <p className="text-xl font-semibold text-yellow-300 mb-2">FREE until Feb 28, 2026</p>
              <p className="text-blue-200 text-sm">(Then affordable paid plans start)</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-yellow-400/50 transition-all">
            <CardContent className="p-8 text-center">
              <Heart className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-white">✅ Corporate Sponsors</h3>
              <p className="text-xl font-semibold text-yellow-300 mb-2">Available Now</p>
              <p className="text-blue-200 text-sm">(Support the platform - $500+/mo)</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-8 mb-12 border border-white/10">
          <h3 className="text-2xl font-bold mb-8 text-center text-white">Corporate Sponsorship Tiers</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 text-center border border-white/10 hover:border-yellow-400/30 transition-all">
              <h4 className="text-lg font-bold mb-2 text-white">Bronze Partner</h4>
              <p className="text-3xl font-bold mb-2 text-yellow-400">$500</p>
              <p className="text-sm text-blue-200">per month</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 text-center border border-white/10 hover:border-yellow-400/30 transition-all">
              <h4 className="text-lg font-bold mb-2 text-white">Silver Partner</h4>
              <p className="text-3xl font-bold mb-2 text-yellow-400">$1,500</p>
              <p className="text-sm text-blue-200">per month</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur rounded-xl p-6 text-center border-2 border-yellow-400/50">
              <Badge className="bg-yellow-400 text-gray-900 mb-2">Most Popular</Badge>
              <h4 className="text-lg font-bold mb-2 text-white">Gold Partner</h4>
              <p className="text-3xl font-bold mb-2 text-yellow-300">$5,000</p>
              <p className="text-sm text-blue-200">per month</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 text-center border border-white/10 hover:border-yellow-400/30 transition-all">
              <h4 className="text-lg font-bold mb-2 text-white">Platinum Partner</h4>
              <p className="text-3xl font-bold mb-2 text-yellow-400">$15,000</p>
              <p className="text-sm text-blue-200">per month</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/sponsor-pricing">
              <Button className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-semibold">
                View Full Sponsorship Details
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-8 mb-12 border border-blue-400/30">
          <div className="text-center mb-6">
            <Badge className="bg-blue-500 text-white mb-4">Coming February 28, 2026</Badge>
            <h3 className="text-2xl font-bold mb-2 text-white">Future Business Pricing</h3>
            <p className="text-blue-200 mb-6">
              After the free growth phase, businesses will transition to affordable paid plans
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <Building2 className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-2xl font-bold mb-2 text-white">Business Plan</h4>
              <p className="text-4xl font-bold mb-2 text-yellow-400">$100</p>
              <p className="text-sm text-blue-200 mb-6">per month</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">Premium Business Profile with Verified Badge</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">Unlimited QR Codes for Locations & Promotions</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">Advanced Analytics & Customer Insights</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">Financial Management Tools (P&L, Cash Flow)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">Loyalty Program Management System</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">Customer Review Collection & Showcase</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">Booking & Appointment System with Payments</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">AI Business Coach for Growth Strategies</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">Featured Placement in Search Results</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">Professional Invoice & Expense Tracking</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">Priority Customer Support</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">Community Impact Tracking Dashboard</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-8 mb-12 border border-white/10">
          <h3 className="text-2xl font-bold mb-6 text-center text-white">Our Phase 1 Success Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-yellow-400 mr-2" />
                <Target className="h-6 w-6 text-yellow-400" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">Business Signups</h4>
              <p className="text-blue-200">Growing our network of Black-owned businesses</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-yellow-400 mr-2" />
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">Customer Transactions</h4>
              <p className="text-blue-200">Measuring economic circulation and impact</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-yellow-400 mr-2" />
                <Heart className="h-6 w-6 text-yellow-400" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">Repeat Usage</h4>
              <p className="text-blue-200">Building lasting community engagement</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-xl p-6 inline-block mb-8 border border-white/10">
            <div className="flex items-center text-2xl font-bold mb-2 text-yellow-400">
              <Calendar className="h-6 w-6 mr-2" />
              Free Until February 28, 2026
            </div>
            <p className="text-blue-200">
              Focus on value creation, community building, and sustainable growth
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold py-3 px-8 text-lg rounded-xl">
                Join FREE as Customer
              </Button>
            </Link>
            
            <Link to="/signup?type=business">
              <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900 font-bold py-3 px-8 text-lg rounded-xl">
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