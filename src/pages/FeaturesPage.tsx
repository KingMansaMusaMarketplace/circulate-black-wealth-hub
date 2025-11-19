import React from 'react';
import { Helmet } from 'react-helmet';
import { BenefitsSection } from '@/components/HowItWorks/Benefits';
import { NativeFeaturesPromo } from '@/components/NativeFeaturesPromo';
import { motion } from 'framer-motion';
import { Sparkles, Smartphone, Shield, Zap, Heart, Users } from 'lucide-react';

const FeaturesPage = () => {
  const howItWorksSteps = [
    {
      icon: Users,
      title: "Discover Black-Owned Businesses",
      description: "Browse our curated directory of verified Black-owned businesses in your area",
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
      description: "See your contribution to circulating Black wealth and supporting local businesses",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Features - Mansa Musa Marketplace</title>
        <meta name="description" content="Discover the powerful features that make Mansa Musa Marketplace the premier platform for supporting Black-owned businesses." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue">
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, hsl(var(--mansagold) / 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, hsl(var(--mansagold) / 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, hsl(var(--mansagold) / 0.3) 0%, transparent 50%)",
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white"
            >
              <Sparkles className="w-5 h-5 text-mansagold" />
              <span className="font-medium">Powerful Features</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Everything You Need to{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-mansagold via-amber-400 to-mansagold bg-clip-text text-transparent">
                  Build Wealth
                </span>
                <motion.span
                  className="absolute inset-0 bg-mansagold/20 blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Discover the tools and features that make supporting Black-owned businesses easier than ever
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background via-mansagold/5 to-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mansablue via-mansablue-dark to-mansablue bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Four simple steps to start making an impact in your community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-mansagold/20 to-mansablue/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <div className="relative bg-white border-2 border-border rounded-2xl p-6 hover:border-mansagold/40 transition-all duration-300 shadow-lg h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-mansablue to-mansablue-dark rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="space-y-2">
                      <div className="text-sm font-bold text-mansagold">Step {index + 1}</div>
                      <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <BenefitsSection />
      </section>

      {/* Native Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-mansablue/5 via-background to-mansagold/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mansablue via-mansablue-dark to-mansablue bg-clip-text text-transparent">
                Mobile Experience
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get the best experience with our mobile-optimized features
            </p>
          </motion.div>
          <NativeFeaturesPromo />
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-mansagold/10 rounded-full px-6 py-3 mb-6">
              <Shield className="w-5 h-5 text-mansagold" />
              <span className="font-semibold text-mansagold">Secure & Trusted</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mansablue via-mansablue-dark to-mansablue bg-clip-text text-transparent">
                Your Security Matters
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Businesses",
                description: "Every business on our platform goes through a verification process to ensure authenticity and quality.",
              },
              {
                icon: Zap,
                title: "Secure Transactions",
                description: "Industry-standard encryption and security measures protect your data and transactions.",
              },
              {
                icon: Heart,
                title: "Community First",
                description: "Built by the community, for the community. Your trust and safety are our top priorities.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white border-2 border-border rounded-2xl p-8 text-center hover:border-mansagold/40 transition-all duration-300 shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-mansagold to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
