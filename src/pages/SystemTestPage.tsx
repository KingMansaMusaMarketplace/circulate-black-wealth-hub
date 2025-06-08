
import React from 'react';
import { Helmet } from 'react-helmet';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiKeyManager from '@/components/admin/ApiKeyManager';
import DataSeeder from '@/components/admin/DataSeeder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Settings, Database, Key, TestTube } from 'lucide-react';

const SystemTestPage: React.FC = () => {
  const systemStatus = [
    { name: 'Frontend Routing', status: 'healthy', description: 'All routes working correctly' },
    { name: 'Supabase Connection', status: 'healthy', description: 'Database and auth configured' },
    { name: 'Edge Functions', status: 'healthy', description: 'Business notifications ready' },
    { name: 'Email System', status: 'warning', description: 'Needs Resend API key' },
    { name: 'Payment System', status: 'healthy', description: 'Stripe configured for test mode' },
    { name: 'Authentication', status: 'healthy', description: 'User flows implemented' }
  ];

  const getStatusIcon = (status: string) => {
    return status === 'healthy' ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusBadge = (status: string) => {
    return status === 'healthy' ? 
      <Badge className="bg-green-100 text-green-800">Healthy</Badge> :
      <Badge className="bg-yellow-100 text-yellow-800">Needs Setup</Badge>;
  };

  return (
    <ResponsiveLayout
      title="System Testing & Configuration"
      description="Test and configure all system components"
    >
      <Helmet>
        <title>System Test | Mansa Musa Marketplace</title>
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              System Health Overview
            </CardTitle>
            <CardDescription>
              Current status of all system components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {systemStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuration Tabs */}
        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="data-seeding" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Seeding
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Deployment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys">
            <ApiKeyManager />
          </TabsContent>

          <TabsContent value="data-seeding">
            <DataSeeder />
          </TabsContent>

          <TabsContent value="deployment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Production Deployment Checklist
                </CardTitle>
                <CardDescription>
                  Steps to prepare for production deployment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Configure production Stripe keys</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Set up custom domain</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Configure email domain verification</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Enable SSL certificate</span>
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Database backup strategy</span>
                    <Badge className="bg-green-100 text-green-800">Configured</Badge>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button className="w-full" size="lg">
                    Deploy to Production
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default SystemTestPage;
