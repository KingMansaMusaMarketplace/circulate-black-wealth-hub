import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MousePointer, UserPlus, CreditCard, TrendingDown } from 'lucide-react';

interface FunnelData {
  clicks: number;
  signups: number;
  conversions: number;
}

interface PartnerFunnelChartProps {
  data: FunnelData;
}

const PartnerFunnelChart: React.FC<PartnerFunnelChartProps> = ({ data }) => {
  const { clicks, signups, conversions } = data;
  
  // Calculate percentages
  const signupRate = clicks > 0 ? ((signups / clicks) * 100).toFixed(1) : '0';
  const conversionRate = signups > 0 ? ((conversions / signups) * 100).toFixed(1) : '0';
  const overallRate = clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : '0';
  
  // Calculate bar widths (relative to max which is clicks)
  const maxWidth = 100;
  const signupWidth = clicks > 0 ? (signups / clicks) * maxWidth : 0;
  const conversionWidth = clicks > 0 ? (conversions / clicks) * maxWidth : 0;

  const stages = [
    {
      label: 'Link Clicks',
      value: clicks,
      width: maxWidth,
      color: 'bg-blue-500',
      icon: MousePointer,
      rate: null,
    },
    {
      label: 'Signups',
      value: signups,
      width: signupWidth,
      color: 'bg-amber-500',
      icon: UserPlus,
      rate: `${signupRate}% of clicks`,
    },
    {
      label: 'Paid Conversions',
      value: conversions,
      width: conversionWidth,
      color: 'bg-emerald-500',
      icon: CreditCard,
      rate: `${conversionRate}% of signups`,
    },
  ];

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-amber-400" />
          Conversion Funnel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div key={stage.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">{stage.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">{stage.value.toLocaleString()}</span>
                  {stage.rate && (
                    <span className="text-xs text-slate-500 ml-2">({stage.rate})</span>
                  )}
                </div>
              </div>
              <div className="h-8 bg-slate-900/60 rounded-lg overflow-hidden relative">
                <div 
                  className={`h-full ${stage.color} transition-all duration-500 rounded-lg`}
                  style={{ width: `${stage.width}%` }}
                />
                {idx < stages.length - 1 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <span className="text-xs text-slate-500">
                      {idx === 0 && signupRate}% →
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Overall Rate */}
        <div className="pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Overall Conversion Rate</span>
            <span className="text-lg font-bold text-emerald-400">{overallRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerFunnelChart;
