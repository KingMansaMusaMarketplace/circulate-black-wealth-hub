import { useQuery } from '@tanstack/react-query';
import { Calendar, DollarSign, TrendingUp, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { format, startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface BusinessDashboardProps {
  businessId: string;
}

const COLORS = ['#D4AF37', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

export default function BusinessDashboard({ businessId }: BusinessDashboardProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['business-dashboard-stats', businessId],
    queryFn: async () => {
      const now = new Date();
      const thisMonthStart = startOfMonth(now);
      const thisMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));
      const thisWeekStart = startOfWeek(now);
      const thisWeekEnd = endOfWeek(now);

      // Get this month's bookings
      const { data: thisMonthBookings, error: thisMonthError } = await supabase
        .from('bookings')
        .select('*')
        .eq('business_id', businessId)
        .gte('booking_date', thisMonthStart.toISOString())
        .lte('booking_date', thisMonthEnd.toISOString());

      if (thisMonthError) throw thisMonthError;

      // Get last month's bookings
      const { data: lastMonthBookings, error: lastMonthError } = await supabase
        .from('bookings')
        .select('*')
        .eq('business_id', businessId)
        .gte('booking_date', lastMonthStart.toISOString())
        .lte('booking_date', lastMonthEnd.toISOString());

      if (lastMonthError) throw lastMonthError;

      // Get this week's bookings
      const { data: thisWeekBookings, error: thisWeekError } = await supabase
        .from('bookings')
        .select('*')
        .eq('business_id', businessId)
        .gte('booking_date', thisWeekStart.toISOString())
        .lte('booking_date', thisWeekEnd.toISOString());

      if (thisWeekError) throw thisWeekError;

      // Get popular services
      const { data: servicesData, error: servicesError } = await supabase
        .from('bookings')
        .select('service_id, business_services!service_id(name)')
        .eq('business_id', businessId)
        .gte('booking_date', thisMonthStart.toISOString());

      if (servicesError) throw servicesError;

      // Count bookings by service
      const serviceCounts: Record<string, number> = {};
      servicesData?.forEach((booking: any) => {
        const serviceName = booking.business_services?.name || 'Unknown';
        serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
      });

      const popularServices = Object.entries(serviceCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // Calculate stats
      const thisMonthRevenue = thisMonthBookings?.reduce((sum, b) => sum + Number(b.business_amount), 0) || 0;
      const lastMonthRevenue = lastMonthBookings?.reduce((sum, b) => sum + Number(b.business_amount), 0) || 0;
      const revenueGrowth = lastMonthRevenue > 0 
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;

      const thisMonthCount = thisMonthBookings?.length || 0;
      const lastMonthCount = lastMonthBookings?.length || 0;
      const bookingGrowth = lastMonthCount > 0 
        ? ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100 
        : 0;

      // Get unique customers this month
      const uniqueCustomers = new Set(thisMonthBookings?.map(b => b.customer_id)).size;

      // Count bookings by status
      const statusCounts: Record<string, number> = {};
      thisMonthBookings?.forEach(booking => {
        statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1;
      });

      const bookingsByStatus = Object.entries(statusCounts)
        .map(([name, value]) => ({ name, value }));

      // Get daily bookings for the week
      const dailyBookings = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(thisWeekStart);
        date.setDate(date.getDate() + i);
        const count = thisWeekBookings?.filter(b => 
          format(new Date(b.booking_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ).length || 0;
        return {
          day: format(date, 'EEE'),
          bookings: count
        };
      });

      return {
        thisMonthRevenue,
        revenueGrowth,
        thisMonthCount,
        bookingGrowth,
        uniqueCustomers,
        popularServices,
        bookingsByStatus,
        dailyBookings,
        thisWeekCount: thisWeekBookings?.length || 0
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">This Month Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats?.thisMonthRevenue.toFixed(2)}</div>
            <p className={`text-xs ${stats?.revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats?.revenueGrowth >= 0 ? '+' : ''}{stats?.revenueGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">This Month Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.thisMonthCount}</div>
            <p className={`text-xs ${stats?.bookingGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats?.bookingGrowth >= 0 ? '+' : ''}{stats?.bookingGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">This Week</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.thisWeekCount}</div>
            <p className="text-xs text-white/70">bookings this week</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Unique Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.uniqueCustomers}</div>
            <p className="text-xs text-white/70">this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Weekly Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.dailyBookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="bookings" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Bookings by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats?.bookingsByStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Popular Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.popularServices.map((service: any, index: number) => (
              <div key={service.name} className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{service.name}</span>
                    <span className="text-sm text-white/70">{service.value} bookings</span>
                  </div>
                  <div className="w-full bg-slate-800/40 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(service.value / Math.max(...stats.popularServices.map((s: any) => s.value))) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {stats?.popularServices.length === 0 && (
              <div className="text-center text-white/70 py-4">
                No service data available yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
