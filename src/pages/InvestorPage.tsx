import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  TrendingUp, 
  Users, 
  Building2, 
  DollarSign, 
  Shield,
  Zap,
  BarChart3,
  Lock,
  Network,
  Wallet,
  Brain,
  ArrowRight,
  CheckCircle,
  Globe,
  Layers,
  Target
} from 'lucide-react';

const InvestorPage: React.FC = () => {
  const dataMetrics = [
    { 
      icon: Building2, 
      label: 'Business Profiles', 
      description: 'Complete business intelligence including financials, transactions, and growth metrics',
      color: 'mansablue'
    },
    { 
      icon: Wallet, 
      label: 'Transaction Ledger', 
      description: 'Real-time invoicing, expenses, and cash flow data from businesses on the platform',
      color: 'mansagold'
    },
    { 
      icon: Network, 
      label: 'Supply Chain Graph', 
      description: 'B2B connections mapping the economic relationships within the Black business ecosystem',
      color: 'purple'
    },
    { 
      icon: Brain, 
      label: 'Behavioral Intelligence', 
      description: 'AI-powered recommendations and sentiment analysis on consumer and business behavior',
      color: 'green'
    }
  ];

  const competitiveEdge = [
    {
      feature: 'Full Accounting Suite',
      us: true,
      competitors: false,
      description: "We're their QuickBooks, not just their Yelp"
    },
    {
      feature: 'AI-Powered Matching',
      us: true,
      competitors: false,
      description: 'Proactive recommendations, not passive search'
    },
    {
      feature: 'B2B Marketplace',
      us: true,
      competitors: false,
      description: 'We capture the wholesale supply chain'
    },
    {
      feature: 'Agent Referral Network',
      us: true,
      competitors: false,
      description: 'Commission-based growth engine'
    },
    {
      feature: 'Multi-Location Support',
      us: true,
      competitors: false,
      description: 'Enterprise-ready from day one'
    },
    {
      feature: 'Verified Certification',
      us: true,
      competitors: 'Partial',
      description: 'Trust economy with official verification'
    }
  ];

  const revenueStreams = [
    { name: 'Business Subscriptions', description: 'Tiered SaaS model (Basic, Premium, Enterprise)', icon: Building2 },
    { name: 'Sponsor Partnerships', description: 'Corporate sponsors supporting the ecosystem', icon: Users },
    { name: 'Transaction Fees', description: 'B2B marketplace transaction commissions', icon: DollarSign },
    { name: 'Featured Proximity Ads', description: 'Location-based promotional notifications', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-mansablue-dark via-[hsl(210,100%,12%)] to-[hsl(210,100%,8%)]">
      <Helmet>
        <title>Investor Overview | 1325.AI Economic Infrastructure (IaaS)</title>
        <meta name="description" content="1325.AI: Full-stack economic infrastructure (IaaS) for the Black business economy. Patent-protected data rails including transaction ledger, supply chain graph, and AI intelligence layer." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-mansablue-light/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30 text-sm px-4 py-2">
                <Database className="w-4 h-4 mr-2" />
                IaaS Economic Infrastructure
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-sm px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                27 Patent Claims Filed
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              <span className="text-white">We Don't Just Know Where</span>
              <br />
              <span className="bg-gradient-to-r from-mansagold via-mansagold-light to-mansagold bg-clip-text text-transparent">
                Black Consumers Shop
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 mb-4 max-w-4xl mx-auto font-light">
              We own the ledger of every business they patronize.
            </p>
            <p className="text-lg text-white/60 max-w-3xl mx-auto">
              Our AI understands the cash flow, the supply chain, and the consumer behavior of the Black economy in real-time.
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: '4', label: 'Revenue Streams', icon: DollarSign },
              { value: 'AI', label: 'Powered Matching', icon: Brain },
              { value: 'B2B', label: 'Supply Chain', icon: Network },
              { value: '100%', label: 'Data Ownership', icon: Lock }
            ].map((stat, i) => (
              <Card key={i} className="p-6 bg-white/5 backdrop-blur-sm border-white/10 text-center hover:bg-white/10 transition-all">
                <stat.icon className="w-8 h-8 text-mansagold mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Data Moat */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The <span className="text-mansagold">Data Moat</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Unlike simple directories, we capture the complete economic activity of businesses on our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {dataMetrics.map((metric, i) => (
              <Card key={i} className="p-8 bg-white/5 backdrop-blur-sm border-white/10 hover:border-mansagold/30 transition-all group">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  metric.color === 'mansablue' ? 'bg-mansablue' :
                  metric.color === 'mansagold' ? 'bg-mansagold' :
                  metric.color === 'purple' ? 'bg-purple-600' : 'bg-green-600'
                }`}>
                  <metric.icon className={`w-7 h-7 ${metric.color === 'mansagold' ? 'text-mansablue-dark' : 'text-white'}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-mansagold transition-colors">
                  {metric.label}
                </h3>
                <p className="text-white/70 text-lg">
                  {metric.description}
                </p>
              </Card>
            ))}
          </div>

          {/* Data Flow Visualization */}
          <Card className="mt-12 p-8 bg-white border-2 border-mansagold/30 shadow-xl">
            <h3 className="text-center text-lg font-bold text-foreground mb-8">How Data Flows Through the Platform</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 bg-gradient-to-br from-mansablue to-mansablue-dark rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="text-foreground font-bold text-lg">Business Onboards</div>
                  <div className="text-foreground/60 text-sm">Accounting + Listing</div>
                </div>
              </div>
              <ArrowRight className="w-10 h-10 text-mansagold hidden md:block" />
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="text-foreground font-bold text-lg">Data Captured</div>
                  <div className="text-foreground/60 text-sm">Transactions + Behavior</div>
                </div>
              </div>
              <ArrowRight className="w-10 h-10 text-mansagold hidden md:block" />
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 bg-gradient-to-br from-mansagold-dark to-mansagold rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="w-10 h-10 text-mansablue-dark" />
                </div>
                <div>
                  <div className="text-foreground font-bold text-lg">AI Intelligence</div>
                  <div className="text-foreground/60 text-sm">Predictions + Insights</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Competitive Analysis */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Beyond the <span className="text-mansagold">Directory</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              We compete on an enterprise level while others remain simple marketing tools
            </p>
          </div>

          <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-6 text-white font-bold">Feature</th>
                    <th className="text-center p-6 text-mansagold font-bold">Mansa Musa</th>
                    <th className="text-center p-6 text-white/60 font-bold">Competitors</th>
                  </tr>
                </thead>
                <tbody>
                  {competitiveEdge.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6">
                        <div className="text-white font-medium">{row.feature}</div>
                        <div className="text-white/50 text-sm mt-1">{row.description}</div>
                      </td>
                      <td className="text-center p-6">
                        {row.us && <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />}
                      </td>
                      <td className="text-center p-6">
                        {row.competitors === true ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                        ) : row.competitors === 'Partial' ? (
                          <span className="text-yellow-500 text-sm">Partial</span>
                        ) : (
                          <span className="text-red-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Revenue Model */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Diversified <span className="text-mansagold">Revenue</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Multiple revenue streams create sustainable, predictable growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {revenueStreams.map((stream, i) => (
              <Card key={i} className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-mansagold/30 transition-all text-center">
                <div className="w-14 h-14 bg-mansagold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stream.icon className="w-7 h-7 text-mansagold" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{stream.name}</h3>
                <p className="text-white/60 text-sm">{stream.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Moat Explained */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-10 bg-white border-2 border-mansagold/30 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-mansagold-dark to-mansagold rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lock className="w-10 h-10 text-mansablue-dark" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                The Vendor Lock-In Effect
              </h2>
              <p className="text-xl text-foreground/80 mb-6 leading-relaxed max-w-2xl mx-auto">
                Once a business owner has 1,000 followers, a high rating, and their entire accounting history on our platform, <span className="text-mansagold font-bold">they will never leave</span>.
              </p>
              <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto">
                They can't take their reputation, their customer relationships, or their financial history to a competitor. This is how we create sustainable, defensible market position.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-foreground/10">
                <div className="p-4 bg-mansablue/5 rounded-xl">
                  <div className="text-2xl md:text-3xl font-bold text-mansablue">Social</div>
                  <div className="text-foreground/60 text-sm mt-1">Reputation Capital</div>
                </div>
                <div className="p-4 bg-mansagold/10 rounded-xl">
                  <div className="text-2xl md:text-3xl font-bold text-mansagold-dark">Financial</div>
                  <div className="text-foreground/60 text-sm mt-1">Accounting History</div>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-xl">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600">Network</div>
                  <div className="text-foreground/60 text-sm mt-1">B2B Connections</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to <span className="text-mansagold">Learn More</span>?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Schedule a call with our team to discuss partnership opportunities and investment details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-mansagold-dark to-mansagold hover:from-mansagold hover:to-mansagold-light text-mansablue-dark font-bold text-lg px-10 py-6 shadow-xl"
              asChild
            >
              <a href="mailto:Thomas@1325.AI?subject=Investor%20Inquiry">
                Contact Our Team <ArrowRight className="ml-2" />
              </a>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 font-bold text-lg px-10 py-6"
              asChild
            >
              <a href="/">
                <Globe className="mr-2" /> Explore Platform
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestorPage;
