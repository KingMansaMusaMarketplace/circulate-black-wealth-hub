import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface CashFlowData {
  month: string;
  amount: number;
}

interface CashFlowChartProps {
  revenueData: CashFlowData[];
  expensesData: CashFlowData[];
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ revenueData, expensesData }) => {
  // Combine revenue and expenses data by month
  const combinedData = revenueData.map(rev => {
    const expense = expensesData.find(exp => exp.month === rev.month);
    return {
      month: rev.month,
      revenue: rev.amount,
      expenses: expense?.amount || 0,
      netCashFlow: rev.amount - (expense?.amount || 0)
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Cash Flow Analysis
        </CardTitle>
        <CardDescription>
          Track your income, expenses, and net cash flow over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={combinedData}>
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
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Revenue"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Expenses"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="netCashFlow" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Net Cash Flow"
              dot={{ r: 4 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CashFlowChart;
