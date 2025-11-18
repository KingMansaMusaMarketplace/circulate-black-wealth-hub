import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Calculator,
  Rocket,
  Star,
  Clock,
  Briefcase,
  Gift,
  ChevronRight
} from 'lucide-react';
const SalesAgentGuidePage: React.FC = () => {
  const navigate = useNavigate();
  const [monthlyReferrals, setMonthlyReferrals] = useState(5);
  const [recruitedAgents, setRecruitedAgents] = useState(2);

  // Calculate potential earnings
  const avgSubscription = 50; // Average monthly subscription
  const baseCommissionRate = 0.10; // 10% starting rate
  const customerEarnings = monthlyReferrals * avgSubscription * baseCommissionRate;
  const recruitmentBonus = recruitedAgents * 75;
  // Team override is 7.5% of recruited agents' commissions (not their sales)
  // Assume each recruited agent gets 3 referrals at 10% commission
  const recruitedAgentsCommissions = recruitedAgents * 3 * avgSubscription * baseCommissionRate;
  const teamOverride = recruitedAgentsCommissions * 0.075;
  const totalMonthly = customerEarnings + teamOverride;
  const totalWithBonus = totalMonthly + recruitmentBonus;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-mansablue-dark via-mansablue to-mansablue-light">
      <Helmet>
        <title>Become a Sales Agent - Mansa Musa Marketplace</title>
        <meta name="description" content="Join the Mansa Musa Marketplace Sales Agent Program. Earn competitive commissions, recruitment bonuses, and team overrides. Build your own sales empire!" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative text-white py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-mansagold/40 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-mansagold/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-white text-mansablue hover:bg-white/90">
              <Star className="w-3 h-3 mr-1" />
              Unlimited Earning Potential
            </Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-mansagold-light to-white">
              Build Your Sales Empire
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90">
              Earn up to 15% commissions + $75 recruitment bonuses + 7.5% team overrides
            </p>
            <p className="text-lg text-blue-200 mb-8 max-w-3xl mx-auto">
              Join the Mansa Musa Marketplace Sales Agent Program and get paid to connect Black-owned businesses with customers who want to support them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-mansagold-dark to-mansagold hover:from-mansagold hover:to-mansagold-light text-mansablue-dark font-bold text-lg px-8 py-6 shadow-xl shadow-mansagold/30 hover:shadow-2xl"
                onClick={() => navigate('/sales-agent-signup')}
              >
                Apply Now <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm border-2 border-white/60 text-white hover:bg-white/30 hover:text-white font-bold text-lg px-8 py-6 transition-all"
                onClick={() => document.getElementById('earnings-calculator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Calculator className="mr-2" />
                Calculate Earnings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Three Revenue Streams */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white via-mansagold-light to-white bg-clip-text text-transparent mb-4">
              Three Ways to Earn
            </h2>
            <p className="text-xl text-white/80">
              Maximize your income with our multi-tier compensation structure
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Business Referrals */}
            <Card className="p-8 !bg-white shadow-2xl border-2 border-mansagold/30 hover:shadow-mansagold/20 transition-all rounded-2xl">
              <div className="bg-gradient-to-br from-mansablue-dark to-mansablue w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Business Referrals</h3>
              <div className="text-4xl font-bold text-mansablue mb-4">10-15%</div>
              <p className="text-foreground/80 mb-6">
                Earn recurring monthly commissions on every business subscription you refer. Rates increase as you grow! (Business sign-ups only, not individual customers)
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Bronze: 10% commission</span>
                </div>
                <div className="flex items-center text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Silver: 11% (20+ referrals)</span>
                </div>
                <div className="flex items-center text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Gold: 12.5% (50+ referrals)</span>
                </div>
                <div className="flex items-center text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Platinum: 15% (100+ referrals)</span>
                </div>
              </div>
            </Card>

            {/* Recruitment Bonuses */}
            <Card className="p-8 bg-white shadow-2xl border-2 border-mansagold/30 hover:shadow-mansagold/20 transition-all rounded-2xl">
              <div className="bg-gradient-to-br from-mansagold-dark to-mansagold w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Gift className="w-8 h-8 text-mansablue-dark" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Recruitment Bonus</h3>
              <div className="text-4xl font-bold text-mansagold mb-4">$75</div>
              <p className="text-foreground/80 mb-6">
                One-time $75 cash bonus paid after your recruited agent makes 3 business sales. Build your team and earn!
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Recruit 5 agents = $375</span>
                </div>
                <div className="flex items-center text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Recruit 10 agents = $750</span>
                </div>
                <div className="flex items-center text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Recruit 20 agents = $1,500</span>
                </div>
              </div>
            </Card>

            {/* Team Override */}
            <Card className="p-8 bg-white/95 backdrop-blur-xl border-2 border-mansablue/20 hover:shadow-2xl hover:shadow-mansablue/20 transition-all rounded-2xl">
              <div className="bg-gradient-to-br from-mansablue-dark to-mansablue w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Team Override</h3>
              <div className="text-4xl font-bold text-mansablue mb-4">7.5%</div>
              <p className="text-gray-600 mb-6">
                Earn 7.5% override on your recruited agents' commissions for 6 months. True passive income!
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Earn on their earned commissions</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>6-month override period</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Compounds as team grows</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section id="earnings-calculator" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-white shadow-2xl border-2 border-mansagold/30 rounded-2xl">
            <div className="text-center mb-8">
              <Calculator className="w-12 h-12 text-mansablue mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-mansablue-dark via-mansablue to-mansablue-light bg-clip-text text-transparent mb-2">
                Calculate Your Potential Earnings
              </h2>
              <p className="text-foreground/70">
                See how much you could earn as a MMM Sales Agent
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Monthly Business Referrals
                </label>
                <Input
                  type="number"
                  min="0"
                  value={monthlyReferrals}
                  onChange={(e) => setMonthlyReferrals(Number(e.target.value))}
                  className="text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Average: 3-10 businesses per month</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Recruited Agents
                </label>
                <Input
                  type="number"
                  min="0"
                  value={recruitedAgents}
                  onChange={(e) => setRecruitedAgents(Number(e.target.value))}
                  className="text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Start small, grow big!</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Business Commissions (Monthly)</span>
                <span className="text-xl font-bold text-mansablue">${customerEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Team Override (Monthly)</span>
                <span className="text-xl font-bold text-purple-600">${teamOverride.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Recruitment Bonuses (One-time)</span>
                <span className="text-xl font-bold text-green-600">${recruitmentBonus.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t-2 border-mansablue">
                <span className="text-lg font-bold text-gray-900">Monthly Recurring Income</span>
                <span className="text-3xl font-bold text-mansablue">${totalMonthly.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">First Month Total (with bonuses)</span>
                <span className="text-xl font-semibold text-green-600">${totalWithBonus.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-4">
                * Assumes $50 average monthly subscription. Actual earnings may vary.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-mansagold-dark to-mansagold hover:from-mansagold hover:to-mansagold-light text-mansablue-dark font-semibold shadow-xl shadow-mansagold/30 hover:shadow-2xl hover:shadow-mansagold/50 transition-all duration-300"
                onClick={() => navigate('/sales-agent-signup')}
              >
                Start Earning Today <ArrowRight className="ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white via-mansagold-light to-white bg-clip-text text-transparent mb-4">
              Real Success Stories
            </h2>
            <p className="text-xl text-white/80">
              See what's possible when you join our program
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-white shadow-xl border-2 border-mansablue/20 hover:shadow-2xl transition-shadow rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-mansablue to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-foreground">Sarah M.</p>
                  <p className="text-sm text-foreground/60">Gold Agent - 6 months</p>
                </div>
              </div>
              <p className="text-foreground/80 mb-4">
                "I started with 5 referrals per month. Now I'm at 60+ and earning $3,750/month in commissions alone. The recruitment bonuses were game-changing!"
              </p>
              <div className="flex items-center text-mansablue font-semibold">
                <TrendingUp className="w-4 h-4 mr-2" />
                $3,750/month recurring
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-xl hover:shadow-2xl transition-shadow rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-mansagold-dark to-mansagold rounded-full flex items-center justify-center text-mansablue-dark font-bold text-xl">
                  M
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-foreground">Marcus J.</p>
                  <p className="text-sm text-foreground/60">Platinum Agent - 1 year</p>
                </div>
              </div>
              <p className="text-foreground/80 mb-4">
                "Building my team was the best decision. I recruited 8 agents and now earn overrides on all their sales. It's true passive income!"
              </p>
              <div className="flex items-center text-mansagold font-semibold">
                <Users className="w-4 h-4 mr-2" />
                $1,200/month from team
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-xl hover:shadow-2xl transition-shadow rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-mansablue-dark to-mansablue rounded-full flex items-center justify-center text-white font-bold text-xl">
                  T
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-foreground">Tamika R.</p>
                  <p className="text-sm text-foreground/60">Silver Agent - 3 months</p>
                </div>
              </div>
              <p className="text-foreground/80 mb-4">
                "Just hit Silver tier! The tiered commission structure motivates me to keep growing. Already planning for Gold!"
              </p>
              <div className="flex items-center text-mansablue font-semibold">
                <Award className="w-4 h-4 mr-2" />
                11% commission rate
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white via-mansagold-light to-white bg-clip-text text-transparent mb-4">
              Simple Application Process
            </h2>
            <p className="text-xl text-white/80">
              Get started in 3 easy steps
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-xl border-l-4 border-mansablue rounded-2xl">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-mansablue-dark to-mansablue text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  1
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-xl font-bold mb-2 text-foreground">Submit Application</h3>
                  <p className="text-foreground/80 mb-3">
                    Fill out our quick application form with your contact info. Takes less than 2 minutes!
                  </p>
                  <div className="flex items-center text-sm text-foreground/60">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>2 minutes</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-xl border-l-4 border-mansagold rounded-2xl">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-mansagold-dark to-mansagold text-mansablue-dark w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  2
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-xl font-bold mb-2 text-foreground">Pass Qualification Test</h3>
                  <p className="text-foreground/80 mb-3">
                    Complete a short test about our platform and Black-owned businesses. Shows you're ready to succeed!
                  </p>
                  <div className="flex items-center text-sm text-foreground/60">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>15 minutes</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-xl border-l-4 border-mansablue rounded-2xl">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-mansablue-dark to-mansablue text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  3
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-xl font-bold mb-2 text-foreground">Get Approved & Start Earning</h3>
                  <p className="text-foreground/80 mb-3">
                    Once approved, you'll get your unique referral code and access to your agent dashboard. Start earning immediately!
                  </p>
                  <div className="flex items-center text-sm text-foreground/60">
                    <Rocket className="w-4 h-4 mr-2" />
                    <span>Same day approval</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-10 text-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-mansablue-dark to-mansablue hover:from-mansablue hover:to-mansablue-light text-white text-lg px-10 py-6 font-bold shadow-xl shadow-mansablue/30 hover:shadow-2xl"
              onClick={() => navigate('/sales-agent-signup')}
            >
              Start Your Application <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white via-mansagold-light to-white bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-white shadow-xl border-2 border-mansagold/20 rounded-2xl">
              <h3 className="text-lg font-bold mb-2 text-foreground">How do I get paid?</h3>
              <p className="text-foreground/80">
                Commissions are paid monthly via direct deposit or PayPal. You'll receive payment for all approved commissions from the previous month.
              </p>
            </Card>

            <Card className="p-6 bg-white shadow-xl border-2 border-mansagold/20 rounded-2xl">
              <h3 className="text-lg font-bold mb-2 text-foreground">Is there a monthly fee?</h3>
              <p className="text-foreground/80">
                No! There are zero fees to become a sales agent. We only succeed when you succeed.
              </p>
            </Card>

            <Card className="p-6 bg-white shadow-xl border-2 border-mansagold/20 rounded-2xl">
              <h3 className="text-lg font-bold mb-2 text-foreground">How long do I earn commissions?</h3>
              <p className="text-foreground/80">
                You earn recurring commissions for TWO YEARS on every business referral. That's 24 months of passive income from each business you refer! Note: Commissions are only for business sign-ups, not individual customers.
              </p>
            </Card>

            <Card className="p-6 bg-white shadow-xl border-2 border-mansagold/20 rounded-2xl">
              <h3 className="text-lg font-bold mb-2 text-foreground">Can I recruit other agents?</h3>
              <p className="text-foreground/80">
                Absolutely! You'll earn a $75 bonus for each approved agent you recruit who gets 3 sales, plus 7.5% override on their commissions for 6 months.
              </p>
            </Card>

            <Card className="p-6 bg-white shadow-xl border-2 border-mansagold/20 rounded-2xl">
              <h3 className="text-lg font-bold mb-2 text-foreground">What support do I get?</h3>
              <p className="text-foreground/80">
                You'll get access to marketing materials, training resources, and a dedicated agent dashboard. Plus ongoing support from our team!
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-mansagold-dark via-mansagold to-mansagold-light text-mansablue-dark">
        <div className="max-w-4xl mx-auto text-center">
          <Rocket className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Sales Empire?
          </h2>
          <p className="text-xl mb-8 text-mansablue-dark/90">
            Join hundreds of agents already earning with Mansa Musa Marketplace
          </p>
          <Button 
            size="lg" 
            className="bg-white text-mansablue-dark hover:bg-white/90 font-bold text-xl px-12 py-8 shadow-xl"
            onClick={() => navigate('/sales-agent-signup')}
          >
            Apply Now - It's Free! <ArrowRight className="ml-3" />
          </Button>
          <p className="mt-6 text-blue-200">
            No fees. No quotas. Just unlimited earning potential.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SalesAgentGuidePage;
