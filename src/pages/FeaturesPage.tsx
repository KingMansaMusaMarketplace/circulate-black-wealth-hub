import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BenefitsSection } from '@/components/HowItWorks/Benefits';
import { NativeFeaturesPromo } from '@/components/NativeFeaturesPromo';
import { motion } from 'framer-motion';
import { Sparkles, Smartphone, Shield, Zap, Heart, Users } from 'lucide-react';

const FeaturesPage = () => {
  const howItWorksSteps = [
    {
      icon: Users,
      title: "Discover Great Businesses",
      description: "Browse our curated directory of verified businesses in your area",
    },
    {
      icon: Smartphone,
      title: "Scan QR Codes & Earn",
      description: "Scan business QR codes to earn loyalty points and access exclusive discounts",
    },
    {
      icon: Heart,
      title: "Support & Save",
      description: "Shop at participating businesses and save 10-20% while building community wealth",
    },
    {
      icon: Zap,
      title: "Track Your Impact",
      description: "See your contribution to community wealth circulation and supporting local businesses",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#050a18] to-[#030712] relative overflow-hidden">
      {/* Premium ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-mansagold/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[150px]" />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <Helmet>
        <title>Features - 1325.AI</title>
        <meta name="description" content="Discover the powerful features that make 1325.AI the premier platform for supporting community businesses." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden z-10">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 border border-mansagold/40 bg-mansagold/10 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-mansagold" />
              <span className="text-xs font-semibold tracking-[0.18em] text-mansagold uppercase">Platform Capabilities</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] mb-6">
              One platform. Verified commerce, an agentic workforce, and the rails in between.
            </h1>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl">
              1325.AI combines the largest verified directory of Black-owned businesses with Kayla and 42 Agentic AI Employees, loyalty rails that keep dollars circulating, and a supplier data layer enterprises can actually buy from.
            </p>
          </motion.div>

          {/* Proof strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden"
          >
            {[
              { value: '47,000+', label: 'Verified Businesses' },
              { value: '42', label: 'Agentic AI Employees' },
              { value: '46', label: 'Patent Claims Pending' },
              { value: '$12T', label: 'Global Black Economy' },
            ].map((s) => (
              <div key={s.label} className="bg-slate-950/80 px-6 py-7">
                <div className="text-3xl md:text-4xl font-bold text-mansagold">{s.value}</div>
                <div className="mt-1 text-xs md:text-sm uppercase tracking-wider text-white/80">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <p className="mt-4 text-xs text-white/70">
            U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending
          </p>
        </div>
      </section>

      {/* Core capabilities */}
      <section className="py-20 px-4 relative z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            What the platform <span className="text-mansagold">actually does</span>
          </h2>
          <p className="text-white/85 max-w-2xl mb-12">
            Six systems, built to work as one. Consumers, merchants, and enterprise buyers all operate on the same rails.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Verified Business Directory', desc: '47,000+ businesses with ownership verification, so buyers and enterprises can trust every record.' },
              { icon: Sparkles, title: 'Kayla & 42 Agentic AI Employees', desc: 'An autonomous workforce handling outreach, support, onboarding, marketing, and analysis around the clock.' },
              { icon: Smartphone, title: 'Loyalty & QR Rails', desc: 'Scan-to-earn points, merchant discounts, and rewards that keep dollars circulating inside the community.' },
              { icon: Shield, title: 'Supplier Data Layer', desc: 'Verified supplier records enterprises can source from — the data moat behind corporate spend commitments.' },
              { icon: Zap, title: 'B2B Marketplace', desc: 'Business-to-business sourcing, quotes, and contracts between verified suppliers and corporate buyers.' },
              { icon: Heart, title: 'Impact Analytics', desc: 'Measured circulation, spend, and community impact reporting for members, merchants, and sponsors.' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-7 hover:border-mansagold/40 transition-colors"
              >
                <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-mansagold/15 border border-mansagold/30">
                  <item.icon className="w-6 h-6 text-mansagold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/85 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 relative overflow-hidden z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              How members <span className="text-mansagold">use it</span>
            </h2>
            <p className="text-white/85 max-w-2xl">
              Four steps from first search to measured community impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="relative rounded-2xl border border-white/10 bg-slate-950/70 p-7 h-full"
              >
                <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-mansagold/15 border border-mansagold/30">
                  <step.icon className="w-6 h-6 text-mansagold" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{step.title}</h3>
                <p className="text-white/85 leading-relaxed">{step.description}</p>
                <div className="absolute top-5 right-5 text-sm font-bold text-mansagold/70">
                  0{index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with gradient background */}
      <div className="relative py-20 z-10">
        <div className="relative z-10">
          <BenefitsSection />
        </div>
      </div>

      {/* Native Features Section */}
      <section className="py-24 px-4 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-white">
              Mobile <span className="bg-gradient-to-r from-mansagold via-amber-300 to-mansagold bg-clip-text text-transparent">Experience</span>
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Get the best experience with our mobile-optimized features
            </p>
          </motion.div>
          <NativeFeaturesPromo />
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-24 px-4 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-mansagold/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-mansagold/30"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-5 h-5 text-mansagold" />
              <span className="font-semibold text-white">Secure & Trusted</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-white">
              Your Security <span className="bg-gradient-to-r from-mansagold via-amber-300 to-mansagold bg-clip-text text-transparent">Matters</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Businesses",
                description: "Every business on our platform goes through a verification process to ensure authenticity and quality.",
                gradient: "from-mansagold to-amber-600",
              },
              {
                icon: Zap,
                title: "Secure Transactions",
                description: "Industry-standard encryption and security measures protect your data and transactions.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Heart,
                title: "Community First",
                description: "Built by the community, for the community. Your trust and safety are our top priorities.",
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="group"
              >
                <motion.div 
                  className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 text-center h-full shadow-xl overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-mansagold transition-all duration-300">
                      {item.title}
                    </h3>
                    <p className="text-white leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
