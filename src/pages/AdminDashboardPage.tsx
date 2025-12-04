
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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, QrCode, ShieldCheck, Settings, Building2, DollarSign, Mail, UserCog, Ban, CheckSquare, Activity, Megaphone, Sliders, Bot, PlayCircle } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { user, userType } = useAuth();
  const [showTour, setShowTour] = useState(false);

  // Check if user has seen the tour
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
        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-mansablue-light/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-mansagold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-mansablue-light/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Admin <span className="text-mansagold">Dashboard</span>
                </h1>
                <p className="text-white/70">
                  Manage verifications, monitor agent performance, and track QR analytics.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Help Features */}
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
                  <span className="text-mansagold">●</span> Logged in as: {user?.email} ({userType || 'unknown'})
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="glass-card rounded-2xl p-4 md:p-6 border border-white/10">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="flex flex-wrap gap-2 h-auto p-2 bg-white/5 border border-white/10 rounded-xl">
                <TabsTrigger value="overview" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <BarChart3 className="h-3 w-3" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <UserCog className="h-3 w-3" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="bulk" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <CheckSquare className="h-3 w-3" />
                  Bulk Actions
                </TabsTrigger>
                <TabsTrigger value="suspensions" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Ban className="h-3 w-3" />
                  Suspensions
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Activity className="h-3 w-3" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="verifications" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <ShieldCheck className="h-3 w-3" />
                  Verifications
                </TabsTrigger>
                <TabsTrigger value="sponsors" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Building2 className="h-3 w-3" />
                  Sponsors
                </TabsTrigger>
                <TabsTrigger value="agents" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Users className="h-3 w-3" />
                  Agents
                </TabsTrigger>
                <TabsTrigger value="financial" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <DollarSign className="h-3 w-3" />
                  Financial
                </TabsTrigger>
                <TabsTrigger value="qr-metrics" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <QrCode className="h-3 w-3" />
                  QR Metrics
                </TabsTrigger>
                <TabsTrigger value="announcements" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Megaphone className="h-3 w-3" />
                  Announcements
                </TabsTrigger>
                <TabsTrigger value="emails" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Mail className="h-3 w-3" />
                  Emails
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Sliders className="h-3 w-3" />
                  System
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Bot className="h-3 w-3" />
                  AI Tools
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1 text-xs text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue-dark">
                  <Settings className="h-3 w-3" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <div className="text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_p]:text-white/80 [&_.text-muted-foreground]:text-white/60 [&_.text-gray-500]:text-white/60 [&_.text-gray-600]:text-white/70 [&_.bg-white]:bg-white/10 [&_.bg-card]:bg-white/5 [&_.border]:border-white/10">
                <TabsContent value="overview" className="space-y-6">
                  <AdminAnalyticsDashboard />
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                  <UserManagement />
                </TabsContent>

                <TabsContent value="bulk" className="space-y-6">
                  <BulkActionsPanel />
                </TabsContent>

                <TabsContent value="suspensions" className="space-y-6">
                  <AccountSuspensionManager />
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <ActivityMonitor />
                </TabsContent>

                <TabsContent value="verifications" className="space-y-6">
                  <VerificationQueue />
                </TabsContent>

                <TabsContent value="sponsors" className="space-y-6">
                  <CorporateSponsorshipApprovals />
                </TabsContent>

                <TabsContent value="agents" className="space-y-6">
                  <SalesAgentAnalytics />
                </TabsContent>

                <TabsContent value="financial" className="space-y-6">
                  <FinancialManagement />
                </TabsContent>

                <TabsContent value="qr-metrics" className="space-y-6">
                  <QRCodeMetrics />
                </TabsContent>

                <TabsContent value="announcements" className="space-y-6">
                  <BroadcastAnnouncements />
                </TabsContent>

                <TabsContent value="emails" className="space-y-6">
                  <EmailHistory />
                </TabsContent>

                <TabsContent value="system" className="space-y-6">
                  <SystemSettings />
                </TabsContent>

                <TabsContent value="ai" className="space-y-6">
                  <AdminAIDashboard />
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <NotificationPreferences />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Onboarding Tour */}
        {showTour && <OnboardingTour onComplete={handleTourComplete} />}
      </div>
    </RequireAdmin>
  );
};

export default AdminDashboardPage;
