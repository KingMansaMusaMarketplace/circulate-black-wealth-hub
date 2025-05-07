
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  QrCode, 
  TrendingUp, 
  Award,
  DollarSign,
  Star,
  Clock,
  BarChart3
} from 'lucide-react';

const BusinessDashboard = () => {
  // Mock data
  const stats = {
    customers: 247,
    scans: 543,
    revenue: 12480,
    pointsAwarded: 2150,
    rating: 4.8,
    reviewCount: 92
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Customers</CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <div className="flex items-center">
              <Users className="text-mansablue mr-3 h-5 w-5" />
              <span className="text-2xl font-bold">{stats.customers}</span>
            </div>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total QR Scans</CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <div className="flex items-center">
              <QrCode className="text-mansablue mr-3 h-5 w-5" />
              <span className="text-2xl font-bold">{stats.scans}</span>
            </div>
            <p className="text-xs text-green-600 mt-2">+24% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Customer Rating</CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <div className="flex items-center">
              <Star className="text-mansagold mr-3 h-5 w-5" />
              <span className="text-2xl font-bold">{stats.rating}/5</span>
              <span className="text-xs text-gray-500 ml-2">({stats.reviewCount} reviews)</span>
            </div>
            <p className="text-xs text-green-600 mt-2">+0.2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Points Awarded</CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <div className="flex items-center">
              <Award className="text-mansablue mr-3 h-5 w-5" />
              <span className="text-2xl font-bold">{stats.pointsAwarded}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Across all customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue Generated</CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <div className="flex items-center">
              <DollarSign className="text-mansablue mr-3 h-5 w-5" />
              <span className="text-2xl font-bold">${stats.revenue}</span>
            </div>
            <p className="text-xs text-green-600 mt-2">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Visit Duration</CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <div className="flex items-center">
              <Clock className="text-mansablue mr-3 h-5 w-5" />
              <span className="text-2xl font-bold">24 min</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Based on 543 visits</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Customer Growth
            </CardTitle>
            <CardDescription>
              Monthly customer visits and revenue tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
              <div className="text-center">
                <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Charts would appear here in a production app</p>
                <p className="text-gray-400 text-sm mt-2">Visualizing customer visits and revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* QR Code Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Management
          </CardTitle>
          <CardDescription>
            Generate and manage QR codes for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg">
              <QrCode size={120} className="text-gray-400 mb-4" />
              <h3 className="font-medium mb-2">Standard QR Code</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Standard loyalty points for regular visits
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Download
                </Button>
                <Button size="sm">
                  Print
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg">
              <QrCode size={120} className="text-mansagold mb-4" />
              <h3 className="font-medium mb-2">Special Promotion QR</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Double points for special promotions
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Download
                </Button>
                <Button size="sm">
                  Print
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessDashboard;
