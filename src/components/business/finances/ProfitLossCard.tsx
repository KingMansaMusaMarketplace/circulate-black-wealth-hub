import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface FinancialData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

interface ProfitLossCardProps {
  data: FinancialData;
}

const ProfitLossCard: React.FC<ProfitLossCardProps> = ({ data }) => {
  const profitMargin = data.totalRevenue > 0 
    ? ((data.netProfit / data.totalRevenue) * 100).toFixed(1)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Profit & Loss Statement
        </CardTitle>
        <CardDescription>
          Summary of revenues, costs, and expenses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Revenue Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
              <span className="font-semibold text-sm">Total Revenue</span>
            </div>
            <span className="font-bold text-green-600">
              ${data.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            Income from completed bookings and services
          </p>
        </div>

        <Separator />

        {/* Expenses Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingDown className="h-4 w-4 mr-2 text-red-600" />
              <span className="font-semibold text-sm">Total Expenses</span>
            </div>
            <span className="font-bold text-red-600">
              ${data.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            Operating costs, supplies, and overhead
          </p>
        </div>

        <Separator className="my-4" />

        {/* Net Profit Section */}
        <div className="space-y-2 bg-muted p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className={`h-5 w-5 mr-2 ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              <span className="font-bold">Net Profit</span>
            </div>
            <span className={`font-bold text-lg ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.netProfit >= 0 ? '+' : '-'}${Math.abs(data.netProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center ml-7">
            <span className="text-xs text-muted-foreground">Profit Margin</span>
            <span className={`text-sm font-semibold ${Number(profitMargin) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitMargin}%
            </span>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            {data.netProfit >= 0 ? (
              <>
                <strong>Healthy finances!</strong> Your business is profitable. Consider reinvesting in growth or building cash reserves.
              </>
            ) : (
              <>
                <strong>Review needed.</strong> Expenses exceed revenue. Consider reducing costs or increasing prices.
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitLossCard;
