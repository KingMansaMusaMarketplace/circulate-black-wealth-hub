import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import VerificationQueue from '@/components/admin/verification/VerificationQueue';
import SalesAgentAnalytics from '@/components/admin/SalesAgentAnalytics';
import UserManagement from '@/components/admin/UserManagement';
import FinancialManagement from '@/components/admin/FinancialManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import AdminAIDashboard from '@/components/admin/ai/AdminAIDashboard';
import RequireAdmin from '@/components/auth/RequireAdmin';
import HelpPanel from '@/components/admin/HelpPanel';
import DashboardAIAssistant from '@/components/admin/DashboardAIAssistant';
import OnboardingTour from '@/components/admin/OnboardingTour';
import LoyaltyManagement from '@/components/admin/LoyaltyManagement';
import AdminAuditLog from '@/components/admin/AdminAuditLog';
import SupportTicketManager from '@/components/admin/SupportTicketManager';
import ContentModerationQueue from '@/components/admin/ContentModerationQueue';
import PromoCodeManager from '@/components/admin/PromoCodeManager';
import FeatureFlagsManager from '@/components/admin/FeatureFlagsManager';
import MaintenanceModeControl from '@/components/admin/MaintenanceModeControl';
import RetentionAnalytics from '@/components/admin/RetentionAnalytics';
import GeographicAnalytics from '@/components/admin/GeographicAnalytics';
import DataExportManager from '@/components/admin/DataExportManager';
import ScheduledReportsManager from '@/components/admin/ScheduledReportsManager';
import AdminRolesManager from '@/components/admin/AdminRolesManager';
import DatabasePerformanceMonitor from '@/components/admin/DatabasePerformanceMonitor';
import UserImpersonation from '@/components/admin/UserImpersonation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHub from '@/components/admin/AdminHub';
import USPTOPatentExport from '@/components/sponsorship/USPTOPatentExport';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PlayCircle, Home } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showTour, setShowTour] = useState(false);
  const [activeTab, setActiveTab] = useState('hub');

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('admin-dashboard-page-tour-completed');
    if (!hasSeenTour) {
      setTimeout(() => setShowTour(true), 1000);
    }
  }, []);

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem('admin-dashboard-page-tour-completed', 'true');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'hub':
        return <AdminHub onNavigate={setActiveTab} />;
      case 'overview':
        return <AdminAnalyticsDashboard />;
      case 'users':
        return <UserManagement />;
      case 'audit':
        return <AdminAuditLog />;
      case 'support':
        return <SupportTicketManager />;
      case 'moderation':
        return <ContentModerationQueue />;
      case 'promos':
        return <PromoCodeManager />;
      case 'flags':
        return <FeatureFlagsManager />;
      case 'retention':
        return <RetentionAnalytics />;
      case 'geographic':
        return <GeographicAnalytics />;
      case 'verifications':
        return <VerificationQueue />;
      case 'agents':
        return <SalesAgentAnalytics />;
      case 'loyalty':
        return <LoyaltyManagement />;
      case 'financial':
        return <FinancialManagement />;
      case 'exports':
        return <DataExportManager />;
      case 'reports':
        return <ScheduledReportsManager />;
      case 'roles':
        return <AdminRolesManager />;
      case 'database':
        return <DatabasePerformanceMonitor />;
      case 'impersonate':
        return <UserImpersonation />;
      case 'system':
        return (
          <div className="space-y-6">
            <MaintenanceModeControl />
            <SystemSettings />
          </div>
        );
      case 'ai':
        return <AdminAIDashboard />;
      case 'patents':
        return <USPTOPatentExport />;
      default:
        return <AdminAnalyticsDashboard />;
    }
  };

  return (
    <RequireAdmin>
      <SidebarProvider defaultOpen={true}>
        <div className="dark min-h-screen flex w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-mansagold/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }} />
            <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] bg-mansagold/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }} />
            <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '3s', animationDuration: '6s' }} />
            <div className="absolute bottom-1/3 -right-20 w-[250px] h-[250px] bg-amber-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }} />
          </div>

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

          {/* Sidebar */}
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Main Content */}
          <SidebarInset className="bg-transparent">
            <div className="relative z-10 flex-1 p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 style={{ color: '#ffffff' }} className="text-2xl md:text-3xl font-bold mb-1">
                      Admin <span className="text-mansagold">Dashboard</span>
                    </h1>
                    <p style={{ color: 'rgba(191, 219, 254, 0.7)' }} className="text-sm">
                      Complete control center for managing your platform.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {activeTab !== 'hub' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab('hub')}
                        className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white bg-white/5 backdrop-blur-sm"
                      >
                        <Home className="h-4 w-4" />
                        Hub
                      </Button>
                    )}
                    <HelpPanel />
                    <DashboardAIAssistant />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTour(true)}
                      className="flex items-center gap-2 border-mansagold/40 text-mansagold hover:bg-mansagold/10 hover:border-mansagold bg-white/5 backdrop-blur-sm"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Tour
                    </Button>
                    <div style={{ color: 'rgba(191, 219, 254, 0.9)' }} className="text-sm backdrop-blur-xl bg-white/5 border border-white/10 px-4 py-2 rounded-full shadow-lg">
                      <span className="text-mansagold">●</span> {user?.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Card - Glass morphism */}
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10 shadow-2xl shadow-black/20 admin-dark-theme">
                {renderContent()}
              </div>
            </div>
          </SidebarInset>

          {showTour && <OnboardingTour onComplete={handleTourComplete} />}
        </div>
      </SidebarProvider>

      {/* Admin dark theme styles */}
      <style>{`
        .admin-dark-theme {
          color: white;
        }
        .admin-dark-theme h1,
        .admin-dark-theme h2,
        .admin-dark-theme h3,
        .admin-dark-theme h4,
        .admin-dark-theme h5,
        .admin-dark-theme h6 {
          color: white !important;
        }
        .admin-dark-theme p {
          color: rgba(191, 219, 254, 0.85);
        }
        .admin-dark-theme .text-muted-foreground {
          color: rgba(148, 163, 184, 0.9) !important;
        }
        .admin-dark-theme label,
        .admin-dark-theme .label {
          color: rgba(191, 219, 254, 0.9) !important;
        }
        .admin-dark-theme [class*="CardTitle"],
        .admin-dark-theme .card-title {
          color: white !important;
        }
        .admin-dark-theme [class*="CardDescription"] {
          color: rgba(148, 163, 184, 0.9) !important;
        }
        .admin-dark-theme table th {
          color: rgba(191, 219, 254, 0.95) !important;
          background-color: rgba(15, 23, 42, 0.6) !important;
        }
        .admin-dark-theme table td {
          color: rgba(226, 232, 240, 0.9) !important;
        }
        .admin-dark-theme table tr {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .admin-dark-theme input,
        .admin-dark-theme textarea,
        .admin-dark-theme select {
          background-color: rgba(15, 23, 42, 0.5) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: white !important;
        }
        .admin-dark-theme input::placeholder,
        .admin-dark-theme textarea::placeholder {
          color: rgba(148, 163, 184, 0.6) !important;
        }
        .admin-dark-theme [role="combobox"],
        .admin-dark-theme [data-radix-select-trigger],
        .admin-dark-theme button[role="combobox"] {
          background-color: rgba(15, 23, 42, 0.5) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: white !important;
        }
        .admin-dark-theme .bg-card,
        .admin-dark-theme [class*="Card"]:not([class*="CardTitle"]):not([class*="CardDescription"]) {
          background-color: rgba(15, 23, 42, 0.4) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .admin-dark-theme .bg-background {
          background-color: transparent !important;
        }
        .admin-dark-theme .text-foreground {
          color: white !important;
        }
        .admin-dark-theme .border {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .admin-dark-theme .bg-muted {
          background-color: rgba(30, 41, 59, 0.5) !important;
        }
        .admin-dark-theme span:not([class]) {
          color: rgba(226, 232, 240, 0.9);
        }
        .admin-dark-theme .text-primary {
          color: hsl(45, 63%, 53%) !important;
        }
        .admin-dark-theme a {
          color: hsl(45, 63%, 53%);
        }
        .admin-dark-theme a:hover {
          color: hsl(45, 63%, 63%);
        }
        .admin-dark-theme .recharts-text {
          fill: rgba(226, 232, 240, 0.9) !important;
        }
        .admin-dark-theme .recharts-cartesian-grid line {
          stroke: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </RequireAdmin>
  );
};

export default AdminDashboardPage;
