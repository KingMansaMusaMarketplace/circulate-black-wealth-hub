
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, UserSquare, ArrowUpRight, ArrowDownRight, TrendingUp, BadgeDollarSign, CalendarDays, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BusinessDashboard = () => {
  const navigate = useNavigate();

  // Mock data
  const customerData = [
    { day: 'Mon', customers: 12 },
    { day: 'Tue', customers: 19 },
    { day: 'Wed', customers: 15 },
    { day: 'Thu', customers: 22 },
    { day: 'Fri', customers: 30 },
    { day: 'Sat', customers: 25 },
    { day: 'Sun', customers: 18 },
  ];
  
  const recentScans = [
    { id: 1, customer: "Jasmine W.", time: "10:30 AM", points: 15, date: "Today" },
    { id: 2, customer: "Marcus L.", time: "2:15 PM", points: 10, date: "Today" },
    { id: 3, customer: "Denise T.", time: "5:45 PM", points: 15, date: "Yesterday" },
    { id: 4, customer: "Terrance B.", time: "1:20 PM", points: 10, date: "Yesterday" },
  ];
  
  const metricsData = {
    dailyScans: { value: 24, change: +15, isPositive: true },
    totalCustomers: { value: 152, change: +8, isPositive: true },
    loyaltyPoints: { value: 360, change: +120, isPositive: true },
    retentionRate: { value: "78%", change: -2, isPositive: false },
  };

  const handleQRCodeManagement = () => {
    navigate('/business/qr-codes');
  };

  const handlePromotionsManagement = () => {
    // Navigate to business profile with promotions/settings tab
    navigate('/business/profile?tab=profile');
  };

  const handleAnalytics = () => {
    // Navigate to business profile with analytics tab
    navigate('/business/profile?tab=analytics');
  };

  const handleViewAllActivity = () => {
    // Navigate to business profile analytics tab for detailed activity
    navigate('/business/profile?tab=analytics');
  };

  const handleViewProfile = () => {
    navigate('/business/profile');
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleQRCodeManagement}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <QrCode className="h-5 w-5 text-mansablue" />
              QR Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Generate and manage QR codes</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewProfile}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <UserSquare className="h-5 w-5 text-mansablue" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Manage business profile</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleAnalytics}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-mansablue" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">View detailed analytics</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handlePromotionsManagement}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-mansablue" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Business settings and promotions</p>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Scans"
          value={metricsData.dailyScans.value}
          change={metricsData.dailyScans.change}
          isPositive={metricsData.dailyScans.isPositive}
          icon={<QrCode />}
          description="QR codes scanned today"
        />
        <MetricCard
          title="Total Customers"
          value={metricsData.totalCustomers.value}
          change={metricsData.totalCustomers.change}
          isPositive={metricsData.totalCustomers.isPositive}
          icon={<UserSquare />}
          description="Unique customers"
        />
        <MetricCard
          title="Points Awarded"
          value={metricsData.loyaltyPoints.value}
          change={metricsData.loyaltyPoints.change}
          isPositive={metricsData.loyaltyPoints.isPositive}
          icon={<BadgeDollarSign />}
          description="This month"
        />
        <MetricCard
          title="Retention Rate"
          value={metricsData.retentionRate.value}
          change={metricsData.retentionRate.change}
          isPositive={metricsData.retentionRate.isPositive}
          icon={<TrendingUp />}
          description="Customer return rate"
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Visits Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Customer Visits</CardTitle>
            <CardDescription>Daily customer scan activity</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={customerData}
                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="customers" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest QR code scans</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                  <div className="w-8 h-8 rounded-full bg-mansablue/10 flex items-center justify-center mr-3">
                    <span className="text-mansablue text-xs font-bold">
                      {scan.customer.split(' ')[0][0]}{scan.customer.split(' ')[1][0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{scan.customer}</div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      {scan.time} • {scan.date}
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    +{scan.points}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-center">
            <Button 
              variant="ghost" 
              className="text-mansablue text-sm hover:underline"
              onClick={handleViewAllActivity}
            >
              View all activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number | string;
  change: number;
  isPositive: boolean;
  icon: React.ReactNode;
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon,
  description
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="p-2 bg-gray-100 rounded-full">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-sm mt-1">
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'} mr-2`}>
            {isPositive ? (
              <ArrowUpRight size={16} className="mr-1" />
            ) : (
              <ArrowDownRight size={16} className="mr-1" />
            )}
            {change}%
          </div>
          <div className="text-gray-500">{description}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessDashboard;
