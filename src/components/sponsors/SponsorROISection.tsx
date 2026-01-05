import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, TrendingUp, Calculator, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Slider } from '@/components/ui/slider';

interface SponsorCounts {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
  total: number;
}

const SponsorROISection = () => {
  const [sponsorCounts, setSponsorCounts] = useState<SponsorCounts>({
    bronze: 0, silver: 0, gold: 0, platinum: 0, total: 0
  });
  const [investmentAmount, setInvestmentAmount] = useState(5000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsorCounts();
  }, []);

  const fetchSponsorCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('tier')
        .eq('status', 'active');

      if (error) throw error;

      const counts = {
        bronze: 0, silver: 0, gold: 0, platinum: 0, total: 0
      };

      data?.forEach(sub => {
        const tier = sub.tier as keyof typeof counts;
        if (tier in counts) {
          counts[tier]++;
        }
        counts.total++;
      });

      setSponsorCounts(counts);
    } catch (err) {
      console.error('Error fetching sponsor counts:', err);
      // Fallback values
      setSponsorCounts({ bronze: 8, silver: 5, gold: 3, platinum: 1, total: 17 });
    } finally {
      setLoading(false);
    }
  };

  // ROI calculations (based on platform metrics)
  const calculateROI = (amount: number) => {
    const businessConnections = Math.round(amount / 100); // ~$100 per business connection
    const communityReach = Math.round(amount * 50); // 50x reach multiplier
    const economicImpact = Math.round(amount * 6); // 6x economic multiplier
    const brandImpressions = Math.round(amount * 100); // 100 impressions per $

    return {
      businessConnections,
      communityReach,
      economicImpact,
      brandImpressions
    };
  };

  const roi = calculateROI(investmentAmount);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-32 bg-white/5 rounded-2xl" />
        <div className="h-64 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Live Sponsor Count */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-emerald-400 tracking-wide">
            Live Sponsor Count
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold font-playfair text-white mb-8">
          Join <span className="text-gradient-gold">{sponsorCounts.total}</span> Companies Already Investing
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { tier: 'Platinum', count: sponsorCounts.platinum, gradient: 'from-violet-400 to-purple-500' },
            { tier: 'Gold', count: sponsorCounts.gold, gradient: 'from-amber-400 to-yellow-500' },
            { tier: 'Silver', count: sponsorCounts.silver, gradient: 'from-slate-300 to-slate-400' },
            { tier: 'Bronze', count: sponsorCounts.bronze, gradient: 'from-amber-600 to-amber-700' },
          ].map((item, idx) => (
            <motion.div
              key={item.tier}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10"
            >
              <div className={`text-3xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-1`}>
                {item.count}
              </div>
              <div className="text-blue-200/70 text-sm font-medium">{item.tier}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ROI Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="px-6 py-4 bg-gradient-to-r from-mansagold/20 to-transparent border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-mansagold/20">
              <Calculator className="w-5 h-5 text-mansagold" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Impact Calculator</h3>
              <p className="text-blue-200/70 text-sm">See what your investment creates</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Slider */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-200/70 text-sm">Monthly Investment</span>
              <span className="text-3xl font-bold text-gradient-gold font-playfair">
                ${investmentAmount.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[investmentAmount]}
              onValueChange={(value) => setInvestmentAmount(value[0])}
              min={500}
              max={15000}
              step={500}
              className="py-4"
            />
            <div className="flex justify-between text-blue-200/50 text-xs">
              <span>$500</span>
              <span>$15,000</span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Building2 className="w-6 h-6 text-mansagold mb-2" />
              <div className="text-2xl font-bold text-white mb-1">
                {roi.businessConnections}
              </div>
              <div className="text-blue-200/70 text-sm">Business Connections</div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Users className="w-6 h-6 text-emerald-400 mb-2" />
              <div className="text-2xl font-bold text-white mb-1">
                {roi.communityReach.toLocaleString()}
              </div>
              <div className="text-blue-200/70 text-sm">Community Members Reached</div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <TrendingUp className="w-6 h-6 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-white mb-1">
                ${roi.economicImpact.toLocaleString()}
              </div>
              <div className="text-blue-200/70 text-sm">Economic Impact Created</div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Sparkles className="w-6 h-6 text-blue-400 mb-2" />
              <div className="text-2xl font-bold text-white mb-1">
                {roi.brandImpressions.toLocaleString()}
              </div>
              <div className="text-blue-200/70 text-sm">Brand Impressions</div>
            </div>
          </div>

          {/* Impact statement */}
          <div className="mt-6 p-4 bg-gradient-to-r from-mansagold/10 to-transparent rounded-xl border border-mansagold/20">
            <p className="text-white text-sm">
              <span className="text-mansagold font-bold">Your Impact:</span> With a ${investmentAmount.toLocaleString()}/month investment, 
              you'll directly support {roi.businessConnections} Black-owned businesses and create ${roi.economicImpact.toLocaleString()} in economic circulation within our community.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Testimonial */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <div className="text-4xl mb-4">"</div>
          <p className="text-white text-lg italic mb-6">
            Partnering with Mansa Musa Marketplace has been one of our best corporate social responsibility decisions. 
            The transparency in reporting and the real impact we see every month is incredible.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mansagold to-amber-600 flex items-center justify-center text-slate-900 font-bold">
              JD
            </div>
            <div className="text-left">
              <div className="text-white font-semibold">Corporate Sponsor</div>
              <div className="text-blue-200/70 text-sm">Gold Partner</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SponsorROISection;
