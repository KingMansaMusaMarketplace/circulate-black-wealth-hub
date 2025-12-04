import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  UserCheck,
  ShieldAlert,
  Clock,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OverviewStats {
  totalUsers: number;
  totalBusinesses: number;
  verifiedBusinesses: number;
  pendingVerifications: number;
  totalAgents: number;
  pendingApplications: number;
  totalTransactions: number;
  totalRevenue: number;
  fraudAlerts: number;
  activeToday: number;
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<OverviewStats>({
    totalUsers: 0,
    totalBusinesses: 0,
    verifiedBusinesses: 0,
    pendingVerifications: 0,
    totalAgents: 0,
    pendingApplications: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    fraudAlerts: 0,
    activeToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        usersRes,
        businessesRes,
        verifiedRes,
        pendingVerifRes,
        agentsRes,
        pendingAppsRes,
        transactionsRes,
        fraudRes,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('businesses').select('id', { count: 'exact', head: true }),
        supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('is_verified', true),
        supabase.from('business_verifications').select('id', { count: 'exact', head: true }).eq('verification_status', 'pending'),
        supabase.from('sales_agents').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('sales_agent_applications').select('id', { count: 'exact', head: true }).eq('application_status', 'pending'),
        supabase.from('transactions').select('amount'),
        supabase.from('fraud_alerts').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      const totalRevenue = transactionsRes.data?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;

      setStats({
        totalUsers: usersRes.count || 0,
        totalBusinesses: businessesRes.count || 0,
        verifiedBusinesses: verifiedRes.count || 0,
        pendingVerifications: pendingVerifRes.count || 0,
        totalAgents: agentsRes.count || 0,
        pendingApplications: pendingAppsRes.count || 0,
        totalTransactions: transactionsRes.data?.length || 0,
        totalRevenue,
        fraudAlerts: fraudRes.count || 0,
        activeToday: 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { title: 'Total Businesses', value: stats.totalBusinesses, icon: Building2, color: 'text-green-400', bg: 'bg-green-500/20' },
    { title: 'Verified Businesses', value: stats.verifiedBusinesses, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { title: 'Pending Verifications', value: stats.pendingVerifications, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { title: 'Active Agents', value: stats.totalAgents, icon: UserCheck, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { title: 'Pending Applications', value: stats.pendingApplications, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    { title: 'Total Transactions', value: stats.totalTransactions, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/20' },
    { title: 'Fraud Alerts', value: stats.fraudAlerts, icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/20' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <Card key={i} className="backdrop-blur-xl bg-white/5 border-white/10 animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-white/10 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions Needed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.pendingVerifications > 0 && (
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <span className="text-yellow-400">{stats.pendingVerifications} business verifications pending</span>
              <span className="text-yellow-400 text-sm">Review Now →</span>
            </div>
          )}
          {stats.pendingApplications > 0 && (
            <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <span className="text-orange-400">{stats.pendingApplications} agent applications pending</span>
              <span className="text-orange-400 text-sm">Review Now →</span>
            </div>
          )}
          {stats.fraudAlerts > 0 && (
            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <span className="text-red-400">{stats.fraudAlerts} fraud alerts need attention</span>
              <span className="text-red-400 text-sm">Review Now →</span>
            </div>
          )}
          {stats.pendingVerifications === 0 && stats.pendingApplications === 0 && stats.fraudAlerts === 0 && (
            <div className="flex items-center justify-center p-6 text-green-400">
              <CheckCircle className="h-5 w-5 mr-2" />
              All caught up! No pending actions.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
