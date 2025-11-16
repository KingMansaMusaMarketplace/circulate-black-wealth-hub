import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface CashFlowStatementProps {
  businessId: string;
}

export const CashFlowStatement: React.FC<CashFlowStatementProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadCashFlow();
  }, [businessId, period]);

  const getStartDate = (period: string) => {
    const now = new Date();
    switch (period) {
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        return new Date(now.getFullYear(), quarter * 3, 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
  };

  const loadCashFlow = async () => {
    setLoading(true);
    try {
      const startDate = getStartDate(period);

      // Operating Activities - Revenue and Expenses
      const { data: bookings } = await supabase
        .from('bookings')
        .select('amount, status')
        .eq('business_id', businessId)
        .eq('status', 'completed')
        .gte('booking_date', startDate.toISOString());

      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('business_id', businessId)
        .gte('expense_date', startDate.toISOString().split('T')[0]);

      // Investing Activities - Fixed Assets
      const { data: assetPurchases } = await supabase
        .from('fixed_assets')
        .select('purchase_price')
        .eq('business_id', businessId)
        .gte('purchase_date', startDate.toISOString().split('T')[0]);

      const { data: assetDisposals } = await supabase
        .from('fixed_assets')
        .select('disposal_value')
        .eq('business_id', businessId)
        .eq('is_disposed', true)
        .gte('disposal_date', startDate.toISOString().split('T')[0]);

      // Operating cash flow
      const cashFromRevenue = bookings?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;
      const cashPaidExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      const netOperatingCashFlow = cashFromRevenue - cashPaidExpenses;

      // Investing cash flow
      const cashPaidAssets = assetPurchases?.reduce((sum, a) => sum + Number(a.purchase_price), 0) || 0;
      const cashFromAssetSales = assetDisposals?.reduce((sum, a) => sum + (Number(a.disposal_value) || 0), 0) || 0;
      const netInvestingCashFlow = cashFromAssetSales - cashPaidAssets;

      // Financing cash flow (simplified - would include loans, equity)
      const netFinancingCashFlow = 0;

      const netCashFlow = netOperatingCashFlow + netInvestingCashFlow + netFinancingCashFlow;

      setData({
        operating: {
          cashFromRevenue,
          cashPaidExpenses,
          net: netOperatingCashFlow
        },
        investing: {
          cashPaidAssets,
          cashFromAssetSales,
          net: netInvestingCashFlow
        },
        financing: {
          net: netFinancingCashFlow
        },
        netCashFlow
      });
    } catch (error) {
      console.error('Error loading cash flow:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12">No cash flow data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Cash Flow Statement
          </h3>
          <p className="text-muted-foreground">Track cash movements in your business</p>
        </div>
        <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {/* Operating Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Operating Activities</CardTitle>
            <CardDescription>Cash from day-to-day business operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Cash from Revenue</span>
              <span className="font-medium text-green-600">+${data.operating.cashFromRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Cash Paid for Expenses</span>
              <span className="font-medium text-red-600">-${data.operating.cashPaidExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2 font-semibold">
              <span>Net Cash from Operating</span>
              <span className={data.operating.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                {data.operating.net >= 0 ? <TrendingUp className="inline h-4 w-4" /> : <TrendingDown className="inline h-4 w-4" />}
                ${Math.abs(data.operating.net).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Investing Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Investing Activities</CardTitle>
            <CardDescription>Cash from buying/selling assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Cash Paid for Assets</span>
              <span className="font-medium text-red-600">-${data.investing.cashPaidAssets.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Cash from Asset Sales</span>
              <span className="font-medium text-green-600">+${data.investing.cashFromAssetSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2 font-semibold">
              <span>Net Cash from Investing</span>
              <span className={data.investing.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                {data.investing.net >= 0 ? <TrendingUp className="inline h-4 w-4" /> : <TrendingDown className="inline h-4 w-4" />}
                ${Math.abs(data.investing.net).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Net Cash Flow */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Net Increase/Decrease in Cash</span>
              <span className={`text-2xl font-bold ${data.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.netCashFlow >= 0 ? '+' : '-'}${Math.abs(data.netCashFlow).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
