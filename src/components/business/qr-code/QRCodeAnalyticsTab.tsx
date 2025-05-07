
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Users, Award, Calendar } from 'lucide-react';

const demoData = [
  { name: 'Monday', scans: 12 },
  { name: 'Tuesday', scans: 19 },
  { name: 'Wednesday', scans: 15 },
  { name: 'Thursday', scans: 25 },
  { name: 'Friday', scans: 30 },
  { name: 'Saturday', scans: 24 },
  { name: 'Sunday', scans: 13 },
];

interface QRCodeAnalyticsTabProps {
  metrics: {
    totalScans: number;
    uniqueCustomers: number;
    totalPointsAwarded: number;
    averagePointsPerScan: number;
  };
}

export const QRCodeAnalyticsTab: React.FC<QRCodeAnalyticsTabProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Scans" 
          value={metrics.totalScans} 
          icon={<QrCode />} 
          description="Total QR code scans" 
        />
        <MetricCard 
          title="Unique Customers" 
          value={metrics.uniqueCustomers} 
          icon={<Users />} 
          description="Distinct customers" 
        />
        <MetricCard 
          title="Points Awarded" 
          value={metrics.totalPointsAwarded} 
          icon={<Award />} 
          description="Total loyalty points" 
        />
        <MetricCard 
          title="Avg Points/Scan" 
          value={metrics.averagePointsPerScan} 
          icon={<Award />} 
          description="Average per scan" 
        />
      </div>

      <Tabs defaultValue="weekly">
        <CardHeader className="px-0 pt-0">
          <div className="flex justify-between items-center">
            <CardTitle>Scan Activity</CardTitle>
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        
        <TabsContent value="weekly" className="mt-0 p-0">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demoData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="scans" fill="#4f46e5" name="Scans" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-0 p-0">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-md">
                <p className="text-gray-500">Monthly analytics coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, description }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);
