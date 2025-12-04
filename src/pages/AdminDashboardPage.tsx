
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, QrCode, ShieldCheck, Settings, Building2, DollarSign, Mail, UserCog, Ban, CheckSquare, Activity, Megaphone, Sliders, Bot } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { user, userType } = useAuth();

  return (
    <RequireAdmin>
      <ResponsiveLayout title="Admin Dashboard">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-mansablue mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">
                  Manage verifications, monitor agent performance, and track QR analytics.
                </p>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Logged in as: {user?.email} ({userType || 'unknown'})
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="flex flex-wrap gap-2 h-auto p-2">
              <TabsTrigger value="overview" className="flex items-center gap-1 text-xs">
                <BarChart3 className="h-3 w-3" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-1 text-xs">
                <UserCog className="h-3 w-3" />
                Users
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center gap-1 text-xs">
                <CheckSquare className="h-3 w-3" />
                Bulk Actions
              </TabsTrigger>
              <TabsTrigger value="suspensions" className="flex items-center gap-1 text-xs">
                <Ban className="h-3 w-3" />
                Suspensions
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-1 text-xs">
                <Activity className="h-3 w-3" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="verifications" className="flex items-center gap-1 text-xs">
                <ShieldCheck className="h-3 w-3" />
                Verifications
              </TabsTrigger>
              <TabsTrigger value="sponsors" className="flex items-center gap-1 text-xs">
                <Building2 className="h-3 w-3" />
                Sponsors
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center gap-1 text-xs">
                <Users className="h-3 w-3" />
                Agents
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-1 text-xs">
                <DollarSign className="h-3 w-3" />
                Financial
              </TabsTrigger>
              <TabsTrigger value="qr-metrics" className="flex items-center gap-1 text-xs">
                <QrCode className="h-3 w-3" />
                QR Metrics
              </TabsTrigger>
              <TabsTrigger value="announcements" className="flex items-center gap-1 text-xs">
                <Megaphone className="h-3 w-3" />
                Announcements
              </TabsTrigger>
              <TabsTrigger value="emails" className="flex items-center gap-1 text-xs">
                <Mail className="h-3 w-3" />
                Emails
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-1 text-xs">
                <Sliders className="h-3 w-3" />
                System
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-1 text-xs">
                <Bot className="h-3 w-3" />
                AI Tools
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1 text-xs">
                <Settings className="h-3 w-3" />
                Settings
              </TabsTrigger>
            </TabsList>

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
          </Tabs>
        </div>
      </ResponsiveLayout>
    </RequireAdmin>
  );
};

export default AdminDashboardPage;
