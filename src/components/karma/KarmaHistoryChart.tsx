import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { format, subDays, parseISO, startOfDay } from 'date-fns';

interface KarmaTransaction {
  id: string;
  change_amount: number;
  balance_after: number;
  created_at: string;
}

interface KarmaHistoryChartProps {
  transactions: KarmaTransaction[];
}

const KarmaHistoryChart: React.FC<KarmaHistoryChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    // Get last 30 days of data
    const days = 30;
    const dataPoints: { date: Date; balance: number }[] = [];
    
    // Sort transactions by date ascending
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Create daily balance snapshots
    const today = startOfDay(new Date());
    let lastBalance = 100; // Default starting balance

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dayStart = startOfDay(date);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      // Find the last transaction on or before this day
      const dayTransactions = sorted.filter(t => {
        const tDate = new Date(t.created_at);
        return tDate <= dayEnd;
      });

      if (dayTransactions.length > 0) {
        lastBalance = dayTransactions[dayTransactions.length - 1].balance_after;
      }

      dataPoints.push({ date, balance: lastBalance });
    }

    return dataPoints;
  }, [transactions]);

  const maxBalance = Math.max(...chartData.map(d => d.balance), 100);
  const minBalance = Math.min(...chartData.map(d => d.balance), 0);
  const range = maxBalance - minBalance || 1;

  const firstBalance = chartData[0]?.balance || 100;
  const lastBalance = chartData[chartData.length - 1]?.balance || 100;
  const trend = lastBalance - firstBalance;
  const trendPercent = ((trend / firstBalance) * 100).toFixed(1);

  return (
    <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg flex items-center justify-between">
          <span>Karma History (30 Days)</span>
          <div className={`flex items-center gap-1 text-sm font-normal ${
            trend >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {trend >= 0 ? '+' : ''}{trendPercent}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Simple Line Chart */}
        <div className="relative h-48">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-xs text-slate-500">
            <span>{Math.round(maxBalance)}</span>
            <span>{Math.round((maxBalance + minBalance) / 2)}</span>
            <span>{Math.round(minBalance)}</span>
          </div>

          {/* Chart area */}
          <div className="ml-10 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-slate-700/50" />
              <div className="border-t border-slate-700/50" />
              <div className="border-t border-slate-700/50" />
            </div>

            {/* SVG Line Chart */}
            <svg 
              className="w-full h-full" 
              viewBox={`0 0 ${chartData.length * 10} 100`}
              preserveAspectRatio="none"
            >
              {/* Gradient fill */}
              <defs>
                <linearGradient id="karmaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(234, 179, 8)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(234, 179, 8)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <path
                d={`
                  M 0 ${100 - ((chartData[0]?.balance - minBalance) / range) * 100}
                  ${chartData.map((d, i) => 
                    `L ${i * 10} ${100 - ((d.balance - minBalance) / range) * 100}`
                  ).join(' ')}
                  L ${(chartData.length - 1) * 10} 100
                  L 0 100
                  Z
                `}
                fill="url(#karmaGradient)"
              />

              {/* Line */}
              <path
                d={`
                  M 0 ${100 - ((chartData[0]?.balance - minBalance) / range) * 100}
                  ${chartData.map((d, i) => 
                    `L ${i * 10} ${100 - ((d.balance - minBalance) / range) * 100}`
                  ).join(' ')}
                `}
                fill="none"
                stroke="rgb(234, 179, 8)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />

              {/* Data points */}
              {chartData.filter((_, i) => i % 5 === 0).map((d, i) => (
                <circle
                  key={i}
                  cx={i * 50}
                  cy={100 - ((d.balance - minBalance) / range) * 100}
                  r="3"
                  fill="rgb(234, 179, 8)"
                />
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500 pt-1">
              <span>{format(chartData[0]?.date || new Date(), 'MMM d')}</span>
              <span>{format(chartData[Math.floor(chartData.length / 2)]?.date || new Date(), 'MMM d')}</span>
              <span>{format(chartData[chartData.length - 1]?.date || new Date(), 'MMM d')}</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-slate-500 text-xs">Start</p>
            <p className="text-white font-semibold">{Math.round(firstBalance)}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Current</p>
            <p className="text-mansagold font-semibold">{Math.round(lastBalance)}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Change</p>
            <p className={`font-semibold ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend >= 0 ? '+' : ''}{Math.round(trend)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KarmaHistoryChart;
