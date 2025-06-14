
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.totalSaved}</div>
          <p className="text-xs text-muted-foreground">
            Supporting Black businesses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Businesses Supported</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.businessesSupported}</div>
          <p className="text-xs text-muted-foreground">
            Black-owned businesses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalScans}</div>
          <p className="text-xs text-muted-foreground">
            Total interactions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CirculationImpact;
