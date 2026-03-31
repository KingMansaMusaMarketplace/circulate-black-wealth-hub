import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { CheckCircle, X, Minus, Shield } from 'lucide-react';

const PitchSlide8Competitive: React.FC = () => {
  const competitors = [
    { name: 'Zoho One', type: 'Horizontal SaaS', price: '$37–105/user' },
    { name: 'Salesforce', type: 'Enterprise CRM', price: '$125+/user' },
    { name: 'HubSpot', type: 'Marketing Suite', price: '$20–890/mo' },
    { name: 'Gusto', type: 'Payroll/HR', price: '$40+/user' },
    { name: 'Alignable', type: 'Biz Network', price: 'Free/Ltd' },
    { name: '1325.AI', type: 'Economic OS', price: '$149/mo flat', highlight: true },
  ];

  const features = [
    { name: 'Autonomous Agentic AI', zoho: false, sf: 'enterprise', hub: 'partial', gusto: false, align: false, us: true },
    { name: 'Built for Black-Owned Biz', zoho: false, sf: false, hub: false, gusto: false, align: false, us: true },
    { name: 'Records Mgmt + OCR Vault', zoho: false, sf: false, hub: false, gusto: false, align: false, us: true },
    { name: 'Credit & Lending Readiness', zoho: false, sf: false, hub: false, gusto: false, align: false, us: true },
    { name: 'Supplier Diversity + Gov Contracts', zoho: false, sf: false, hub: false, gusto: false, align: false, us: true },
    { name: 'Community Impact Scorecard', zoho: false, sf: false, hub: false, gusto: false, align: false, us: true },
    { name: 'Grant & Funding Matcher', zoho: false, sf: false, hub: false, gusto: false, align: false, us: true },
    { name: 'Directory + Auto-Discovery (17K/day)', zoho: false, sf: false, hub: false, gusto: false, align: 'partial', us: true },
    { name: 'Voice AI Interface (WebRTC)', zoho: false, sf: 'enterprise', hub: false, gusto: false, align: false, us: true },
    { name: 'Self-Healing Infrastructure', zoho: false, sf: false, hub: false, gusto: false, align: false, us: true },
    { name: 'Patent Filed (27 Claims)', zoho: false, sf: true, hub: true, gusto: true, align: false, us: true },
    { name: '6-Country Diaspora Coverage', zoho: false, sf: false, hub: false, gusto: false, align: false, us: true },
  ];

  const renderCell = (value: boolean | string) => {
    if (value === true) return <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />;
    if (value === 'partial' || value === 'enterprise') return (
      <div className="flex flex-col items-center">
        <Minus className="w-4 h-4 text-yellow-500" />
        {value === 'enterprise' && <span className="text-[9px] text-yellow-500/70">Enterprise</span>}
      </div>
    );
    return <X className="w-4 h-4 text-red-400/40 mx-auto" />;
  };

  return (
    <div className="h-full flex items-center justify-center px-4 py-8">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-mansagold/80 mb-2">Perplexity AI Validated</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Competitive <span className="text-mansagold">Landscape</span>
          </h2>
          <p className="text-base text-white/60 max-w-3xl mx-auto">
            "Nothing like this exists." — Vertical + Agentic + Community-Specific + Full Operating System
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden bg-black/80 border border-mansagold/30">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 text-white font-bold text-xs">Feature</th>
                    {competitors.map((comp, i) => (
                      <th
                        key={i}
                        className={`text-center p-3 font-bold text-xs ${
                          comp.highlight
                            ? 'bg-mansagold/20 text-mansagold border-x border-mansagold/30'
                            : 'text-white/60'
                        }`}
                      >
                        <div className="font-bold">{comp.name}</div>
                        <div className="text-[10px] font-normal opacity-60">{comp.type}</div>
                        <div className="text-[10px] font-normal text-mansagold/70 mt-0.5">{comp.price}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, i) => (
                    <motion.tr
                      key={i}
                      className="border-b border-white/5 hover:bg-white/5"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.04 }}
                    >
                      <td className="p-2.5 text-white font-medium text-xs">{feature.name}</td>
                      <td className="p-2.5">{renderCell(feature.zoho)}</td>
                      <td className="p-2.5">{renderCell(feature.sf)}</td>
                      <td className="p-2.5">{renderCell(feature.hub)}</td>
                      <td className="p-2.5">{renderCell(feature.gusto)}</td>
                      <td className="p-2.5">{renderCell(feature.align)}</td>
                      <td className="p-2.5 bg-mansagold/10 border-x border-mansagold/20">{renderCell(feature.us)}</td>
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
          className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <Card className="p-3 bg-black/60 border border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Category You Own</p>
            <p className="text-sm text-white font-semibold">
              Vertical + Agentic + Community + Full OS
            </p>
          </Card>
          <Card className="p-3 bg-black/60 border border-mansagold/30">
            <p className="text-xs text-mansagold/70 uppercase tracking-wider mb-1">Permanent Moat</p>
            <p className="text-sm text-white font-semibold">
              23+ autonomous services · 294+ tables · Patent protected
            </p>
          </Card>
          <Card className="p-3 bg-black/60 border border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Price Advantage</p>
            <p className="text-sm text-white font-semibold">
              $149/mo flat vs $125+/user · 10–38x value multiplier
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide8Competitive;
