import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  PartnershipHero, 
  PartnerRevenueCalculator, 
  PartnerComparisonTable,
  MigrationTimeline,
  PartnerBenefitsGrid
} from '@/components/partnerships';
import { 
  ArrowRight, 
  Calendar, 
  Download, 
  Mail,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const EatOkraPartnershipPage: React.FC = () => {
  const comparisonFeatures = [
    { name: 'Restaurant Discovery', before: true, after: true },
    { name: 'Native Booking & Reservations', before: false, after: true, highlight: true },
    { name: 'Revenue Per Booking', before: 'N/A' as const, after: true, highlight: true },
    { name: 'Partner Revenue Share', before: 'N/A' as const, after: true, highlight: true },
    { name: 'Customer Loyalty Tools', before: false, after: true },
    { name: 'Real-time Business Analytics', before: 'partial' as const, after: true },
    { name: 'Mobile Apps (iOS/Android)', before: false, after: true },
    { name: 'Community Finance (Susu Circles)', before: false, after: true },
    { name: 'B2B Marketplace Access', before: false, after: true },
    { name: 'Transaction Data Ownership', before: false, after: true },
  ];

  const handleScheduleCall = () => {
    // Open Calendly or email
    window.open('mailto:partnerships@1325.ai?subject=EatOkra%20Partnership%20Inquiry', '_blank');
  };

  return (
    <>
      <Helmet>
        <title>EatOkra + 1325.AI Partnership | Transform Discovery into Revenue</title>
        <meta 
          name="description" 
          content="Partner with 1325.AI to transform your 22,500+ restaurant listings into a revenue-generating booking platform. Earn 10% recurring commission on all transactions."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Hero Section */}
        <PartnershipHero
          partnerName="EatOkra"
          headline="EatOkra + 1325.AI: From Discovery to Direct Revenue"
          subheadline="Transform your 22,500+ restaurant listings into a revenue-generating booking platform. Keep users in your ecosystem and earn on every transaction."
          ctaText="Schedule a Partnership Call"
          onCtaClick={handleScheduleCall}
        />

        {/* The Opportunity Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                The <span className="text-mansagold">Opportunity</span>
              </h2>
              <p className="text-xl text-blue-200/70 max-w-3xl mx-auto">
                You've built an incredible directory. Now turn those listings into transactions.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Problem Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full bg-red-500/10 border-red-500/30">
                  <CardContent className="p-6">
                    <AlertTriangle className="w-10 h-10 text-red-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Current State</h3>
                    <p className="text-blue-200/70">
                      EatOkra has 22,500+ restaurants but each external redirect loses:
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-red-300/80">
                      <li>• Transaction data to OpenTable/Yelp</li>
                      <li>• Potential booking revenue</li>
                      <li>• User engagement and retention</li>
                      <li>• Insights into customer behavior</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Opportunity Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full bg-mansagold/10 border-mansagold/30">
                  <CardContent className="p-6">
                    <TrendingUp className="w-10 h-10 text-mansagold mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">The Opportunity</h3>
                    <p className="text-blue-200/70">
                      With 1325.AI's native booking engine, every transaction stays in your ecosystem:
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-mansagold/80">
                      <li>• 7.5% platform fee on bookings</li>
                      <li>• 10% of that fee goes to YOU</li>
                      <li>• Businesses keep 92.5%</li>
                      <li>• Full transaction analytics</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Solution Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Card className="h-full bg-green-500/10 border-green-500/30">
                  <CardContent className="p-6">
                    <Users className="w-10 h-10 text-green-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Win-Win-Win</h3>
                    <p className="text-blue-200/70">
                      Everyone in the ecosystem benefits:
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-green-300/80">
                      <li>• <strong>EatOkra:</strong> Recurring revenue stream</li>
                      <li>• <strong>Restaurants:</strong> $700/mo in tools for less</li>
                      <li>• <strong>Customers:</strong> Seamless booking experience</li>
                      <li>• <strong>Community:</strong> Wealth stays in ecosystem</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Before & After <span className="text-mansagold">Partnership</span>
              </h2>
              <p className="text-xl text-blue-200/70">
                See how 1325.AI transforms your directory into a transaction platform
              </p>
            </motion.div>

            <PartnerComparisonTable
              partnerName="EatOkra"
              features={comparisonFeatures}
            />
          </div>
        </section>

        {/* Revenue Calculator */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Calculate Your <span className="text-mansagold">Potential Revenue</span>
              </h2>
              <p className="text-xl text-blue-200/70">
                Adjust the sliders to see your projected earnings
              </p>
            </motion.div>

            <PartnerRevenueCalculator
              defaultBusinessCount={22500}
              businessType="restaurants"
              partnerName="EatOkra"
            />
          </div>
        </section>

        {/* Migration Timeline */}
        <section className="py-20 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-4xl">
            <MigrationTimeline partnerName="EatOkra" />
          </div>
        </section>

        {/* Partner Benefits */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Founding Partner <span className="text-mansagold">Benefits</span>
              </h2>
              <p className="text-xl text-blue-200/70">
                Lock in these benefits before September 2026
              </p>
            </motion.div>

            <PartnerBenefitsGrid partnerName="EatOkra" />
          </div>
        </section>

        {/* Urgency Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-mansagold/20 to-mansagold/5">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Clock className="w-16 h-16 text-mansagold mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Now?
              </h2>
              <p className="text-xl text-blue-200/70 mb-8 max-w-2xl mx-auto">
                Founding Partner status and all associated benefits are only available until 
                <span className="text-mansagold font-bold"> September 1, 2026</span>. 
                After that, partner terms move to standard rates.
              </p>
              
              <div className="bg-black/60 rounded-xl p-6 border border-mansagold/40 inline-block">
                <p className="text-sm text-blue-200/70 mb-2">Limited Founding Partner Slots</p>
                <p className="text-4xl font-bold text-mansagold">First 100 Directory Partners</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-black/80 border-2 border-mansagold overflow-hidden">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Transform EatOkra?
                </h2>
                <p className="text-xl text-blue-200/70 mb-8 max-w-2xl mx-auto">
                  Let's discuss how we can work together to serve the Black restaurant community 
                  while creating a sustainable revenue stream for both of us.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={handleScheduleCall}
                    className="bg-mansagold hover:bg-mansagold-dark text-slate-900 font-bold text-lg px-8 py-6 rounded-xl group"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Partnership Discussion
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl"
                    onClick={() => {
                      window.open('mailto:partnerships@1325.ai?subject=EatOkra%20Partnership%20PDF%20Request', '_blank');
                    }}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Request Partnership PDF
                  </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-sm text-blue-200/60 mb-2">Partnership Inquiries</p>
                  <a 
                    href="mailto:partnerships@1325.ai"
                    className="text-mansagold hover:text-mansagold-light inline-flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    partnerships@1325.ai
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default EatOkraPartnershipPage;
