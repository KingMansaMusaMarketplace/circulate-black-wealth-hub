import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { VacationBooking, VacationProperty } from '@/types/vacation-rental';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, Percent, 
  BedDouble, BarChart3
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval, differenceInDays, isWithinInterval } from 'date-fns';

interface RevenueAnalyticsDashboardProps {
  bookings: VacationBooking[];
  properties: VacationProperty[];
}

const CHART_COLORS = [
  'hsl(45, 93%, 47%)',   // mansagold
  'hsl(210, 100%, 40%)', // mansablue
  'hsl(160, 60%, 45%)',  // emerald
  'hsl(280, 60%, 50%)',  // purple
  'hsl(20, 80%, 55%)',   // orange
  'hsl(340, 70%, 50%)',  // pink
];

const RevenueAnalyticsDashboard: React.FC<RevenueAnalyticsDashboardProps> = ({ bookings, properties }) => {
  const [timeRange, setTimeRange] = useState<'6' | '12'>('12');
  const months = parseInt(timeRange);

  const analytics = useMemo(() => {
    const now = new Date();
    const rangeStart = subMonths(startOfMonth(now), months - 1);
    const rangeEnd = endOfMonth(now);
    const monthIntervals = eachMonthOfInterval({ start: rangeStart, end: rangeEnd });

    // Revenue by month
    const revenueByMonth = monthIntervals.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthBookings = bookings.filter(b => {
        const checkIn = new Date(b.check_in_date);
        return (b.status === 'confirmed' || b.status === 'completed') &&
          isWithinInterval(checkIn, { start: monthStart, end: monthEnd });
      });

      const revenue = monthBookings.reduce((sum, b) => sum + (b.host_payout || 0), 0);
      const nightsBooked = monthBookings.reduce((sum, b) => {
        return sum + differenceInDays(new Date(b.check_out_date), new Date(b.check_in_date));
      }, 0);
      const totalAvailableNights = properties.filter(p => p.is_active).length * 30;
      const occupancy = totalAvailableNights > 0 ? Math.round((nightsBooked / totalAvailableNights) * 100) : 0;

      return {
        month: format(month, 'MMM yyyy'),
        monthShort: format(month, 'MMM'),
        revenue: Math.round(revenue * 100) / 100,
        bookings: monthBookings.length,
        nightsBooked,
        occupancy: Math.min(occupancy, 100),
      };
    });

    // Revenue by property
    const revenueByProperty = properties.map(prop => {
      const propBookings = bookings.filter(b => 
        b.property_id === prop.id && (b.status === 'confirmed' || b.status === 'completed')
      );
      const revenue = propBookings.reduce((sum, b) => sum + (b.host_payout || 0), 0);
      return {
        name: prop.title.length > 20 ? prop.title.slice(0, 20) + '…' : prop.title,
        revenue: Math.round(revenue * 100) / 100,
        bookings: propBookings.length,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // Seasonal analysis
    const seasonalData = [
      { season: 'Winter', months: [0, 1, 11] },
      { season: 'Spring', months: [2, 3, 4] },
      { season: 'Summer', months: [5, 6, 7] },
      { season: 'Fall', months: [8, 9, 10] },
    ].map(({ season, months: seasonMonths }) => {
      const seasonBookings = bookings.filter(b => {
        const m = new Date(b.check_in_date).getMonth();
        return seasonMonths.includes(m) && (b.status === 'confirmed' || b.status === 'completed');
      });
      const revenue = seasonBookings.reduce((sum, b) => sum + (b.host_payout || 0), 0);
      return { season, revenue: Math.round(revenue), bookings: seasonBookings.length };
    });

    // Summary stats
    const totalRevenue = revenueByMonth.reduce((sum, m) => sum + m.revenue, 0);
    const avgMonthlyRevenue = totalRevenue / months;
    const avgOccupancy = revenueByMonth.length > 0
      ? Math.round(revenueByMonth.reduce((sum, m) => sum + m.occupancy, 0) / revenueByMonth.length)
      : 0;
    const totalNights = revenueByMonth.reduce((sum, m) => sum + m.nightsBooked, 0);
    const avgNightlyRate = totalNights > 0 ? totalRevenue / totalNights : 0;

    // Trend (last 3 months vs prior 3)
    const recent = revenueByMonth.slice(-3).reduce((sum, m) => sum + m.revenue, 0);
    const prior = revenueByMonth.slice(-6, -3).reduce((sum, m) => sum + m.revenue, 0);
    const trend = prior > 0 ? Math.round(((recent - prior) / prior) * 100) : 0;

    return { revenueByMonth, revenueByProperty, seasonalData, totalRevenue, avgMonthlyRevenue, avgOccupancy, avgNightlyRate, trend };
  }, [bookings, properties, months]);

  const statCards = [
    { label: 'Total Revenue', value: `$${analytics.totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-mansagold' },
    { label: 'Avg Monthly', value: `$${analytics.avgMonthlyRevenue.toFixed(0)}`, icon: BarChart3, color: 'text-blue-400' },
    { label: 'Avg Occupancy', value: `${analytics.avgOccupancy}%`, icon: BedDouble, color: 'text-emerald-400' },
    { label: 'Avg Nightly Rate', value: `$${analytics.avgNightlyRate.toFixed(0)}`, icon: Calendar, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Revenue Analytics</h2>
          <p className="text-sm text-white/50">Track your earnings, occupancy, and performance</p>
        </div>
        <div className="flex items-center gap-3">
          {analytics.trend !== 0 && (
            <Badge className={analytics.trend > 0 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
              : 'bg-red-500/20 text-red-300 border-red-500/30'
            }>
              {analytics.trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {analytics.trend > 0 ? '+' : ''}{analytics.trend}% vs prior quarter
            </Badge>
          )}
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as '6' | '12')}>
            <SelectTrigger className="w-[140px] bg-slate-800 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">Last 6 months</SelectItem>
              <SelectItem value="12">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="bg-slate-800/50 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs text-white/50">{label}</span>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      <Card className="bg-slate-800/50 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base">Revenue Trend</CardTitle>
          <CardDescription className="text-white/50">Monthly earnings over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.revenueByMonth}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="monthShort" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  labelStyle={{ color: 'white' }}
                  itemStyle={{ color: 'hsl(45, 93%, 47%)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(45, 93%, 47%)" fill="url(#revenueGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Occupancy & Seasonal Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Rate */}
        <Card className="bg-slate-800/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">Occupancy Rate</CardTitle>
            <CardDescription className="text-white/50">Monthly occupancy percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="monthShort" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    formatter={(value: number) => [`${value}%`, 'Occupancy']}
                  />
                  <Bar dataKey="occupancy" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Performance */}
        <Card className="bg-slate-800/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">Seasonal Performance</CardTitle>
            <CardDescription className="text-white/50">Revenue by season (all time)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.seasonalData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <YAxis type="category" dataKey="season" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} width={60} />
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    formatter={(value: number, name: string) => {
                      if (name === 'revenue') return [`$${value}`, 'Revenue'];
                      return [value, 'Bookings'];
                    }}
                  />
                  <Bar dataKey="revenue" fill="hsl(210, 100%, 40%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Property */}
      {analytics.revenueByProperty.length > 0 && (
        <Card className="bg-slate-800/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">Revenue by Property</CardTitle>
            <CardDescription className="text-white/50">Performance comparison across listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.revenueByProperty}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    formatter={(value: number, name: string) => {
                      if (name === 'revenue') return [`$${value.toFixed(2)}`, 'Revenue'];
                      return [value, 'Bookings'];
                    }}
                  />
                  <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.6)' }} />
                  <Bar dataKey="revenue" name="Revenue" fill="hsl(45, 93%, 47%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bookings" name="Bookings" fill="hsl(210, 100%, 40%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RevenueAnalyticsDashboard;
