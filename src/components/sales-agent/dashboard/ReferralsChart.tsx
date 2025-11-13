import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';

interface ReferralsChartProps {
  referrals: any[];
}

const ReferralsChart: React.FC<ReferralsChartProps> = ({ referrals }) => {
  // Aggregate referrals by month
  const aggregateByMonth = () => {
    const monthlyData: Record<string, number> = {};

    referrals.forEach(ref => {
      const month = new Date(ref.referral_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  };

  const chartData = aggregateByMonth();

  if (chartData.length === 0) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-display font-semibold text-foreground">
            <Users className="h-5 w-5 text-primary/60" />
            Referrals by Month
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground">
            Track your referral activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground font-body">
            No referral data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-display font-semibold text-foreground">
          <Users className="h-5 w-5 text-primary/60" />
          Referrals by Month
        </CardTitle>
        <CardDescription className="font-body text-muted-foreground">
          Track your monthly referral performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
            <XAxis 
              dataKey="month" 
              className="text-xs font-body"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs font-body"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                backdropFilter: 'blur(16px)',
                fontFamily: 'var(--font-body)'
              }}
              formatter={(value: number) => [`${value} referrals`, 'Count']}
            />
            <Bar 
              dataKey="count" 
              fill="hsl(var(--primary))" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ReferralsChart;