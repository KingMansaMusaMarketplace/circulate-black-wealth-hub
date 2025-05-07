
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { QRCodeGenerator } from '@/components/business/qr-code';
import { QrCode, BarChart3, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const QRCodeManagementPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile: business, loading: profileLoading } = useBusinessProfile();
  const [activeTab, setActiveTab] = useState('generate');
  
  // Mock QR code data for demonstration
  const [qrCodes, setQrCodes] = useState([
    {
      id: '1',
      type: 'loyalty',
      pointsValue: 10,
      scanLimit: 100,
      currentScans: 37,
      createdAt: '2023-04-10',
      expirationDate: '2023-05-10',
      isActive: true
    },
    {
      id: '2',
      type: 'discount',
      discountPercentage: 15,
      scanLimit: 50,
      currentScans: 23,
      createdAt: '2023-04-08',
      expirationDate: '2023-05-08',
      isActive: true
    },
    {
      id: '3',
      type: 'info',
      scanLimit: null,
      currentScans: 15,
      createdAt: '2023-04-05',
      expirationDate: null,
      isActive: true
    },
    {
      id: '4',
      type: 'loyalty',
      pointsValue: 5,
      scanLimit: 200,
      currentScans: 200,
      createdAt: '2023-03-15',
      expirationDate: '2023-04-15',
      isActive: false
    }
  ]);
  
  const [scanMetrics, setScanMetrics] = useState({
    totalScans: 275,
    uniqueCustomers: 152,
    totalPointsAwarded: 2380,
    averagePointsPerScan: 8.7
  });
  
  // Show loading state
  if (authLoading || profileLoading) {
    return (
      <DashboardLayout title="QR Code Management" location="">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <DashboardLayout 
      title="QR Code Management" 
      icon={<QrCode className="mr-2 h-5 w-5" />}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="generate">Generate QR Codes</TabsTrigger>
          <TabsTrigger value="manage">Manage QR Codes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-6">
          <QRCodeGenerator />
        </TabsContent>
        
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Your QR Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Scans</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qrCodes.map((qrCode) => (
                    <TableRow key={qrCode.id}>
                      <TableCell className="font-medium capitalize">
                        <div className="flex items-center gap-2">
                          {qrCode.type === 'loyalty' && <Award className="h-4 w-4 text-mansagold" />}
                          {qrCode.type === 'discount' && <BadgePercent className="h-4 w-4 text-mansablue" />}
                          {qrCode.type === 'info' && <QrCode className="h-4 w-4 text-gray-600" />}
                          {qrCode.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        {qrCode.type === 'loyalty' && `${qrCode.pointsValue} points`}
                        {qrCode.type === 'discount' && `${qrCode.discountPercentage}% off`}
                        {qrCode.type === 'info' && 'Business Info'}
                      </TableCell>
                      <TableCell>
                        {qrCode.scanLimit ? 
                          `${qrCode.currentScans}/${qrCode.scanLimit}` : 
                          qrCode.currentScans
                        }
                      </TableCell>
                      <TableCell>{qrCode.createdAt}</TableCell>
                      <TableCell>
                        {qrCode.expirationDate || <span className="text-gray-400">Never</span>}
                      </TableCell>
                      <TableCell>
                        {qrCode.isActive ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 border-gray-300">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={qrCode.isActive ? "text-red-500" : "text-green-500"}
                        >
                          {qrCode.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Total Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{scanMetrics.totalScans}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Unique Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{scanMetrics.uniqueCustomers}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Points Awarded</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{scanMetrics.totalPointsAwarded}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Avg. Points/Scan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{scanMetrics.averagePointsPerScan}</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Scan Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-gray-500">QR Scan Analytics</p>
                  <p className="text-sm text-gray-400">
                    Visualizations of your scan data would appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default QRCodeManagementPage;
