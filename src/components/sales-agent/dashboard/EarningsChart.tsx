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
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-display font-semibold text-foreground">
            <TrendingUp className="h-5 w-5 text-primary/60" />
            Earnings Trend
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground">
            Track your earnings over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground font-body">
            No earnings data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-display font-semibold text-foreground">
          <TrendingUp className="h-5 w-5 text-primary/60" />
          Earnings Trend
        </CardTitle>
        <CardDescription className="font-body text-muted-foreground">
          Track your earnings over time by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
            <XAxis 
              dataKey="month" 
              className="text-xs font-body"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs font-body"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                backdropFilter: 'blur(16px)',
                fontFamily: 'var(--font-body)'
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Legend wrapperStyle={{ fontFamily: 'var(--font-body)' }} />
            <Line 
              type="monotone" 
              dataKey="direct" 
              stroke="hsl(142 76% 36%)" 
              name="Direct Commissions"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="overrides" 
              stroke="hsl(221 83% 53%)" 
              name="Team Overrides"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="bonuses" 
              stroke="hsl(271 91% 65%)" 
              name="Recruitment Bonuses"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EarningsChart;