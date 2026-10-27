import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
const AdminAnalyticsDashboard = React.lazy(() => import('@/components/admin/AdminAnalyticsDashboard'));
const VerificationQueue = React.lazy(() => import('@/components/admin/verification/VerificationQueue'));
const SalesAgentAnalytics = React.lazy(() => import('@/components/admin/SalesAgentAnalytics'));
const UserManagement = React.lazy(() => import('@/components/admin/UserManagement'));
const FinancialManagement = React.lazy(() => import('@/components/admin/FinancialManagement'));
const SubscriptionsAdmin = React.lazy(() => import('@/components/admin/SubscriptionsAdmin'));
const ListingApprovalsQueue = React.lazy(() => import('@/components/admin/ListingApprovalsQueue'));
const SystemSettings = React.lazy(() => import('@/components/admin/SystemSettings'));
const AdminAIDashboard = React.lazy(() => import('@/components/admin/ai/AdminAIDashboard'));
import RequireAdmin from '@/components/auth/RequireAdmin';
import HelpPanel from '@/components/admin/HelpPanel';
import DashboardAIAssistant from '@/components/admin/DashboardAIAssistant';
const OnboardingTour = React.lazy(() => import('@/components/admin/OnboardingTour'));
const LoyaltyManagement = React.lazy(() => import('@/components/admin/LoyaltyManagement'));
const AdminAuditLog = React.lazy(() => import('@/components/admin/AdminAuditLog'));
const SupportTicketManager = React.lazy(() => import('@/components/admin/SupportTicketManager'));
const ContentModerationQueue = React.lazy(() => import('@/components/admin/ContentModerationQueue'));
const PromoCodeManager = React.lazy(() => import('@/components/admin/PromoCodeManager'));
const FeatureFlagsManager = React.lazy(() => import('@/components/admin/FeatureFlagsManager'));
const MaintenanceModeControl = React.lazy(() => import('@/components/admin/MaintenanceModeControl'));
const RetentionAnalytics = React.lazy(() => import('@/components/admin/RetentionAnalytics'));
const GeographicAnalytics = React.lazy(() => import('@/components/admin/GeographicAnalytics'));
const DataExportManager = React.lazy(() => import('@/components/admin/DataExportManager'));
const ScheduledReportsManager = React.lazy(() => import('@/components/admin/ScheduledReportsManager'));
const AdminRolesManager = React.lazy(() => import('@/components/admin/AdminRolesManager'));
const DatabasePerformanceMonitor = React.lazy(() => import('@/components/admin/DatabasePerformanceMonitor'));
const UserImpersonation = React.lazy(() => import('@/components/admin/UserImpersonation'));
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHub from '@/components/admin/AdminHub';
const LegalIPDocuments = React.lazy(() => import('@/components/admin/LegalIPDocuments'));
const PartnerApplicationsManager = React.lazy(() => import('@/components/admin/PartnerApplicationsManager'));
const GrowthDashboard = React.lazy(() => import('@/components/admin/GrowthDashboard'));
const PartnerSuccessStories = React.lazy(() => import('@/components/partner/PartnerSuccessStories'));
const AdminEcosystemDashboard = React.lazy(() => import('@/components/admin/AdminEcosystemDashboard'));
const AdminDevelopers = React.lazy(() => import('@/components/admin/AdminDevelopers'));
const ArchiveRecovery = React.lazy(() => import('@/components/admin/ArchiveRecovery'));
const ValuationMetrics = React.lazy(() => import('@/components/admin/ValuationMetrics'));
const DatabaseSetup = React.lazy(() => import('@/components/admin/DatabaseSetup'));
const BetaTesterManager = React.lazy(() => import('@/components/admin/BetaTesterManager'));
const StaysBetaManager = React.lazy(() => import('@/components/admin/StaysBetaManager'));
import { Tabs as BetaTabs, TabsList as BetaTabsList, TabsTrigger as BetaTabsTrigger, TabsContent as BetaTabsContent } from '@/components/ui/tabs';
const SupabaseSetup = React.lazy(() => import('@/components/admin/SupabaseSetup'));
const MansaStaysAdmin = React.lazy(() => import('@/components/admin/MansaStaysAdmin'));
const NoireRideshareAdmin = React.lazy(() => import('@/components/admin/NoireRideshareAdmin'));
const QRScanFraudMonitor = React.lazy(() => import('@/components/admin/QRScanFraudMonitor'));
const KaylaAgentCostMeter = React.lazy(() => import('@/components/admin/KaylaAgentCostMeter'));
const BroadcastAnnouncements = React.lazy(() => import('@/components/admin/BroadcastAnnouncements'));
const BackupRestorePanel = React.lazy(() => import('@/components/admin/BackupRestorePanel'));
import { AdminIdleLock } from '@/components/admin/AdminIdleLock';
import { AdminShadowModeProvider } from '@/contexts/AdminShadowModeContext';
import { AdminShadowModeToggle } from '@/components/admin/AdminShadowModeToggle';
const WebhookManager = React.lazy(() => import('@/components/admin/WebhookManager'));
const APITokenManager = React.lazy(() => import('@/components/admin/APITokenManager'));
const SystemHealthDashboard = React.lazy(() => import('@/components/admin/SystemHealthDashboard'));
const PartnerOnboardingFunnel = React.lazy(() => import('@/components/admin/PartnerOnboardingFunnel'));
const ClinicalAccessMonitor = React.lazy(() => import('@/components/admin/ClinicalAccessMonitor'));
const OsAccessRequests = React.lazy(() => import('@/components/admin/OsAccessRequests'));
const FoundingClinicsList = React.lazy(() => import('@/components/admin/FoundingClinicsList'));
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PlayCircle, Home, Activity, ExternalLink } from 'lucide-react';

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
      case 'os-access':
        return <OsAccessRequests />;
      case 'clinical-access':
        return <><ClinicalAccessMonitor /><FoundingClinicsList /></>;
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
      case 'broadcasts':
        return <BroadcastAnnouncements />;
      case 'backups':
        return <BackupRestorePanel />;
      case 'webhooks':
        return <WebhookManager />;
      case 'api-tokens':
        return <APITokenManager />;
      case 'system-health':
        return <SystemHealthDashboard />;
      case 'retention':
        return <RetentionAnalytics />;
      case 'geographic':
        return <GeographicAnalytics />;
      case 'verifications':
        return <VerificationQueue />;
      case 'listing-queue':
        return <ListingApprovalsQueue />;
      case 'agents':
        return <SalesAgentAnalytics />;
      case 'partners':
        return <PartnerApplicationsManager />;
      case 'partner-onboarding':
        return <PartnerOnboardingFunnel />;
      case 'loyalty':
        return <LoyaltyManagement />;
      case 'qr-fraud':
        return <QRScanFraudMonitor />;
      case 'financial':
        return <FinancialManagement />;
      case 'subscriptions':
        return <SubscriptionsAdmin />;
      case 'mansa-stays':
        return <MansaStaysAdmin />;
      case 'noire-rideshare':
        return <NoireRideshareAdmin />;
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
      case 'kayla-cost':
        return <KaylaAgentCostMeter />;
      case 'patents':
        return <LegalIPDocuments />;
      case 'growth':
        return <GrowthDashboard />;
      case 'partner-success':
        return <PartnerSuccessStories />;
      case 'ecosystem':
        return <AdminEcosystemDashboard />;
      case 'developers':
        return <AdminDevelopers />;
      case 'valuation':
        return <ValuationMetrics />;
      case 'archive':
        return <ArchiveRecovery />;
      case 'beta-testers':
        return (
          <BetaTabs defaultValue="general" className="w-full">
            <BetaTabsList className="bg-gray-900 border border-gray-700 mb-4">
              <BetaTabsTrigger value="general">General Beta</BetaTabsTrigger>
              <BetaTabsTrigger value="stays">Mansa Stays Beta</BetaTabsTrigger>
            </BetaTabsList>
            <BetaTabsContent value="general"><BetaTesterManager /></BetaTabsContent>
            <BetaTabsContent value="stays"><StaysBetaManager /></BetaTabsContent>
          </BetaTabs>
        );
      case 'setup':
        return (
          <div className="space-y-6">
            <SupabaseSetup />
            <DatabaseSetup />
          </div>
        );
      default:
        return <AdminAnalyticsDashboard />;
    }
  };

  return (
    <RequireAdmin>
      <AdminShadowModeProvider>
      <AdminIdleLock />
      <SidebarProvider defaultOpen={true}>
        <div className="dark min-h-screen flex w-full bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] relative overflow-hidden">
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
                    <Button
                      asChild
                      variant="outline"
                      className="mt-3 h-auto min-h-11 max-w-full justify-start whitespace-normal border-primary text-primary hover:bg-accent hover:text-accent-foreground"
                    >
                      <a href="https://health.1325.ai/" target="_blank" rel="noopener noreferrer">
                        <Activity className="h-4 w-4 shrink-0" />
                        <span className="text-left">1325 Clinical EMR / EHR — health.1325.ai</span>
                        <ExternalLink className="h-4 w-4 shrink-0" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-3 ml-0 md:ml-3 h-auto min-h-11 max-w-full justify-start whitespace-normal border-primary text-primary hover:bg-accent hover:text-accent-foreground"
                    >
                      <a href="/os-dashboard" target="_blank" rel="noopener noreferrer">
                        <Activity className="h-4 w-4 shrink-0" />
                        <span className="text-left">1325 OS Dashboard</span>
                        <ExternalLink className="h-4 w-4 shrink-0" />
                      </a>
                    </Button>
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
                    <DashboardAIAssistant activeTab={activeTab} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTour(true)}
                      className="flex items-center gap-2 border-mansagold/40 text-mansagold hover:bg-mansagold/10 hover:border-mansagold bg-white/5 backdrop-blur-sm"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Tour
                    </Button>
                    <AdminShadowModeToggle />
                    <div style={{ color: 'rgba(191, 219, 254, 0.9)' }} className="text-sm backdrop-blur-xl bg-white/5 border border-white/10 px-4 py-2 rounded-full shadow-lg">
                      <span className="text-mansagold">●</span> {user?.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Card - Glass morphism */}
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10 shadow-2xl shadow-black/20 admin-dark-theme">
                <Suspense fallback={<div className="py-16 text-center text-sm" role="status">Loading…</div>}>
                  {renderContent()}
                </Suspense>
              </div>
            </div>
          </SidebarInset>

          {showTour && <Suspense fallback={null}><OnboardingTour onComplete={handleTourComplete} /></Suspense>}
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
      </AdminShadowModeProvider>
    </RequireAdmin>
  );
};

export default AdminDashboardPage;
