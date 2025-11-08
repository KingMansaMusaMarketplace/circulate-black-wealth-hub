import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface EarningsChartProps {
  commissions: any[];
  teamOverrides: any[];
  recruitmentBonuses: any[];
}

const EarningsChart: React.FC<EarningsChartProps> = ({ 
  commissions, 
  teamOverrides, 
  recruitmentBonuses 
}) => {
  // Aggregate data by month
  const aggregateByMonth = () => {
    const monthlyData: Record<string, any> = {};

    // Process commissions
    commissions.forEach(c => {
      if (c.status === 'paid' && c.paid_date) {
        const month = new Date(c.paid_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        if (!monthlyData[month]) {
          monthlyData[month] = { month, direct: 0, overrides: 0, bonuses: 0 };
        }
        monthlyData[month].direct += parseFloat(c.amount);
      }
    });

    // Process team overrides
    teamOverrides.forEach(o => {
      if (o.status === 'paid' && o.earned_date) {
        const month = new Date(o.earned_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        if (!monthlyData[month]) {
          monthlyData[month] = { month, direct: 0, overrides: 0, bonuses: 0 };
        }
        monthlyData[month].overrides += parseFloat(o.override_amount);
      }
    });

    // Process recruitment bonuses
    recruitmentBonuses.forEach(b => {
      if (b.status === 'paid' && b.earned_date) {
        const month = new Date(b.earned_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        if (!monthlyData[month]) {
          monthlyData[month] = { month, direct: 0, overrides: 0, bonuses: 0 };
        }
        monthlyData[month].bonuses += parseFloat(b.bonus_amount);
      }
    });

    return Object.values(monthlyData).sort((a, b) => {
      return new Date(a.month).getTime() - new Date(b.month).getTime();
    });
  };

  const chartData = aggregateByMonth();

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Earnings Trend
          </CardTitle>
          <CardDescription>Track your earnings over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No earnings data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Earnings Trend
        </CardTitle>
        <CardDescription>Track your earnings over time by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="direct" 
              stroke="hsl(var(--primary))" 
              name="Direct Commissions"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="overrides" 
              stroke="hsl(var(--chart-2))" 
              name="Team Overrides"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="bonuses" 
              stroke="hsl(var(--chart-3))" 
              name="Recruitment Bonuses"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EarningsChart;
