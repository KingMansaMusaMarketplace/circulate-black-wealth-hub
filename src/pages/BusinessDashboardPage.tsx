
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, LineChart, QrCode, ShoppingBag, Store, Users } from 'lucide-react';

const BusinessDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real application, fetch business data here
    const fetchBusinessData = async () => {
      try {
        // Mock data for demonstration
        setBusinessProfile({
          name: "Example Business",
          customersToday: 12,
          totalSales: 1250,
          loyaltyScans: 34,
          qrCodes: 3
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching business data:', error);
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Business Dashboard | Mansa Musa Marketplace</title>
      </Helmet>
      
      <Navbar />
      
      <div className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Business Dashboard</h1>
              <p className="text-gray-500">Manage your business and track performance</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Link to="/qr-generator">
                <Button className="flex items-center gap-2">
                  <QrCode size={16} />
                  QR Codes
                </Button>
              </Link>
              <Link to="/business-profile">
                <Button variant="outline" className="flex items-center gap-2">
                  <Store size={16} />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customers Today</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {loading ? "..." : businessProfile?.customersToday || 0}
                    </h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Sales</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {loading ? "..." : `$${businessProfile?.totalSales || 0}`}
                    </h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">QR Scans</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {loading ? "..." : businessProfile?.loyaltyScans || 0}
                    </h3>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <QrCode className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active QR Codes</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {loading ? "..." : businessProfile?.qrCodes || 0}
                    </h3>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <QrCode className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="qr-codes">QR Codes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Business Overview</CardTitle>
                  <CardDescription>
                    Performance metrics for your business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">Analytics Dashboard</h3>
                      <p className="text-gray-500 text-sm max-w-sm">
                        Track your business performance over time with detailed analytics and insights.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Report</CardTitle>
                  <CardDescription>
                    Your business sales data and transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">Sales Tracking</h3>
                      <p className="text-gray-500 text-sm max-w-sm">
                        Monitor your transactions and revenue streams in one place.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Management</CardTitle>
                  <CardDescription>
                    Manage your customer relationships
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">Customer Insights</h3>
                      <p className="text-gray-500 text-sm max-w-sm">
                        Build stronger relationships with your customers through data-driven insights.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="qr-codes">
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Management</CardTitle>
                  <CardDescription>
                    Create and manage your business QR codes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">QR Code Generator</h3>
                      <p className="text-gray-500 text-sm max-w-sm">
                        Create and manage QR codes to boost customer engagement and loyalty.
                      </p>
                      <Link to="/qr-generator">
                        <Button className="mt-4">Go to QR Generator</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BusinessDashboardPage;
