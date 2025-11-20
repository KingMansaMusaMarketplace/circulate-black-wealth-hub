
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Building2 } from 'lucide-react';

interface CirculationImpactProps {
  metrics: {
    totalSaved: number;
    businessesSupported: number;
    totalScans: number;
  };
}

const CirculationImpact: React.FC<CirculationImpactProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Total Saved</CardTitle>
          <DollarSign className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">${metrics.totalSaved}</div>
          <p className="text-xs text-white/70">
            Supporting Black businesses
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Businesses Supported</CardTitle>
          <Building2 className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{metrics.businessesSupported}</div>
          <p className="text-xs text-white/70">
            Black-owned businesses
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">QR Scans</CardTitle>
          <TrendingUp className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{metrics.totalScans}</div>
          <p className="text-xs text-white/70">
            Total interactions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CirculationImpact;
