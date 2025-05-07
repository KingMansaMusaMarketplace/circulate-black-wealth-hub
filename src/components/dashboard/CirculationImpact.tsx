
import React from 'react';
import { Button } from '@/components/ui/button';

interface ImpactMetrics {
  totalSaved: number;
  businessesSupported: number;
  totalScans: number;
}

interface CirculationImpactProps {
  metrics: ImpactMetrics;
}

const CirculationImpact: React.FC<CirculationImpactProps> = ({ metrics }) => {
  return (
    <div className="bg-mansablue rounded-xl p-6 text-white">
      <h2 className="text-lg font-bold mb-4">Your Circulation Impact</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">${metrics.totalSaved}</p>
          <p className="text-xs">Total Saved</p>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{metrics.businessesSupported}</p>
          <p className="text-xs">Businesses Supported</p>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{metrics.totalScans}</p>
          <p className="text-xs">Total Scans</p>
        </div>
      </div>
      <p className="text-white/80 text-sm mb-4">
        Every time you scan and support a Black-owned business, you help extend the circulation of Black dollars in our community.
      </p>
      <div className="flex justify-center">
        <Button className="bg-mansagold hover:bg-mansagold-dark text-white">
          Share Your Impact
        </Button>
      </div>
    </div>
  );
};

export default CirculationImpact;
