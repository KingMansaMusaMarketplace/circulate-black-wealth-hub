import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Calculator, DollarSign, TrendingUp, Users, Utensils } from 'lucide-react';

interface PartnerRevenueCalculatorProps {
  defaultBusinessCount?: number;
  businessType?: string;
  partnerName?: string;
}

const PartnerRevenueCalculator: React.FC<PartnerRevenueCalculatorProps> = ({
  defaultBusinessCount = 22500,
  businessType = "restaurants",
  partnerName = "Partner"
}) => {
  const [businessCount, setBusinessCount] = useState(defaultBusinessCount);
  const [bookingsPerMonth, setBookingsPerMonth] = useState(10);
  const [avgBookingValue, setAvgBookingValue] = useState(50);

  const PLATFORM_FEE_RATE = 0.075; // 7.5%
  const PARTNER_SHARE_RATE = 0.10; // 10% of platform fees
  const SIGNUP_BONUS = 5; // $5 per business signup

  const calculations = useMemo(() => {
    const totalBookingValue = businessCount * bookingsPerMonth * avgBookingValue;
    const platformFees = totalBookingValue * PLATFORM_FEE_RATE;
    const partnerRevenue = platformFees * PARTNER_SHARE_RATE;
    const signupBonuses = businessCount * SIGNUP_BONUS;
    
    return {
      monthlyTransactionRevenue: partnerRevenue,
      annualTransactionRevenue: partnerRevenue * 12,
      signupBonuses,
      totalFirstYearRevenue: (partnerRevenue * 12) + signupBonuses,
      totalBookingValue,
      platformFees,
      businessRetention: totalBookingValue * 0.925 // 92.5% kept by businesses
    };
  }, [businessCount, bookingsPerMonth, avgBookingValue]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <Card className="bg-black/80 border-2 border-mansagold overflow-hidden">
      <CardHeader className="bg-mansagold/10 border-b border-mansagold/30">
        <CardTitle className="flex items-center gap-3 text-white text-2xl">
          <div className="w-12 h-12 rounded-full bg-mansagold/20 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-mansagold" />
          </div>
          Revenue Projection Calculator
        </CardTitle>
        <p className="text-blue-200/70">
          See your potential earnings as a 1325.AI Founding Partner
        </p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Inputs */}
        <div className="space-y-6">
          {/* Business Count */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-white font-medium">
                <Utensils className="w-4 h-4 text-mansagold" />
                Number of {businessType}
              </label>
              <span className="text-mansagold font-bold text-xl">{businessCount.toLocaleString()}</span>
            </div>
            <Slider
              value={[businessCount]}
              onValueChange={([value]) => setBusinessCount(value)}
              min={1000}
              max={50000}
              step={500}
              className="py-2"
            />
            <p className="text-xs text-blue-300/60">
              {partnerName} currently has {defaultBusinessCount.toLocaleString()} listings
            </p>
          </div>

          {/* Bookings Per Month */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-white font-medium">
                <TrendingUp className="w-4 h-4 text-mansagold" />
                Avg. bookings per business/month
              </label>
              <span className="text-mansagold font-bold text-xl">{bookingsPerMonth}</span>
            </div>
            <Slider
              value={[bookingsPerMonth]}
              onValueChange={([value]) => setBookingsPerMonth(value)}
              min={1}
              max={50}
              step={1}
              className="py-2"
            />
          </div>

          {/* Average Booking Value */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-white font-medium">
                <DollarSign className="w-4 h-4 text-mansagold" />
                Avg. booking value
              </label>
              <span className="text-mansagold font-bold text-xl">${avgBookingValue}</span>
            </div>
            <Slider
              value={[avgBookingValue]}
              onValueChange={([value]) => setAvgBookingValue(value)}
              min={10}
              max={200}
              step={5}
              className="py-2"
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-mansagold/20 to-mansagold/5 rounded-xl p-5 border border-mansagold/40"
          >
            <p className="text-blue-200/70 text-sm mb-1">Monthly Partner Revenue</p>
            <p className="text-3xl font-bold text-mansagold">
              {formatCurrency(calculations.monthlyTransactionRevenue)}
            </p>
            <p className="text-xs text-blue-300/60 mt-1">
              From 10% share of 7.5% platform fees
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl p-5 border border-green-500/40"
          >
            <p className="text-blue-200/70 text-sm mb-1">Annual Partner Revenue</p>
            <p className="text-3xl font-bold text-green-400">
              {formatCurrency(calculations.annualTransactionRevenue)}
            </p>
            <p className="text-xs text-blue-300/60 mt-1">
              Recurring revenue every year
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl p-5 border border-blue-500/40"
          >
            <p className="text-blue-200/70 text-sm mb-1">Signup Bonuses</p>
            <p className="text-3xl font-bold text-blue-400">
              {formatCurrency(calculations.signupBonuses)}
            </p>
            <p className="text-xs text-blue-300/60 mt-1">
              $5 per business signup (one-time)
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl p-5 border border-purple-500/40"
          >
            <p className="text-blue-200/70 text-sm mb-1">First Year Total</p>
            <p className="text-3xl font-bold text-purple-400">
              {formatCurrency(calculations.totalFirstYearRevenue)}
            </p>
            <p className="text-xs text-blue-300/60 mt-1">
              Bonuses + Annual Revenue
            </p>
          </motion.div>
        </div>

        {/* Business Value */}
        <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-mansagold" />
            <h4 className="font-semibold text-white">Value to Your Businesses</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-200/70">Total Booking Revenue</p>
              <p className="text-xl font-bold text-white">
                {formatCurrency(calculations.totalBookingValue)}<span className="text-sm font-normal text-blue-300/60">/mo</span>
              </p>
            </div>
            <div>
              <p className="text-blue-200/70">Business Retention (92.5%)</p>
              <p className="text-xl font-bold text-green-400">
                {formatCurrency(calculations.businessRetention)}<span className="text-sm font-normal text-blue-300/60">/mo</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerRevenueCalculator;
