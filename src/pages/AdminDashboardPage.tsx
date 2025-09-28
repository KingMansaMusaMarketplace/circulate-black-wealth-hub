
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, AlertTriangle, Lock } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboardPage: React.FC = () => {
  const { user, userType } = useAuth();
  const [accessCode, setAccessCode] = useState('');
  const [hasAccess, setHasAccess] = useState(false);

  const handleAccessCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === '05230901') {
      setHasAccess(true);
      toast.success('Access granted to admin dashboard');
    } else {
      toast.error('Invalid access code');
      setAccessCode('');
    }
  };

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

  if (!hasAccess) {
    return (
      <ResponsiveLayout title="Admin Dashboard">
        <Card className="max-w-md mx-auto mt-16">
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 text-mansablue mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
            <p className="text-gray-600 mb-6">Please enter the admin access code to continue.</p>
            
            <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="text-center"
                autoFocus
              />
              <Button type="submit" className="w-full bg-mansablue hover:bg-mansablue-dark">
                <Shield className="h-4 w-4 mr-2" />
                Verify Access
              </Button>
            </form>
            
            <div className="mt-6 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Logged in as: {user.email} ({userType || 'unknown'})
            </div>
          </CardContent>
        </Card>
      </ResponsiveLayout>
    );
  }

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
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Logged in as: {user.email} ({userType || 'unknown'})
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setHasAccess(false)}
                className="text-red-600 hover:text-red-700"
              >
                <Lock className="h-4 w-4 mr-1" />
                Lock Admin
              </Button>
            </div>
          </div>
        </div>

        <AdminAnalyticsDashboard />
      </div>
    </ResponsiveLayout>
  );
};

export default AdminDashboardPage;
