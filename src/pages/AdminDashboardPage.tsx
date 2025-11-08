
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import VerificationQueue from '@/components/admin/verification/VerificationQueue';
import SalesAgentAnalytics from '@/components/admin/SalesAgentAnalytics';
import QRCodeMetrics from '@/components/admin/QRCodeMetrics';
import RequireAdmin from '@/components/auth/RequireAdmin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, QrCode, ShieldCheck } from 'lucide-react';

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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="verifications" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Verifications
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Sales Agents
              </TabsTrigger>
              <TabsTrigger value="qr-metrics" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Metrics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <AdminAnalyticsDashboard />
            </TabsContent>

            <TabsContent value="verifications" className="space-y-6">
              <VerificationQueue />
            </TabsContent>

            <TabsContent value="agents" className="space-y-6">
              <SalesAgentAnalytics />
            </TabsContent>

            <TabsContent value="qr-metrics" className="space-y-6">
              <QRCodeMetrics />
            </TabsContent>
          </Tabs>
        </div>
      </ResponsiveLayout>
    </RequireAdmin>
  );
};

export default AdminDashboardPage;
