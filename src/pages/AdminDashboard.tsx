import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UserCheck, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  Activity
} from 'lucide-react';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminBusinesses from '@/components/admin/AdminBusinesses';
import AdminSalesAgents from '@/components/admin/AdminSalesAgents';
import AdminFinancials from '@/components/admin/AdminFinancials';
import AdminSecurity from '@/components/admin/AdminSecurity';
import AdminFraudAlerts from '@/components/admin/AdminFraudAlerts';
import AdminActivityLog from '@/components/admin/AdminActivityLog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Wait for auth to initialize before checking admin access
    if (authLoading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    checkAdminAccess();
  }, [user, authLoading]);

  const checkAdminAccess = async () => {

    try {
      const { data, error } = await supabase.rpc('is_admin_secure');
      
      if (error) throw error;
      
      if (!data) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
        return;
      }
      
      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      toast.error('Failed to verify admin access');
      navigate('/');
    } finally {
      setCheckingAdmin(false);
    }
  };

  if (authLoading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'businesses', label: 'Businesses', icon: Building2 },
    { id: 'agents', label: 'Sales Agents', icon: UserCheck },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'fraud', label: 'Fraud Alerts', icon: AlertTriangle },
    { id: 'activity', label: 'Activity Log', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <Helmet>
        <title>Admin Dashboard | Mansa Musa Marketplace</title>
        <meta name="description" content="Complete admin dashboard for Mansa Musa Marketplace" />
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="h-8 w-8 text-yellow-400" />
            Admin Dashboard
          </h1>
          <p className="text-blue-200">Complete system overview and management</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-2 overflow-x-auto">
            <TabsList className="bg-transparent flex flex-wrap gap-1 min-w-max">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-200 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 hover:bg-white/5 transition-all"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-6">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="businesses" className="mt-6">
            <AdminBusinesses />
          </TabsContent>

          <TabsContent value="agents" className="mt-6">
            <AdminSalesAgents />
          </TabsContent>

          <TabsContent value="financials" className="mt-6">
            <AdminFinancials />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <AdminSecurity />
          </TabsContent>

          <TabsContent value="fraud" className="mt-6">
            <AdminFraudAlerts />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <AdminActivityLog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
