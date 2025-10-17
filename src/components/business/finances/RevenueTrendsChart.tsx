import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface RevenueData {
  month: string;
  amount: number;
}

interface RevenueTrendsChartProps {
  data: RevenueData[];
}

const RevenueTrendsChart: React.FC<RevenueTrendsChartProps> = ({ data }) => {
  // Calculate growth rate
  const growthRate = data.length >= 2
    ? (((data[data.length - 1].amount - data[data.length - 2].amount) / data[data.length - 2].amount) * 100).toFixed(1)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Revenue Trends
        </CardTitle>
        <CardDescription>
          Month-over-month revenue performance
          {data.length >= 2 && (
            <span className={`ml-2 font-semibold ${Number(growthRate) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Number(growthRate) >= 0 ? '+' : ''}{growthRate}% vs. last month
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No revenue data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueTrendsChart;
