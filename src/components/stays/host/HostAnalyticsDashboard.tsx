import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import {
  Eye,
  TrendingUp,
  DollarSign,
  Calendar,
  Star,
  Loader2,
  BarChart3,
} from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  conversionRate: number;
  viewsByDay: { date: string; views: number }[];
  revenueByMonth: { month: string; revenue: number }[];
}

interface HostAnalyticsDashboardProps {
  propertyId?: string; // If undefined, show all properties
}

const HostAnalyticsDashboard: React.FC<HostAnalyticsDashboardProps> = ({ propertyId }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    conversionRate: 0,
    viewsByDay: [],
    revenueByMonth: [],
  });

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, propertyId]);

  const fetchAnalytics = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Get property IDs for this host
      let propertyIds: string[] = [];
      if (propertyId) {
        propertyIds = [propertyId];
      } else {
        const { data: properties } = await supabase
          .from('vacation_properties')
          .select('id')
          .eq('host_id', user.id);
        propertyIds = properties?.map((p) => p.id) || [];
      }

      if (propertyIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch views
      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const { data: views } = await supabase
        .from('stays_property_views')
        .select('created_at')
        .in('property_id', propertyIds)
        .gte('created_at', thirtyDaysAgo);

      // Fetch bookings and revenue
      const { data: bookings } = await supabase
        .from('vacation_bookings')
        .select('total_amount, status, created_at')
        .in('property_id', propertyIds)
        .in('status', ['confirmed', 'completed']);

      // Fetch ratings
      const { data: reviews } = await supabase
        .from('stays_reviews')
        .select('overall_rating')
        .in('property_id', propertyIds)
        .eq('is_public', true)
        .eq('reviewer_type', 'guest');

      // Calculate metrics
      const totalViews = views?.length || 0;
      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
      const averageRating =
        reviews && reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length
          : 0;
      const conversionRate = totalViews > 0 ? (totalBookings / totalViews) * 100 : 0;

      // Views by day
      const viewsByDay = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayViews = views?.filter(
          (v) => format(new Date(v.created_at), 'yyyy-MM-dd') === dateStr
        ).length || 0;
        return { date: format(date, 'EEE'), views: dayViews };
      });

      setAnalytics({
        totalViews,
        totalBookings,
        totalRevenue,
        averageRating,
        conversionRate,
        viewsByDay,
        revenueByMonth: [],
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-mansagold" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Views',
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      label: 'Bookings',
      value: analytics.totalBookings.toLocaleString(),
      icon: Calendar,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      label: 'Revenue',
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-mansagold',
      bgColor: 'bg-mansagold/20',
    },
    {
      label: 'Avg Rating',
      value: analytics.averageRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-slate-800/50 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-white text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conversion Rate */}
      <Card className="bg-slate-800/50 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-mansagold" />
            Conversion Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-white">
              {analytics.conversionRate.toFixed(1)}%
            </div>
            <div className="flex-1">
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-mansagold rounded-full transition-all"
                  style={{ width: `${Math.min(analytics.conversionRate, 100)}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-2">
            {analytics.totalBookings} bookings from {analytics.totalViews} views
          </p>
        </CardContent>
      </Card>

      {/* Views Chart */}
      <Card className="bg-slate-800/50 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-mansagold" />
            Views (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-32">
            {analytics.viewsByDay.map((day, i) => {
              const maxViews = Math.max(...analytics.viewsByDay.map((d) => d.views), 1);
              const height = (day.views / maxViews) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-white text-xs">{day.views}</span>
                  <div
                    className="w-full bg-mansagold/80 rounded-t transition-all hover:bg-mansagold"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className="text-white/40 text-xs">{day.date}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostAnalyticsDashboard;
