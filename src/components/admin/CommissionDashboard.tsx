import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Activity, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommissionSummary {
  total_transaction_volume: number;
  total_commission_earned: number;
  total_platform_fees_paid: number;
  net_commission: number;
  total_transactions: number;
  avg_transaction_amount: number;
  avg_commission_amount: number;
  by_type: Record<string, {
    count: number;
    volume: number;
    commission: number;
  }>;
  start_date: string;
  end_date: string;
}

export const CommissionDashboard = () => {
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const { toast } = useToast();

  const loadCommissionData = async () => {
    try {
      setLoading(true);
      
      let startDate = new Date();
      if (timeRange === '7d') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (timeRange === '30d') {
        startDate.setDate(startDate.getDate() - 30);
      } else if (timeRange === '90d') {
        startDate.setDate(startDate.getDate() - 90);
      } else {
        startDate = new Date('2020-01-01');
      }

      const { data, error } = await supabase.rpc('get_platform_commission_summary', {
        p_start_date: startDate.toISOString(),
        p_end_date: new Date().toISOString()
      });

      if (error) throw error;
      setSummary(data);
    } catch (error) {
      console.error('Error loading commission data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load commission data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommissionData();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No commission data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Platform Commissions</h2>
          <p className="text-muted-foreground">7.5% commission on all transactions</p>
        </div>
        
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.net_commission)}
            </div>
            <p className="text-xs text-muted-foreground">
              After Stripe fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.total_commission_earned)}
            </div>
            <p className="text-xs text-muted-foreground">
              Gross commission earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.total_transaction_volume)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.total_transactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.total_platform_fees_paid)}
            </div>
            <p className="text-xs text-muted-foreground">
              Stripe processing fees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Breakdown by Type</CardTitle>
          <CardDescription>Revenue from different transaction types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary.by_type && Object.entries(summary.by_type).map(([type, data]) => (
              <div key={type} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold capitalize">{type.replace('_', ' ')}</h4>
                  <p className="text-sm text-muted-foreground">{data.count} transactions</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(data.commission)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    from {formatCurrency(data.volume)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Averages */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(summary.avg_transaction_amount)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Average commission: {formatCurrency(summary.avg_commission_amount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commission Rate Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Platform Commission (7.5%)</span>
              <span className="font-semibold">
                {formatCurrency(summary.total_commission_earned)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Stripe Fees (~3%)</span>
              <span className="font-semibold text-red-600">
                -{formatCurrency(summary.total_platform_fees_paid)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-bold">Net Platform Revenue</span>
              <span className="font-bold text-green-600">
                {formatCurrency(summary.net_commission)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Effective rate: ~{((summary.net_commission / summary.total_transaction_volume) * 100).toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
