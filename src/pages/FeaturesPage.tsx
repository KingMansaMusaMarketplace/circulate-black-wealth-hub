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
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue-darker">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 30%, hsl(var(--mansagold) / 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 70%, hsl(var(--mansagold) / 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 50%, hsl(var(--mansagold) / 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 30%, hsl(var(--mansagold) / 0.15) 0%, transparent 50%)",
              ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mansablue/20 to-mansablue" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-mansagold/10 backdrop-blur-sm border border-mansagold/30 rounded-full px-6 py-3 shadow-lg shadow-mansagold/20"
            >
              <Sparkles className="w-5 h-5 text-mansagold animate-pulse" />
              <span className="font-semibold text-white">Powerful Features</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Everything You Need to{" "}
              <span className="relative inline-block">
                <motion.span 
                  className="relative z-10 bg-gradient-to-r from-mansagold via-amber-300 to-mansagold bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: '200% auto' }}
                >
                  Build Wealth
                </motion.span>
                <motion.span
                  className="absolute -inset-2 bg-gradient-to-r from-mansagold/30 to-amber-400/30 blur-2xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3] 
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Discover the tools and features that make supporting Black-owned businesses easier than ever
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-mansagold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-mansablue/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-mansablue via-mansablue-dark to-mansablue bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to start making an impact in your community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group"
              >
                <motion.div 
                  className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 h-full shadow-lg transition-all duration-300"
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-mansagold/5 via-transparent to-mansablue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-mansablue to-mansablue-dark shadow-lg shadow-mansablue/30"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-mansablue transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Step number */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-mansagold/10 flex items-center justify-center">
                    <span className="text-mansagold font-bold text-lg">{index + 1}</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with gradient background */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-mansablue/5 to-background" />
        <div className="relative z-10">
          <BenefitsSection />
        </div>
      </div>

      {/* Native Features Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-mansagold/10 via-transparent to-mansablue/10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: '200% 200%' }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-mansablue via-mansagold to-mansablue bg-clip-text text-transparent">
              Mobile Experience
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get the best experience with our mobile-optimized features
            </p>
          </motion.div>
          <NativeFeaturesPromo />
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
        {/* Decorative background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-mansagold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-mansablue/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-mansagold/10 to-amber-500/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-mansagold/20"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-5 h-5 text-mansagold" />
              <span className="font-semibold text-mansagold">Secure & Trusted</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-mansablue via-mansagold to-mansablue bg-clip-text text-transparent">
              Your Security Matters
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Businesses",
                description: "Every business on our platform goes through a verification process to ensure authenticity and quality.",
                gradient: "from-mansablue to-mansablue-dark",
              },
              {
                icon: Zap,
                title: "Secure Transactions",
                description: "Industry-standard encryption and security measures protect your data and transactions.",
                gradient: "from-mansagold to-amber-600",
              },
              {
                icon: Heart,
                title: "Community First",
                description: "Built by the community, for the community. Your trust and safety are our top priorities.",
                gradient: "from-mansablue-dark to-mansagold",
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
                  className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 text-center h-full shadow-xl overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Animated glow */}
                  <motion.div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}
                  />

                  <div className="relative z-10">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:bg-gradient-to-r group-hover:from-mansablue group-hover:to-mansagold group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
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
