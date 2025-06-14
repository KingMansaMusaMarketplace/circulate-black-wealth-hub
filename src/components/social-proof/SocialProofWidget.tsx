
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Store, DollarSign, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SocialProofMetric {
  icon: React.ReactNode;
  value: string;
  label: string;
  subtext?: string;
}

const SocialProofWidget = () => {
  const metrics: SocialProofMetric[] = [
    {
      icon: <Users className="h-8 w-8 text-mansablue" />,
      value: "12,500+",
      label: "Active Members",
      subtext: "Growing daily"
    },
    {
      icon: <Store className="h-8 w-8 text-mansagold" />,
      value: "2,847",
      label: "Verified Businesses",
      subtext: "Across 15 cities"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      value: "$1.2M+",
      label: "Money Circulated",
      subtext: "In Black communities"
    },
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      value: "89%",
      label: "Satisfaction Rate",
      subtext: "Member retention"
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Join Thousands Making Real Impact
          </h2>
          <p className="text-gray-600">
            Our community is growing stronger every day
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex justify-center mb-3">
                    {metric.icon}
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm lg:text-base font-medium text-gray-700 mb-1">
                    {metric.label}
                  </div>
                  {metric.subtext && (
                    <div className="text-xs text-gray-500">
                      {metric.subtext}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Verified businesses only</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Secure transactions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Community-driven</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofWidget;
