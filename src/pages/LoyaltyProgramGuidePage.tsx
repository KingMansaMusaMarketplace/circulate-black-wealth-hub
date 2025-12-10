
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  QrCode, Gift, Award, Users, Building2, TrendingUp, 
  ArrowRight, CheckCircle, Star, Zap, Heart, Globe,
  Scan, ShoppingBag, HandCoins, Coins, Crown, Diamond
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoyaltyProgramGuidePage: React.FC = () => {
  const consumerSteps = [
    {
      step: 1,
      icon: <QrCode className="h-8 w-8" />,
      title: "Scan QR Codes",
      description: "Visit participating Black-owned businesses and scan their unique QR code at checkout to earn loyalty points."
    },
    {
      step: 2,
      icon: <Coins className="h-8 w-8" />,
      title: "Accumulate Points",
      description: "Earn points with every transaction. The more you shop, the more points you collect. Bonus points available during special promotions."
    },
    {
      step: 3,
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Level Up Your Tier",
      description: "Progress through Bronze, Silver, Gold, and Platinum tiers to unlock exclusive benefits and multiplied earning rates."
    },
    {
      step: 4,
      icon: <Gift className="h-8 w-8" />,
      title: "Redeem Rewards",
      description: "Use your points for discounts, free products, exclusive experiences, and special offers from our business partners."
    }
  ];

  const businessSteps = [
    {
      step: 1,
      icon: <Building2 className="h-8 w-8" />,
      title: "Register Your Business",
      description: "Sign up as a business owner and complete your verification to join our coalition of Black-owned businesses."
    },
    {
      step: 2,
      icon: <QrCode className="h-8 w-8" />,
      title: "Get Your QR Code",
      description: "Receive your unique business QR code that customers scan to earn points when shopping with you."
    },
    {
      step: 3,
      icon: <Users className="h-8 w-8" />,
      title: "Attract Loyal Customers",
      description: "Coalition members actively seek out participating businesses, driving new foot traffic and repeat visits."
    },
    {
      step: 4,
      icon: <HandCoins className="h-8 w-8" />,
      title: "Grow Revenue Together",
      description: "Benefit from cross-promotion, increased visibility, and a community of customers committed to supporting Black businesses."
    }
  ];

  const tiers = [
    {
      name: "Bronze",
      icon: <Award className="h-10 w-10 text-amber-700" />,
      pointsRequired: "0",
      multiplier: "1x",
      benefits: ["Earn base points", "Access to standard rewards", "Member newsletter"],
      color: "from-amber-700/20 to-amber-900/20",
      border: "border-amber-700/30"
    },
    {
      name: "Silver",
      icon: <Star className="h-10 w-10 text-gray-400" />,
      pointsRequired: "500",
      multiplier: "1.25x",
      benefits: ["25% bonus points", "Early access to deals", "Birthday rewards", "Silver-exclusive offers"],
      color: "from-gray-400/20 to-gray-600/20",
      border: "border-gray-400/30"
    },
    {
      name: "Gold",
      icon: <Crown className="h-10 w-10 text-mansagold" />,
      pointsRequired: "2,000",
      multiplier: "1.5x",
      benefits: ["50% bonus points", "VIP event access", "Priority support", "Gold-only flash sales", "Free shipping offers"],
      color: "from-mansagold/20 to-yellow-600/20",
      border: "border-mansagold/30"
    },
    {
      name: "Platinum",
      icon: <Diamond className="h-10 w-10 text-cyan-300" />,
      pointsRequired: "5,000",
      multiplier: "2x",
      benefits: ["Double points", "Exclusive experiences", "Personal concierge", "Annual appreciation gift", "First access to new businesses"],
      color: "from-cyan-400/20 to-purple-600/20",
      border: "border-cyan-400/30"
    }
  ];

  const b2bBenefits = [
    {
      icon: <Globe className="h-8 w-8 text-mansagold" />,
      title: "B2B Marketplace Access",
      description: "Connect with other coalition businesses for supplies, services, and partnerships at preferred rates."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-mansagold" />,
      title: "Analytics Dashboard",
      description: "Track customer visits, loyalty redemptions, and business performance metrics in real-time."
    },
    {
      icon: <Users className="h-8 w-8 text-mansagold" />,
      title: "Customer Insights",
      description: "Understand your customer base with demographic data and shopping behavior analytics."
    },
    {
      icon: <Heart className="h-8 w-8 text-mansagold" />,
      title: "Community Marketing",
      description: "Get featured in our directory, newsletters, and promotional campaigns to coalition members."
    },
    {
      icon: <Zap className="h-8 w-8 text-mansagold" />,
      title: "Promotional Tools",
      description: "Create flash sales, bonus point events, and exclusive offers to drive traffic during slow periods."
    },
    {
      icon: <ShoppingBag className="h-8 w-8 text-mansagold" />,
      title: "Inventory Support",
      description: "Access group purchasing power and supplier connections through our B2B network."
    }
  ];

  const faqs = [
    {
      question: "How do I earn points as a consumer?",
      answer: "Simply scan the QR code at any participating Black-owned business after making a purchase. Points are automatically added to your account based on your transaction amount."
    },
    {
      question: "Do my points expire?",
      answer: "Points remain active as long as you make at least one transaction every 12 months. Inactive accounts may have points expire after 18 months of no activity."
    },
    {
      question: "How do businesses benefit from joining?",
      answer: "Businesses gain access to loyal customers actively seeking to support Black-owned establishments, plus B2B networking, marketing support, and analytics tools."
    },
    {
      question: "Is there a cost to join the coalition?",
      answer: "Basic membership is free for consumers. Business membership tiers are available with varying features - contact us for current pricing and promotional offers."
    },
    {
      question: "Can I use points at any participating business?",
      answer: "Yes! Coalition points are universal and can be redeemed at any participating business in our network, creating a true community economy."
    },
    {
      question: "How do referrals work?",
      answer: "Share your unique referral code with friends. When they sign up and make their first purchase, you both earn bonus points. Businesses can also earn by referring other businesses."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-mansablue via-mansablue/95 to-mansablue relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -left-40 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-mansagold/20 rounded-full backdrop-blur-sm border border-mansagold/30">
                  <Award className="h-12 w-12 text-mansagold" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Coalition Loyalty Program
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Building Black wealth through community-powered rewards. Learn how our loyalty program 
                benefits consumers and businesses in our coalition ecosystem.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold">
                  <Link to="/register">
                    Join as Consumer <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link to="/business/register">
                    Register Your Business
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="consumer" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-white/10 backdrop-blur-sm">
                <TabsTrigger value="consumer" className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white">
                  For Consumers
                </TabsTrigger>
                <TabsTrigger value="business" className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white">
                  For Businesses
                </TabsTrigger>
              </TabsList>

              {/* Consumer Tab */}
              <TabsContent value="consumer">
                {/* How It Works - Consumer */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-white text-center mb-12">
                    How It Works for <span className="text-mansagold">Consumers</span>
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {consumerSteps.map((step, index) => (
                      <motion.div
                        key={step.step}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card className="bg-white/5 backdrop-blur-lg border-white/10 h-full hover:bg-white/10 transition-all duration-300">
                          <CardContent className="p-6 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mansagold/20 text-mansagold mb-4">
                              {step.icon}
                            </div>
                            <div className="text-mansagold font-bold text-sm mb-2">STEP {step.step}</div>
                            <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                            <p className="text-white/70">{step.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tier System */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-white text-center mb-4">
                    Membership <span className="text-mansagold">Tiers</span>
                  </h2>
                  <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">
                    Progress through our tier system to unlock greater rewards and exclusive benefits
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tiers.map((tier, index) => (
                      <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card className={`bg-gradient-to-b ${tier.color} backdrop-blur-lg ${tier.border} border h-full`}>
                          <CardHeader className="text-center pb-2">
                            <div className="flex justify-center mb-2">{tier.icon}</div>
                            <CardTitle className="text-white text-xl">{tier.name}</CardTitle>
                            <div className="text-white/60 text-sm">{tier.pointsRequired}+ points</div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="text-center mb-4">
                              <span className="text-2xl font-bold text-mansagold">{tier.multiplier}</span>
                              <span className="text-white/60 text-sm ml-1">points multiplier</span>
                            </div>
                            <ul className="space-y-2">
                              {tier.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                                  <CheckCircle className="h-4 w-4 text-mansagold shrink-0 mt-0.5" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Business Tab */}
              <TabsContent value="business">
                {/* How It Works - Business */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-white text-center mb-12">
                    How It Works for <span className="text-mansagold">Businesses</span>
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {businessSteps.map((step, index) => (
                      <motion.div
                        key={step.step}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card className="bg-white/5 backdrop-blur-lg border-white/10 h-full hover:bg-white/10 transition-all duration-300">
                          <CardContent className="p-6 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mansagold/20 text-mansagold mb-4">
                              {step.icon}
                            </div>
                            <div className="text-mansagold font-bold text-sm mb-2">STEP {step.step}</div>
                            <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                            <p className="text-white/70">{step.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* B2B Benefits */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-white text-center mb-4">
                    B2B <span className="text-mansagold">Benefits</span>
                  </h2>
                  <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">
                    Beyond consumer loyalty, our coalition provides powerful business-to-business advantages
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {b2bBenefits.map((benefit, index) => (
                      <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card className="bg-white/5 backdrop-blur-lg border-white/10 h-full hover:bg-white/10 transition-all duration-300 group">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-mansagold/20 rounded-lg group-hover:bg-mansagold/30 transition-colors">
                                {benefit.icon}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                                <p className="text-white/70 text-sm">{benefit.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* B2B Marketplace CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-16"
                >
                  <Card className="bg-gradient-to-r from-mansagold/20 to-amber-600/20 backdrop-blur-lg border-mansagold/30">
                    <CardContent className="p-8 text-center">
                      <Building2 className="h-12 w-12 text-mansagold mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-3">
                        Access the B2B Marketplace
                      </h3>
                      <p className="text-white/80 mb-6 max-w-xl mx-auto">
                        Connect with other coalition businesses for supplies, services, and strategic partnerships. 
                        Buy and sell within our trusted network.
                      </p>
                      <Button asChild size="lg" className="bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold">
                        <Link to="/b2b-marketplace">
                          Explore B2B Marketplace <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Frequently Asked <span className="text-mansagold">Questions</span>
            </h2>
            <div className="grid gap-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                      <p className="text-white/70">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-mansagold/30 to-amber-600/30 backdrop-blur-lg border-mansagold/40">
              <CardContent className="p-12 text-center">
                <Award className="h-16 w-16 text-mansagold mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Join the Coalition?
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                  Whether you're a consumer looking to support Black-owned businesses or a business owner 
                  wanting to grow your customer base, we're here for you.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild size="lg" className="bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold">
                    <Link to="/coalition">
                      <Users className="mr-2 h-5 w-5" />
                      Join the Coalition
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <Link to="/scanner">
                      <Scan className="mr-2 h-5 w-5" />
                      Start Scanning
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoyaltyProgramGuidePage;
