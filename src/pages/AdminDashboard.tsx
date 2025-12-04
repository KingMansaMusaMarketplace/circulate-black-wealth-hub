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
  Activity,
  PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminBusinesses from '@/components/admin/AdminBusinesses';
import AdminSalesAgents from '@/components/admin/AdminSalesAgents';
import AdminFinancials from '@/components/admin/AdminFinancials';
import AdminSecurity from '@/components/admin/AdminSecurity';
import AdminFraudAlerts from '@/components/admin/AdminFraudAlerts';
import AdminActivityLog from '@/components/admin/AdminActivityLog';
import CommandPalette from '@/components/admin/CommandPalette';
import NotificationCenter from '@/components/admin/NotificationCenter';
import ExportReportsDialog from '@/components/admin/ExportReportsDialog';
import SystemHealthMonitor from '@/components/admin/SystemHealthMonitor';
import QuickActionsFAB from '@/components/admin/QuickActionsFAB';
import KeyboardShortcutsHelp from '@/components/admin/KeyboardShortcutsHelp';
import AdminBreadcrumb from '@/components/admin/AdminBreadcrumb';
import ThemeToggle from '@/components/admin/ThemeToggle';
import UserProfileDropdown from '@/components/admin/UserProfileDropdown';
import LiveDataCounters from '@/components/admin/LiveDataCounters';
import GlobalSearch from '@/components/admin/GlobalSearch';
import OnboardingTour from '@/components/admin/OnboardingTour';
import HelpPanel from '@/components/admin/HelpPanel';
import DashboardAIAssistant from '@/components/admin/DashboardAIAssistant';
import { HelpTooltip } from '@/components/admin/HelpTooltip';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Wait for auth to initialize before checking admin access
    if (authLoading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    checkAdminAccess();
  }, [user, authLoading]);

  // Check if user has seen the tour
  useEffect(() => {
    if (isAdmin) {
      const hasSeenTour = localStorage.getItem('admin-tour-completed');
      if (!hasSeenTour) {
        // Delay tour start to let dashboard render
        setTimeout(() => setShowTour(true), 1000);
      }
    }
  }, [isAdmin]);

  // Keyboard shortcuts for navigation
  useEffect(() => {
    let lastKey = '';
    let keyTimeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if in input/textarea
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      clearTimeout(keyTimeout);
      
      if (lastKey === 'g') {
        switch (e.key.toLowerCase()) {
          case 'o': setActiveTab('overview'); break;
          case 'u': setActiveTab('users'); break;
          case 'b': setActiveTab('businesses'); break;
          case 'a': setActiveTab('agents'); break;
          case 'f': setActiveTab('financials'); break;
          case 's': setActiveTab('security'); break;
        }
        lastKey = '';
      } else if (e.key === 'g') {
        lastKey = 'g';
        keyTimeout = setTimeout(() => { lastKey = ''; }, 1000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem('admin-tour-completed', 'true');
    toast.success('Tour completed! You can restart it anytime from the header.');
  };

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden transition-colors duration-300">
      <Helmet>
        <title>Admin Dashboard | Mansa Musa Marketplace</title>
        <meta name="description" content="Complete admin dashboard for Mansa Musa Marketplace" />
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Top Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center justify-between lg:justify-start gap-4" data-tour="breadcrumb">
            <AdminBreadcrumb currentTab={activeTab} tabs={tabs} />
            <div className="lg:hidden">
              <UserProfileDropdown />
            </div>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {/* Live Counters - Hidden on mobile */}
            <div className="hidden xl:flex" data-tour="live-counters">
              <HelpTooltip content="Real-time metrics that update automatically as data changes">
                <div>
                  <LiveDataCounters />
                </div>
              </HelpTooltip>
            </div>
            
            <div className="h-6 w-px bg-white/10 mx-2 hidden xl:block" />
            
            {/* System Health - Hidden on mobile */}
            <div className="hidden lg:flex" data-tour="health-monitor">
              <HelpTooltip content="Monitor system health: Database, API, and Auth status with latency">
                <div>
                  <SystemHealthMonitor />
                </div>
              </HelpTooltip>
            </div>
            
            <div className="h-6 w-px bg-white/10 mx-2 hidden lg:block" />
            
            {/* Search & Actions */}
            <div className="flex items-center gap-1">
              <div data-tour="global-search">
                <HelpTooltip content="Search users, businesses, and transactions (press /)">
                  <div>
                    <GlobalSearch onTabChange={setActiveTab} />
                  </div>
                </HelpTooltip>
              </div>
              
              <div data-tour="command-palette">
                <HelpTooltip content="Quick commands and navigation (press ⌘K)">
                  <div>
                    <CommandPalette onTabChange={setActiveTab} onExportOpen={() => setExportDialogOpen(true)} />
                  </div>
                </HelpTooltip>
              </div>
              
              <div data-tour="notifications">
                <HelpTooltip content="Real-time notifications for new users, businesses, and alerts">
                  <div>
                    <NotificationCenter />
                  </div>
                </HelpTooltip>
              </div>
              
              <div data-tour="theme-toggle">
                <HelpTooltip content="Switch between dark and light mode">
                  <div>
                    <ThemeToggle />
                  </div>
                </HelpTooltip>
              </div>
              
              <div data-tour="keyboard-shortcuts">
                <HelpTooltip content="View all keyboard shortcuts (press ?)">
                  <div>
                    <KeyboardShortcutsHelp />
                  </div>
                </HelpTooltip>
              </div>
              
              <HelpTooltip content="Comprehensive guide to all dashboard features">
                <div>
                  <HelpPanel />
                </div>
              </HelpTooltip>
              
              <HelpTooltip content="AI assistant to help you navigate the dashboard">
                <div>
                  <DashboardAIAssistant />
                </div>
              </HelpTooltip>
              
              <div className="hidden lg:block">
                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1 flex items-center gap-3">
                <Shield className="h-7 w-7 lg:h-8 lg:w-8 text-yellow-400" />
                Admin Dashboard
              </h1>
              <p className="text-blue-200 text-sm lg:text-base">Complete system overview and management</p>
            </div>
            
            {/* Tour restart button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTour(true)}
              className="hidden sm:flex items-center gap-2 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            >
              <PlayCircle className="h-4 w-4" />
              Start Tour
            </Button>
          </div>
          
          {/* Mobile Live Counters */}
          <div className="xl:hidden mt-4 overflow-x-auto">
            <LiveDataCounters />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div 
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-2 overflow-x-auto animate-fade-in" 
            style={{ animationDelay: '100ms' }}
            data-tour="tabs"
          >
            <TabsList className="bg-transparent flex flex-wrap gap-1 min-w-max">
              {tabs.map((tab, index) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-blue-200 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 hover:bg-white/5 transition-all"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
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
          </div>
        </Tabs>
      </div>

      {/* Quick Actions FAB */}
      <div data-tour="fab">
        <QuickActionsFAB onExportOpen={() => setExportDialogOpen(true)} />
      </div>

      {/* Export Dialog */}
      <ExportReportsDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />

      {/* Onboarding Tour */}
      {showTour && <OnboardingTour onComplete={handleTourComplete} />}
    </div>
  );
};

export default AdminDashboard;
