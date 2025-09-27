
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, QrCode, TrendingUp, Settings, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { ContextualTooltip } from '@/components/ui/ContextualTooltip';
import { ProgressiveDisclosure } from '@/components/ui/ProgressiveDisclosure';
import { BUSINESS_CONTEXTUAL_TIPS } from '@/lib/business-onboarding-constants';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const { profile, loading } = useBusinessProfile();

  const mockData = {
    totalCustomers: 156,
    monthlyScans: 342,
    revenue: 4250,
    growthRate: 12.5
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansablue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProgressiveDisclosure
        id="business-dashboard-welcome"
        title="Welcome to Your Business Dashboard!"
        message="This is your command center for managing your business on Mansa Musa Marketplace. Track customers, monitor QR code scans, and grow your reach in the community."
        autoShow={!profile}
        position="top"
        actionText="Let's Get Started!"
      />
      
      {/* Welcome Section */}
      <ContextualTooltip
        id="business-dashboard-overview"
        title={BUSINESS_CONTEXTUAL_TIPS['business-dashboard'].title}
        tip={BUSINESS_CONTEXTUAL_TIPS['business-dashboard'].tip}
        trigger="auto"
        delay={2000}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mansablue mb-2">
            Welcome back, {profile?.business_name || user?.user_metadata?.fullName || 'Business Owner'}
          </h1>
          <p className="text-gray-600">
            Manage your business and track your performance
          </p>
        </div>
      </ContextualTooltip>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <ContextualTooltip
          id="business-profile-management"
          title={BUSINESS_CONTEXTUAL_TIPS['business-profile'].title}
          tip={BUSINESS_CONTEXTUAL_TIPS['business-profile'].tip}
          trigger="hover"
        >
          <Link to="/business/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Settings className="h-8 w-8 mx-auto mb-2 text-mansablue" />
                <h3 className="font-medium">Manage Profile</h3>
                <p className="text-sm text-gray-500">Update business info</p>
              </CardContent>
            </Card>
          </Link>
        </ContextualTooltip>

        <ContextualTooltip
          id="qr-code-management"
          title={BUSINESS_CONTEXTUAL_TIPS['qr-code-creation'].title}
          tip={BUSINESS_CONTEXTUAL_TIPS['qr-code-creation'].tip}
          trigger="hover"
        >
          <Link to="/business/qr-codes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <QrCode className="h-8 w-8 mx-auto mb-2 text-mansablue" />
                <h3 className="font-medium">QR Codes</h3>
                <p className="text-sm text-gray-500">Generate & manage</p>
              </CardContent>
            </Card>
          </Link>
        </ContextualTooltip>

        <Link to="/loyalty">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-mansablue" />
              <h3 className="font-medium">Loyalty System</h3>
              <p className="text-sm text-gray-500">View customer points</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Plus className="h-8 w-8 mx-auto mb-2 text-mansagold" />
            <h3 className="font-medium">Add Feature</h3>
            <p className="text-sm text-gray-500">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Cards */}
      <ContextualTooltip
        id="business-analytics-overview"
        title={BUSINESS_CONTEXTUAL_TIPS['analytics-overview'].title}
        tip={BUSINESS_CONTEXTUAL_TIPS['analytics-overview'].tip}
        trigger="auto"
        delay={3000}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.monthlyScans}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockData.revenue}</div>
            <p className="text-xs text-muted-foreground">
              +{mockData.growthRate}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.growthRate}%</div>
            <p className="text-xs text-muted-foreground">
              Monthly growth
            </p>
          </CardContent>
        </Card>
      </div>
      </ContextualTooltip>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <QrCode className="h-4 w-4 text-mansablue" />
                <span className="text-sm">Customer scanned loyalty QR</span>
              </div>
              <span className="text-xs text-muted-foreground">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-mansagold" />
                <span className="text-sm">New customer registration</span>
              </div>
              <span className="text-xs text-muted-foreground">15 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">Profile view milestone reached</span>
              </div>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Profile Status */}
      {!profile && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Complete Your Business Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-4">
              Complete your business profile to unlock all features and improve your visibility.
            </p>
            <Link to="/business/profile">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                Complete Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessDashboard;
