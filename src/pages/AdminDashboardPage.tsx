
import React from 'react';
import { useAuth } from '@/contexts/auth';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { user, userType } = useAuth();

  if (!user) {
    return (
      <ResponsiveLayout title="Admin Dashboard">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to access the admin dashboard.</p>
            <div className="space-x-4">
              <a 
                href="/login" 
                className="inline-flex items-center px-4 py-2 bg-mansablue text-white rounded-md hover:bg-mansablue-dark transition-colors"
              >
                Login
              </a>
              <a 
                href="/signup" 
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Sign Up
              </a>
            </div>
          </CardContent>
        </Card>
      </ResponsiveLayout>
    );
  }

  // For development purposes, allow any authenticated user to access admin dashboard
  // In production, you would check for specific admin roles here
  console.log('User accessing admin dashboard:', { user: user.email, userType });

  return (
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
              Logged in as: {user.email} ({userType || 'unknown'})
            </div>
          </div>
        </div>

        <AdminAnalyticsDashboard />
      </div>
    </ResponsiveLayout>
  );
};

export default AdminDashboardPage;
