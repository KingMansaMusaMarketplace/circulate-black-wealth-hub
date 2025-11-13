import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/audio-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, GraduationCap, Building2, Users, TrendingUp, Shield, QrCode, BarChart3, CheckCircle, Zap, Heart, Volume2 } from 'lucide-react';
import { getAudioPath } from '@/utils/audio';
import ScrollReveal from '@/components/animations/ScrollReveal';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue overflow-hidden min-h-screen">
      {/* Enhanced Background with Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzZ6TTM2IDM4djJoMnYtMnptLTIgMHYyaDJ2LTJ6bTAgMnYyaDJ2LTJ6bS0yLTJ2Mmgydi0yem0wIDJ2Mmgydi0yem0tMi0ydjJoMnYtMnptMCAydjJoMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
      <div className="relative container mx-auto px-4 py-16 md:py-20 lg:py-24">
        {/* Phase 1 Free Growth Banner */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-green text-white px-6 py-3 text-lg font-bold rounded-full mb-4 animate-pulse-green badge-shimmer">
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
            <Badge className="bg-gradient-green text-white px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full cursor-pointer animate-pulse-green badge-shimmer">
              <Star className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
              100% FREE - All Customer Features
            </Badge>
          </Link>
          <Link to="/signup?type=business">
            <Badge className="bg-gradient-blue text-white px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full cursor-pointer animate-pulse-blue badge-shimmer">
              <Building2 className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
              100% FREE - All Business Features
            </Badge>
          </Link>
          <Link to="/become-a-sales-agent">
            <Badge className="bg-gradient-sales text-white px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full cursor-pointer animate-pulse-ios badge-shimmer">
              <TrendingUp className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
              Earn as Sales Agent - Up to 15%!
            </Badge>
          </Link>
          <Link to="/signup">
            <Badge className="bg-gradient-purple text-white px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full cursor-pointer animate-pulse-purple badge-shimmer">
              <Heart className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
              Community First, Revenue Later
            </Badge>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <ScrollReveal delay={0.1}>
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-[1.1] tracking-tight mb-8 md:mb-10">
              Save Money &{' '}
              <br className="hidden sm:block" />
              Support{' '}
              <span className="bg-gradient-gold bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]">Black-Owned Businesses</span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/95 leading-relaxed mb-8 md:mb-10 font-body font-medium animate-fade-in [animation-delay:200ms]">
              Get 5% - 30% discounts while building community wealth!
            </p>
            
            <div className="glass-card bg-green-500/10 border-green-400/20 rounded-2xl p-6 mb-8 animate-scale-in [animation-delay:400ms] shadow-xl">
              <p className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed font-body">
                <strong className="text-green-300 font-bold">FREE FOR EVERYONE:</strong> Join thousands of customers and businesses 
                building economic power together. No subscriptions, no fees, just community wealth creation!
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-5 mb-10 w-full animate-fade-in [animation-delay:600ms]">
              <Link to="/signup" className="w-full sm:w-auto" style={{ touchAction: 'manipulation' }}>
                <Button 
                  size="lg"
                  className="gradient-gold text-mansablue-dark font-bold text-base sm:text-lg md:text-xl rounded-2xl w-full sm:w-auto leading-tight cursor-pointer shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] border-2 border-mansagold-light/20"
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
              
              <div className="flex flex-col sm:flex-row gap-5 w-full">
                <AudioButton
                  audioSrc={getAudioPath('blueprint')}
                  variant="red"
                  className="py-4 px-8 text-lg rounded-2xl w-full sm:w-auto whitespace-nowrap cursor-pointer shadow-lg hover:shadow-xl"
                >
                  <Volume2 className="mr-2 h-5 w-5" />
                  Hear Our Blueprint
                </AudioButton>
                
                <Link to="/directory" className="w-full sm:w-auto" style={{ touchAction: 'manipulation' }}>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="text-lg rounded-2xl w-full sm:w-auto whitespace-nowrap border-mansagold/50 text-mansagold hover:bg-mansagold hover:text-mansablue-dark cursor-pointer backdrop-blur-sm"
                    style={{ touchAction: 'manipulation' }}
                  >
                    Browse Directory
                  </Button>
                </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} y={50}>
            <div className="flex justify-center lg:justify-end">
            <div className="relative max-w-lg w-full">
              {/* Glow effect behind image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-mansagold/20 via-transparent to-blue-500/20 rounded-3xl blur-2xl"></div>
              
              <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] ring-2 ring-white/10">
                <img 
                  src="/lovable-uploads/487f9aac-a3ad-4b28-8d90-3fd25a3a689b.png" 
                  alt="Professional business woman working on laptop"
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay with key benefits */}
                <div className="absolute bottom-0 left-0 right-0 glass-card bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8">
                  <div className="text-white space-y-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-6 w-6 text-green-400 mr-3" />
                      <span className="text-base font-semibold font-body">5% - 30% Discounts</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Star className="h-6 w-6 text-green-400 mr-3" />
                      <span className="text-base font-semibold font-body">100% FREE</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Shield className="h-6 w-6 text-blue-400 mr-3" />
                      <span className="text-base font-semibold font-body">Community First</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Updated Plan Cards Grid - All Free */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
          <ScrollReveal delay={0.1}>
            <Link to="/signup">
              <Card className="glass-card bg-green-500/15 border-green-400/30 hover:bg-green-500/25 transition-all cursor-pointer hover:scale-[1.03] hover:shadow-xl group">
              <CardContent className="p-6 md:p-8">
                <div className="text-center">
                  <Badge className="bg-green-500 text-white mb-4 shadow-md">
                    <CheckCircle className="mr-1.5 h-4 w-4" />
                    100% FREE
                  </Badge>
                  <h3 className="text-green-100 font-bold text-lg md:text-xl mb-3 font-display tracking-tight">CUSTOMERS</h3>
                  <p className="text-white/90 text-sm md:text-base font-body leading-relaxed">
                    Browse directory, get discounts, earn loyalty points, redeem rewards
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <Link to="/signup?type=business">
              <Card className="glass-card bg-blue-500/15 border-blue-400/30 hover:bg-blue-500/25 transition-all cursor-pointer hover:scale-[1.03] hover:shadow-xl group">
              <CardContent className="p-6 md:p-8">
                <div className="text-center">
                  <Badge className="bg-blue-500 text-white mb-4 shadow-md">
                    <Building2 className="mr-1.5 h-4 w-4" />
                    100% FREE
                  </Badge>
                  <h3 className="text-blue-200 font-bold text-lg md:text-xl mb-3 font-display tracking-tight">BUSINESSES</h3>
                  <p className="text-white/90 text-sm md:text-base font-body leading-relaxed">
                    Unlimited QR codes, analytics, customer management, promotions
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <Link to="/signup">
              <Card className="glass-card bg-purple-500/15 border-purple-400/30 hover:bg-purple-500/25 transition-all cursor-pointer hover:scale-[1.03] hover:shadow-xl group">
              <CardContent className="p-6 md:p-8">
                <div className="text-center">
                  <Badge className="bg-purple-500 text-white mb-4 shadow-md">
                    <GraduationCap className="mr-1.5 h-4 w-4" />
                    STUDENTS
                  </Badge>
                  <h3 className="text-purple-200 font-bold text-lg md:text-xl mb-3 font-display tracking-tight">HBCU SPECIAL</h3>
                  <p className="text-white/90 text-sm md:text-base font-body leading-relaxed">
                    Extra rewards, exclusive events, community building
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <Link to="/directory">
              <Card className="glass-card bg-mansagold/15 border-mansagold/30 hover:bg-mansagold/25 transition-all cursor-pointer hover:scale-[1.03] hover:shadow-xl group">
              <CardContent className="p-6 md:p-8">
                <div className="text-center">
                  <Badge className="gradient-gold text-mansablue-dark mb-4 shadow-md">
                    <Users className="mr-1.5 h-4 w-4" />
                    EXPLORE
                  </Badge>
                  <h3 className="text-mansagold font-bold text-lg md:text-xl mb-3 font-display tracking-tight">BROWSE NOW</h3>
                  <p className="text-white/90 text-sm md:text-base font-body leading-relaxed">
                    Start exploring businesses across 5 cities today
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          </ScrollReveal>
        </div>

        {/* Phase 1 Metrics Focus */}
        <div className="mt-24 text-center">
          <ScrollReveal delay={0.2}>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 font-display">We're Measuring Success by Community, Not Revenue</h3>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ScrollReveal delay={0.3}>
              <div className="glass-card bg-white/10 rounded-2xl p-8 hover:scale-105 transition-transform">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-2">Business Signups</div>
                <div className="text-base text-white/90 font-body">Growing our network</div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <div className="glass-card bg-white/10 rounded-2xl p-8 hover:scale-105 transition-transform">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-2">Customer Transactions</div>
                <div className="text-base text-white/90 font-body">Economic circulation</div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.5}>
              <div className="glass-card bg-white/10 rounded-2xl p-8 hover:scale-105 transition-transform">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-2">Repeat Usage</div>
                <div className="text-base text-white/90 font-body">Community engagement</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;