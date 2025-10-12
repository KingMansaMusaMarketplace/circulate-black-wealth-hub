import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Users, TrendingUp, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useQuery as useSupabaseQuery } from '@tanstack/react-query';

const tierPrices = {
  platinum: 5000,
  gold: 2500,
  silver: 1000,
  bronze: 500,
};

export default function AdminSponsorsPage() {
  const { user, userRole } = useAuth();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['admin-sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('*')
        .order('created_at', { ascending: false});

      if (error) throw error;
      return data;
    },
    enabled: userRole === 'admin',
  });

  const { data: allMetrics } = useQuery({
    queryKey: ['admin-sponsor-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsor_impact_metrics')
        .select('*');

      if (error) throw error;
      return data;
    },
    enabled: userRole === 'admin',
  });

  if (!user || userRole !== 'admin') {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Sponsor Management</h1>
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const activeSponsors = subscriptions?.filter((s) => s.status === 'active') || [];
  const totalRevenue = activeSponsors.reduce(
    (sum, s) => sum + (tierPrices[s.tier as keyof typeof tierPrices] || 0),
    0
  );
  const totalImpressions = allMetrics?.reduce((sum, m) => sum + (m.impressions || 0), 0) || 0;
  const totalClicks = allMetrics?.reduce((sum, m) => sum + (m.clicks || 0), 0) || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      case 'past_due':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-purple-500/10 text-purple-500';
      case 'gold':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'silver':
        return 'bg-gray-500/10 text-gray-500';
      case 'bronze':
        return 'bg-orange-500/10 text-orange-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sponsor Management</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sponsors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSponsors.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sponsors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Sponsors</CardTitle>
          <CardDescription>Manage and monitor all sponsorships</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Monthly Value</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Next Billing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions?.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {sub.logo_url && (
                        <img src={sub.logo_url} alt={sub.company_name} className="h-8 w-8 object-contain" />
                      )}
                      {sub.company_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTierColor(sub.tier)}>{sub.tier.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(sub.status)}>{sub.status}</Badge>
                  </TableCell>
                  <TableCell>${(tierPrices[sub.tier as keyof typeof tierPrices] || 0).toLocaleString()}</TableCell>
                  <TableCell>{format(new Date(sub.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {sub.current_period_end ? format(new Date(sub.current_period_end), 'MMM d, yyyy') : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
