
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
      <div className="min-h-screen bg-mansablue-dark relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-mansablue-light/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-mansagold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Admin <span className="text-mansagold">Dashboard</span>
                </h1>
                <p className="text-white/70">
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
                  className="flex items-center gap-2 border-mansagold/30 text-mansagold hover:bg-mansagold/10"
                >
                  <PlayCircle className="h-4 w-4" />
                  Tour
                </Button>
                <div className="text-sm text-white/80 glass-card px-4 py-2 rounded-full border border-mansagold/30">
                  <span className="text-mansagold">●</span> {user?.email}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 md:p-6 border border-white/10">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="flex flex-wrap gap-1 h-auto p-2 bg-white/5 border border-white/10 rounded-xl">
                <TabsTrigger value="overview" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <BarChart3 className="h-3 w-3" />Overview
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <UserCog className="h-3 w-3" />Users
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <History className="h-3 w-3" />Audit
                </TabsTrigger>
                <TabsTrigger value="support" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Ticket className="h-3 w-3" />Support
                </TabsTrigger>
                <TabsTrigger value="moderation" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Shield className="h-3 w-3" />Moderation
                </TabsTrigger>
                <TabsTrigger value="promos" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Tag className="h-3 w-3" />Promos
                </TabsTrigger>
                <TabsTrigger value="flags" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Flag className="h-3 w-3" />Flags
                </TabsTrigger>
                <TabsTrigger value="retention" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <TrendingUp className="h-3 w-3" />Retention
                </TabsTrigger>
                <TabsTrigger value="geographic" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <MapPin className="h-3 w-3" />Geographic
                </TabsTrigger>
                <TabsTrigger value="verifications" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <ShieldCheck className="h-3 w-3" />Verify
                </TabsTrigger>
                <TabsTrigger value="agents" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Users className="h-3 w-3" />Agents
                </TabsTrigger>
                <TabsTrigger value="financial" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <DollarSign className="h-3 w-3" />Financial
                </TabsTrigger>
                <TabsTrigger value="exports" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Download className="h-3 w-3" />Export
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Calendar className="h-3 w-3" />Reports
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Lock className="h-3 w-3" />Roles
                </TabsTrigger>
                <TabsTrigger value="database" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Database className="h-3 w-3" />DB
                </TabsTrigger>
                <TabsTrigger value="impersonate" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Eye className="h-3 w-3" />View As
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Sliders className="h-3 w-3" />System
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Bot className="h-3 w-3" />AI
                </TabsTrigger>
              </TabsList>

              <div className="text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_p]:text-white/80 [&_.text-muted-foreground]:text-white/60">
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
    </RequireAdmin>
  );
};

export default AdminDashboardPage;
