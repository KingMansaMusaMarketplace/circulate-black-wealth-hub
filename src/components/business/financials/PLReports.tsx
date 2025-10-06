import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface PLReportsProps {
  businessId: string;
}

export const PLReports: React.FC<PLReportsProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [plData, setPlData] = useState<any>(null);

  useEffect(() => {
    loadPLData();
  }, [businessId, period]);

  const loadPLData = async () => {
    setLoading(true);
    try {
      const startDate = getStartDate(period);
      
      // Fetch revenue from bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('amount, booking_date, status')
        .eq('business_id', businessId)
        .gte('booking_date', startDate.toISOString());

      // Fetch expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, expense_date, category')
        .eq('business_id', businessId)
        .gte('expense_date', startDate.toISOString().split('T')[0]);

      const totalRevenue = bookings?.filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + Number(b.amount), 0) || 0;
      
      const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      // Group by time period
      const revenueByPeriod = groupByPeriod(bookings || [], 'booking_date', 'amount', period);
      const expensesByPeriod = groupByPeriod(expenses || [], 'expense_date', 'amount', period);

      // Combine for chart
      const chartData = Object.keys(revenueByPeriod).map(key => ({
        period: key,
        revenue: revenueByPeriod[key] || 0,
        expenses: expensesByPeriod[key] || 0,
        profit: (revenueByPeriod[key] || 0) - (expensesByPeriod[key] || 0)
      }));

      // Expense breakdown
      const expensesByCategory = expenses?.reduce((acc: any, e: any) => {
        acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
        return acc;
      }, {});

      setPlData({
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin,
        chartData,
        expensesByCategory: Object.entries(expensesByCategory || {}).map(([name, value]) => ({
          name,
          value
        }))
      });
    } catch (error) {
      console.error('Error loading P&L data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const groupByPeriod = (data: any[], dateField: string, valueField: string, periodType: string) => {
    return data.reduce((acc: any, item: any) => {
      const date = new Date(item[dateField]);
      let key: string;
      
      if (periodType === 'month') {
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (periodType === 'quarter') {
        key = date.toLocaleDateString('en-US', { month: 'short' });
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short' });
      }
      
      acc[key] = (acc[key] || 0) + Number(item[valueField]);
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!plData) {
    return <div className="text-center py-12">No financial data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Profit & Loss Report</h3>
          <p className="text-muted-foreground">Track your business financial performance</p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${plData.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Income from bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${plData.totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Business costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold flex items-center gap-2 ${plData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {plData.netProfit >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              ${Math.abs(plData.netProfit).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {plData.netProfit >= 0 ? 'Profit' : 'Loss'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plData.profitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Net margin</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses</CardTitle>
          <CardDescription>Compare your income and spending over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={plData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profit Trend</CardTitle>
          <CardDescription>Track your profitability over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={plData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={2} name="Net Profit" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {plData.expensesByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Where your money is going</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plData.expensesByCategory.map((cat: any) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <span className="font-medium">{cat.name}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(cat.value / plData.totalExpenses) * 100}%` }}
                      />
                    </div>
                    <span className="font-bold w-24 text-right">${cat.value.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};