import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { sponsorMetricsService } from '@/lib/services/sponsor-metrics-service';

const SponsorMetricsControl: React.FC = () => {
  const [calculating, setCalculating] = useState(false);

  const handleCalculateMetrics = async () => {
    setCalculating(true);
    toast.loading('Calculating impact metrics for all sponsors...');

    try {
      const result = await sponsorMetricsService.calculateAllMetrics();

      if (result.success) {
        toast.success('Impact metrics calculated successfully!');
      } else {
        toast.error(result.error || 'Failed to calculate metrics');
      }
    } catch (error: any) {
      toast.error('An error occurred while calculating metrics');
      console.error(error);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sponsor Impact Metrics</CardTitle>
            <CardDescription>
              Calculate and update impact metrics for all corporate sponsors
            </CardDescription>
          </div>
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Automated Calculation</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Metrics are automatically calculated based on real marketplace transactions. This includes:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Number of unique Black-owned businesses supported</li>
            <li>• Total transactions facilitated since subscription start</li>
            <li>• Community reach (estimated people impacted)</li>
            <li>• Economic impact with 2.3x multiplier effect</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Recommended Schedule</h4>
              <p className="text-sm text-blue-800">
                Run this calculation daily at midnight to keep sponsor dashboards updated with the latest impact data.
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleCalculateMetrics}
          disabled={calculating}
          className="w-full"
          size="lg"
        >
          {calculating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Calculating Metrics...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Calculate Metrics Now
            </>
          )}
        </Button>

        <div className="text-xs text-center text-muted-foreground">
          Last calculation: {new Date().toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorMetricsControl;
