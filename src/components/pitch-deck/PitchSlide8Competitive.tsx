import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { CheckCircle, X, Minus } from 'lucide-react';

const PitchSlide8Competitive: React.FC = () => {
  const competitors = [
    { name: 'Yelp', type: 'General Directory' },
    { name: 'Official Black Wall Street', type: 'Black Biz Directory' },
    { name: 'WeBuyBlack', type: 'E-commerce' },
    { name: 'Mansa Musa', type: 'Economic OS', highlight: true }
  ];

  const features = [
    { name: 'Business Directory', yelp: true, obws: true, wbb: false, mmm: true },
    { name: 'Full Accounting Suite', yelp: false, obws: false, wbb: false, mmm: true },
    { name: 'B2B Marketplace', yelp: false, obws: false, wbb: 'partial', mmm: true },
    { name: 'Loyalty Program', yelp: false, obws: false, wbb: false, mmm: true },
    { name: 'AI Recommendations', yelp: 'partial', obws: false, wbb: false, mmm: true },
    { name: 'Agent Referral Network', yelp: false, obws: false, wbb: false, mmm: true },
    { name: 'Corporate Sponsorships', yelp: false, obws: 'partial', wbb: false, mmm: true },
    { name: 'Native Mobile Apps', yelp: true, obws: false, wbb: true, mmm: true },
    { name: 'Transaction Data Ownership', yelp: false, obws: false, wbb: 'partial', mmm: true },
  ];

  const renderCell = (value: boolean | string) => {
    if (value === true) return <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />;
    if (value === 'partial') return <Minus className="w-5 h-5 text-yellow-500 mx-auto" />;
    return <X className="w-5 h-5 text-red-400/50 mx-auto" />;
  };

  return (
    <div className="h-full flex items-center justify-center px-8 py-12">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Competitive <span className="text-mansagold">Landscape</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            We compete on an enterprise level while others remain simple marketing tools
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white font-bold">Feature</th>
                    {competitors.map((comp, i) => (
                      <th 
                        key={i} 
                        className={`text-center p-4 font-bold ${
                          comp.highlight 
                            ? 'bg-mansagold/20 text-mansagold' 
                            : 'text-white/70'
                        }`}
                      >
                        <div>{comp.name}</div>
                        <div className="text-xs font-normal opacity-70">{comp.type}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, i) => (
                    <motion.tr 
                      key={i} 
                      className="border-b border-white/5 hover:bg-white/5"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <td className="p-4 text-white font-medium">{feature.name}</td>
                      <td className="p-4">{renderCell(feature.yelp)}</td>
                      <td className="p-4">{renderCell(feature.obws)}</td>
                      <td className="p-4">{renderCell(feature.wbb)}</td>
                      <td className="p-4 bg-mansagold/10">{renderCell(feature.mmm)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <Card className="inline-block p-4 bg-mansagold/10 border-mansagold/30">
            <p className="text-lg text-white">
              We're not their <span className="text-white/60">Yelp</span> — 
              we're their <span className="text-mansagold font-bold">QuickBooks + Yelp + Alibaba + Starbucks Rewards</span>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide8Competitive;
