import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  DollarSign, 
  Target, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Calculator,
  Rocket,
  Star,
  MapPin,
  Megaphone,
  TrendingUp,
  Gift,
  Zap,
  Heart,
  Building2,
  Handshake,
  Crown
} from 'lucide-react';

const MansaAmbassadorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [businessesPerMonth, setBusinessesPerMonth] = useState(5);
  const [teamSize, setTeamSize] = useState(3);

  // Calculate potential earnings
  const avgSubscription = 50;
  const baseCommissionRate = 0.10;
  const directCommissions = businessesPerMonth * avgSubscription * baseCommissionRate;
  const recruitmentBonus = teamSize * 75;
  const teamOverride = teamSize * 3 * avgSubscription * baseCommissionRate * 0.075;
  const totalMonthly = directCommissions + teamOverride;

  const ambassadorBenefits = [
    {
      icon: DollarSign,
      title: '10-15% Commission',
      description: 'Earn recurring monthly commissions on every business you bring to the platform',
      highlight: 'Recurring income'
    },
    {
      icon: Gift,
      title: '$75 Recruitment Bonus',
      description: 'Get paid for every new ambassador you recruit after they make 3 sales',
      highlight: 'One-time bonus'
    },
    {
      icon: Users,
      title: '7.5% Team Override',
      description: 'Earn from your team members\' commissions for 6 months',
      highlight: 'Passive income'
    },
    {
      icon: Megaphone,
      title: 'Marketing Materials',
      description: 'Access to professional flyers, business cards, and digital assets',
      highlight: 'Free resources'
    },
    {
      icon: Award,
      title: 'Recognition & Badges',
      description: 'Earn badges and climb tiers: Bronze → Silver → Gold → Platinum',
      highlight: 'Status rewards'
    },
    {
      icon: Rocket,
      title: 'Exclusive Training',
      description: 'Access to sales training, webinars, and community support',
      highlight: 'Skill building'
    }
  ];

  const launchCities = [
    { city: 'Atlanta, GA', status: 'Recruiting', spots: 50 },
    { city: 'Washington, DC', status: 'Recruiting', spots: 40 },
    { city: 'Houston, TX', status: 'Coming Soon', spots: 45 },
    { city: 'Chicago, IL', status: 'Coming Soon', spots: 40 },
    { city: 'New York, NY', status: 'Coming Soon', spots: 60 },
    { city: 'Los Angeles, CA', status: 'Coming Soon', spots: 55 }
  ];

  const steps = [
    { step: 1, title: 'Apply Online', description: 'Complete the short application form (5 minutes)', icon: Rocket },
    { step: 2, title: 'Get Approved', description: 'Our team reviews and approves within 48 hours', icon: CheckCircle },
    { step: 3, title: 'Complete Training', description: 'Access our ambassador training portal', icon: Award },
    { step: 4, title: 'Start Earning', description: 'Begin connecting businesses and earning commissions', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-mansablue-dark via-mansablue to-mansablue-light">
      <Helmet>
        <title>Mansa Ambassadors Program - Join the Movement | Mansa Musa Marketplace</title>
        <meta name="description" content="Become a Mansa Ambassador and earn while empowering Black-owned businesses. 10-15% commissions, $75 recruitment bonuses, and 7.5% team overrides." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-mansagold/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-mansagold/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-mansagold text-mansablue-dark font-bold text-sm px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              Now Recruiting: First 100 Ambassadors
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-white">Become a</span>
              <br />
              <span className="bg-gradient-to-r from-mansagold via-mansagold-light to-mansagold bg-clip-text text-transparent">
                Mansa Ambassador
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
              Earn money while building the largest Black business network in your city
            </p>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Join the grassroots movement connecting Black-owned businesses with customers who want to support them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-mansagold-dark to-mansagold hover:from-mansagold hover:to-mansagold-light text-mansablue-dark font-bold text-lg px-10 py-6 shadow-xl shadow-mansagold/30"
                onClick={() => navigate('/sales-agent-signup')}
              >
                Apply Now <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white/60 text-white hover:bg-white/10 font-bold text-lg px-8 py-6"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How It Works
              </Button>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { value: '$75', label: 'Per Recruit', icon: Gift },
              { value: '15%', label: 'Max Commission', icon: TrendingUp },
              { value: '7.5%', label: 'Team Override', icon: Users },
              { value: '∞', label: 'Earning Potential', icon: Zap }
            ].map((stat, i) => (
              <Card key={i} className="p-5 bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <stat.icon className="w-7 h-7 text-mansagold mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Become an <span className="text-mansagold">Ambassador</span>?
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              More than a side hustle — it's a mission to strengthen Black economic power
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ambassadorBenefits.map((benefit, i) => (
              <Card key={i} className="p-6 bg-white shadow-xl hover:shadow-2xl transition-all rounded-2xl border-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-mansablue to-mansablue-dark rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Badge className="mb-2 bg-mansagold/10 text-mansagold border-mansagold/20 text-xs">
                      {benefit.highlight}
                    </Badge>
                    <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-foreground/70 text-sm">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-white shadow-2xl rounded-2xl">
            <div className="text-center mb-8">
              <Calculator className="w-12 h-12 text-mansablue mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Calculate Your Earnings
              </h2>
              <p className="text-foreground/70">
                See what you could earn as a Mansa Ambassador
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Businesses You Sign Up Monthly
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={businessesPerMonth}
                  onChange={(e) => setBusinessesPerMonth(Number(e.target.value))}
                  className="text-lg"
                />
                <p className="text-xs text-foreground/50 mt-1">Average ambassador: 3-10/month</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Ambassadors You Recruit
                </label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="text-lg"
                />
                <p className="text-xs text-foreground/50 mt-1">Build your team for passive income</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-mansablue/5 to-mansagold/5 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-foreground/10">
                <span className="text-foreground/70">Direct Commissions (Monthly)</span>
                <span className="text-xl font-bold text-mansablue">${directCommissions.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-foreground/10">
                <span className="text-foreground/70">Team Override (Monthly)</span>
                <span className="text-xl font-bold text-purple-600">${teamOverride.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-foreground/10">
                <span className="text-foreground/70">Recruitment Bonuses (One-time)</span>
                <span className="text-xl font-bold text-green-600">${recruitmentBonus.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t-2 border-mansablue">
                <span className="text-lg font-bold text-foreground">Recurring Monthly Income</span>
                <span className="text-3xl font-bold text-mansablue">${totalMonthly.toFixed(0)}/mo</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-mansagold-dark to-mansagold hover:from-mansagold hover:to-mansagold-light text-mansablue-dark font-bold shadow-xl"
                onClick={() => navigate('/sales-agent-signup')}
              >
                Start Earning Today <ArrowRight className="ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Launch Cities */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <MapPin className="inline w-10 h-10 mr-3 text-mansagold" />
              Launch <span className="text-mansagold">Cities</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              We're building the network city by city. Claim your spot in your hometown.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {launchCities.map((city, i) => (
              <Card 
                key={i} 
                className={`p-6 transition-all ${
                  city.status === 'Recruiting' 
                    ? 'bg-white border-2 border-mansagold shadow-lg hover:shadow-xl' 
                    : 'bg-white/80 border border-foreground/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-5 h-5 ${city.status === 'Recruiting' ? 'text-mansagold' : 'text-foreground/40'}`} />
                    <span className="font-bold text-foreground">{city.city}</span>
                  </div>
                  <Badge className={`${
                    city.status === 'Recruiting' 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-foreground/5 text-foreground/50 border-foreground/10'
                  }`}>
                    {city.status}
                  </Badge>
                </div>
                <div className="mt-3 text-sm text-foreground/60">
                  {city.spots} ambassador spots available
                </div>
                {city.status === 'Recruiting' && (
                  <Button 
                    size="sm" 
                    className="mt-4 w-full bg-mansablue hover:bg-mansablue-dark text-white"
                    onClick={() => navigate('/sales-agent-signup')}
                  >
                    Apply for {city.city.split(',')[0]}
                  </Button>
                )}
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-white/60">
              Don't see your city? <span className="text-mansagold font-medium">Apply anyway</span> — we're expanding rapidly!
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It <span className="text-mansagold">Works</span>
            </h2>
            <p className="text-xl text-white/70">
              From application to earning in 4 simple steps
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <Card key={i} className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-mansablue to-mansablue-dark rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-foreground/70">{step.description}</p>
                  </div>
                  <step.icon className="w-8 h-8 text-mansagold hidden md:block" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Mission */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-10 bg-white border-2 border-mansagold/30 rounded-2xl shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                More Than Money — It's a Mission
              </h2>
              <p className="text-xl text-foreground/80 mb-8 leading-relaxed max-w-3xl mx-auto">
                Every business you onboard strengthens the Black economic ecosystem. You're not just earning commissions — you're building <span className="text-mansagold font-bold">generational wealth infrastructure</span> in your community.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-foreground/10">
                <div className="p-4 bg-mansablue/5 rounded-xl">
                  <Building2 className="w-8 h-8 text-mansablue mx-auto mb-2" />
                  <div className="text-foreground font-semibold">Support Businesses</div>
                </div>
                <div className="p-4 bg-mansagold/10 rounded-xl">
                  <Handshake className="w-8 h-8 text-mansagold-dark mx-auto mb-2" />
                  <div className="text-foreground font-semibold">Build Community</div>
                </div>
                <div className="p-4 bg-green-500/10 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-foreground font-semibold">Create Wealth</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 text-sm px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            Limited Spots Available in Each City
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join the <span className="text-mansagold">Movement</span>?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Apply now and become one of the founding Mansa Ambassadors in your city.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-mansagold-dark to-mansagold hover:from-mansagold hover:to-mansagold-light text-mansablue-dark font-bold text-xl px-12 py-7 shadow-2xl shadow-mansagold/40"
            onClick={() => navigate('/sales-agent-signup')}
          >
            Apply to Become an Ambassador <ArrowRight className="ml-3" />
          </Button>
          <p className="mt-6 text-white/50 text-sm">
            Free to join • No upfront costs • Start earning immediately
          </p>
        </div>
      </section>
    </div>
  );
};

export default MansaAmbassadorsPage;
