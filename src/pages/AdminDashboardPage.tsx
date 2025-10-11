
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import RequireAdmin from '@/components/auth/RequireAdmin';

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
                  Monitor user signups, platform metrics, and business analytics.
                </p>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Logged in as: {user?.email} ({userType || 'unknown'})
              </div>
            </div>
          </div>

          <AdminAnalyticsDashboard />
        </div>
      </ResponsiveLayout>
    </RequireAdmin>
  );
};

export default AdminDashboardPage;
