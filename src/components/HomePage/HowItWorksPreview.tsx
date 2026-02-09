import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Smartphone, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HowItWorksPreview = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Search,
      number: "1",
      title: "Discover",
      description: "Browse verified Black-owned businesses near you"
    },
    {
      icon: Smartphone,
      number: "2",
      title: "Scan & Earn",
      description: "Scan QR codes to earn points and unlock discounts"
    },
    {
      icon: Heart,
      number: "3",
      title: "Save & Support",
      description: "Shop and save 10-20% while building community wealth"
    }
  ];

  return (
    <section className="py-6 md:py-8 px-4 bg-gradient-to-b from-mansablue-dark to-mansablue-dark/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
            How It <span className="text-mansagold">Works</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Three simple steps to start saving money
            <span className="block mt-1">and supporting Black-owned businesses</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-mansablue text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 mt-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-mansablue to-blue-600 rounded-xl flex items-center justify-center mx-auto">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between steps (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-mansablue" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={() => navigate('/features')}
            className="bg-mansablue hover:bg-blue-700 text-white font-semibold px-6 py-5 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            Learn More About All Features
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksPreview;
