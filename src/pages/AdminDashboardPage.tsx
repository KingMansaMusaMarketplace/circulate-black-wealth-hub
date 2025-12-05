
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import VerificationQueue from '@/components/admin/verification/VerificationQueue';
import SalesAgentAnalytics from '@/components/admin/SalesAgentAnalytics';
import QRCodeMetrics from '@/components/admin/QRCodeMetrics';
import NotificationPreferences from '@/components/admin/NotificationPreferences';
import CorporateSponsorshipApprovals from '@/components/admin/CorporateSponsorshipApprovals';
import UserManagement from '@/components/admin/UserManagement';
import FinancialManagement from '@/components/admin/FinancialManagement';
import EmailHistory from '@/components/admin/EmailHistory';
import AccountSuspensionManager from '@/components/admin/AccountSuspensionManager';
import BulkActionsPanel from '@/components/admin/BulkActionsPanel';
import ActivityMonitor from '@/components/admin/ActivityMonitor';
import SystemSettings from '@/components/admin/SystemSettings';
import BroadcastAnnouncements from '@/components/admin/BroadcastAnnouncements';
import AdminAIDashboard from '@/components/admin/ai/AdminAIDashboard';
import RequireAdmin from '@/components/auth/RequireAdmin';
import HelpPanel from '@/components/admin/HelpPanel';
import DashboardAIAssistant from '@/components/admin/DashboardAIAssistant';
import OnboardingTour from '@/components/admin/OnboardingTour';
// New components
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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, QrCode, ShieldCheck, Settings, Building2, DollarSign, Mail, UserCog, Ban, CheckSquare, Activity, Megaphone, Sliders, Bot, PlayCircle, History, Ticket, Shield, Tag, Flag, Wrench, TrendingUp, MapPin, Download, Calendar, Lock, Database, Eye } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { user, userType } = useAuth();
  const [showTour, setShowTour] = useState(false);

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

  return (
    <RequireAdmin>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Admin <span className="text-mansagold">Dashboard</span>
                </h1>
                <p className="text-blue-200/70">
                  Complete control center for managing your platform.
                </p>
              </div>
              <div className="flex items-center gap-3">
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
                <div className="text-sm text-blue-100 backdrop-blur-xl bg-white/5 border border-white/10 px-4 py-2 rounded-full shadow-lg">
                  <span className="text-mansagold">●</span> {user?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Card - Glass morphism */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10 shadow-2xl shadow-black/20">
            <Tabs defaultValue="overview" className="space-y-6">
              {/* Tab Navigation */}
              <TabsList className="flex flex-wrap gap-1 h-auto p-2 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl">
                <TabsTrigger value="overview" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <BarChart3 className="h-3.5 w-3.5" />Overview
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <UserCog className="h-3.5 w-3.5" />Users
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <History className="h-3.5 w-3.5" />Audit
                </TabsTrigger>
                <TabsTrigger value="support" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <Ticket className="h-3.5 w-3.5" />Support
                </TabsTrigger>
                <TabsTrigger value="moderation" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <Shield className="h-3.5 w-3.5" />Moderation
                </TabsTrigger>
                <TabsTrigger value="promos" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <Tag className="h-3.5 w-3.5" />Promos
                </TabsTrigger>
                <TabsTrigger value="flags" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <Flag className="h-3.5 w-3.5" />Flags
                </TabsTrigger>
                <TabsTrigger value="retention" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <TrendingUp className="h-3.5 w-3.5" />Retention
                </TabsTrigger>
                <TabsTrigger value="geographic" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <MapPin className="h-3.5 w-3.5" />Geographic
                </TabsTrigger>
                <TabsTrigger value="verifications" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <ShieldCheck className="h-3.5 w-3.5" />Verify
                </TabsTrigger>
                <TabsTrigger value="agents" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <Users className="h-3.5 w-3.5" />Agents
                </TabsTrigger>
                <TabsTrigger value="financial" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <DollarSign className="h-3.5 w-3.5" />Financial
                </TabsTrigger>
                <TabsTrigger value="exports" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <Download className="h-3.5 w-3.5" />Export
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <Calendar className="h-3.5 w-3.5" />Reports
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <Lock className="h-3.5 w-3.5" />Roles
                </TabsTrigger>
                <TabsTrigger value="database" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <Database className="h-3.5 w-3.5" />DB
                </TabsTrigger>
                <TabsTrigger value="impersonate" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <Eye className="h-3.5 w-3.5" />View As
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <Sliders className="h-3.5 w-3.5" />System
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-1.5 text-xs text-blue-200 data-[state=active]:bg-mansagold data-[state=active]:text-slate-900 data-[state=active]:font-semibold hover:bg-white/10 transition-all">
                  <Bot className="h-3.5 w-3.5" />AI
                </TabsTrigger>
              </TabsList>

              {/* Tab Content with dark theme styling */}
              <div className="admin-dark-theme">
                <TabsContent value="overview"><AdminAnalyticsDashboard /></TabsContent>
                <TabsContent value="users"><UserManagement /></TabsContent>
                <TabsContent value="audit"><AdminAuditLog /></TabsContent>
                <TabsContent value="support"><SupportTicketManager /></TabsContent>
                <TabsContent value="moderation"><ContentModerationQueue /></TabsContent>
                <TabsContent value="promos"><PromoCodeManager /></TabsContent>
                <TabsContent value="flags"><FeatureFlagsManager /></TabsContent>
                <TabsContent value="retention"><RetentionAnalytics /></TabsContent>
                <TabsContent value="geographic"><GeographicAnalytics /></TabsContent>
                <TabsContent value="verifications"><VerificationQueue /></TabsContent>
                <TabsContent value="agents"><SalesAgentAnalytics /></TabsContent>
                <TabsContent value="financial"><FinancialManagement /></TabsContent>
                <TabsContent value="exports"><DataExportManager /></TabsContent>
                <TabsContent value="reports"><ScheduledReportsManager /></TabsContent>
                <TabsContent value="roles"><AdminRolesManager /></TabsContent>
                <TabsContent value="database"><DatabasePerformanceMonitor /></TabsContent>
                <TabsContent value="impersonate"><UserImpersonation /></TabsContent>
                <TabsContent value="system">
                  <div className="space-y-6">
                    <MaintenanceModeControl />
                    <SystemSettings />
                  </div>
                </TabsContent>
                <TabsContent value="ai"><AdminAIDashboard /></TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {showTour && <OnboardingTour onComplete={handleTourComplete} />}
      </div>

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
      `}</style>
    </RequireAdmin>
  );
};

export default AdminDashboardPage;
