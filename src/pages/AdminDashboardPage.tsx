
import React from 'react';
import { useAuth } from '@/contexts/auth';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { user, userType } = useAuth();

  // Simple admin check - you might want to implement a more robust system
  const isAdmin = userType === 'business'; // Temporary admin check

  if (!user) {
    return (
      <ResponsiveLayout title="Admin Dashboard">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600">Please log in to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </ResponsiveLayout>
    );
  }

  if (!isAdmin) {
    return (
      <ResponsiveLayout title="Admin Dashboard">
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="Admin Dashboard">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mansablue mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Monitor user signups, platform metrics, and business analytics.
          </p>
        </div>

        <AdminAnalyticsDashboard />
      </div>
    </ResponsiveLayout>
  );
};

export default AdminDashboardPage;
