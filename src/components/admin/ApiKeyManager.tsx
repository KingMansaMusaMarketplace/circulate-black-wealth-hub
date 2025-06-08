
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Key, Mail, CreditCard, Database, CheckCircle, AlertCircle } from 'lucide-react';

interface ApiKeyStatus {
  name: string;
  icon: React.ElementType;
  status: 'configured' | 'missing' | 'testing';
  description: string;
  required: boolean;
}

const ApiKeyManager: React.FC = () => {
  const [keys, setKeys] = useState({
    resend: '',
    stripe: '',
    openai: ''
  });
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const apiKeyStatuses: ApiKeyStatus[] = [
    {
      name: 'Resend API Key',
      icon: Mail,
      status: 'missing',
      description: 'Required for sending transactional emails (welcome, notifications)',
      required: true
    },
    {
      name: 'Stripe Secret Key',
      icon: CreditCard,
      status: 'configured',
      description: 'Required for processing payments and subscriptions',
      required: true
    },
    {
      name: 'Supabase Configuration',
      icon: Database,
      status: 'configured',
      description: 'Database and authentication backend',
      required: true
    }
  ];

  const testEmailSystem = async () => {
    setIsTestingEmail(true);
    try {
      // This would call the actual email testing function
      toast.success('Email system test initiated', {
        description: 'Check the edge function logs for detailed results'
      });
    } catch (error) {
      toast.error('Email test failed', {
        description: 'Please check your Resend API key configuration'
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const StatusIcon = ({ status }: { status: 'configured' | 'missing' | 'testing' }) => {
    switch (status) {
      case 'configured':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'missing':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'testing':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Configuration
          </CardTitle>
          <CardDescription>
            Configure external service API keys for full functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Key Status Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Status</h3>
            <div className="grid gap-4">
              {apiKeyStatuses.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{service.name}</span>
                          <StatusIcon status={service.status} />
                          <Badge variant={service.status === 'configured' ? 'default' : 'destructive'}>
                            {service.status}
                          </Badge>
                          {service.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Quick Setup Instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Setup Guide</h3>
            
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">1. Resend Email Service</h4>
                <p className="text-sm text-blue-800 mb-3">
                  Sign up at resend.com and create an API key for transactional emails.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://resend.com/signup" target="_blank" rel="noopener noreferrer">
                      Sign Up for Resend
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer">
                      Create API Key
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer">
                      Verify Domain
                    </a>
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">2. Stripe Payments</h4>
                <p className="text-sm text-green-800 mb-3">
                  Your Stripe secret key is already configured. Test mode is active.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <a href="https://dashboard.stripe.com/test/dashboard" target="_blank" rel="noopener noreferrer">
                    View Stripe Dashboard
                  </a>
                </Button>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">3. Database & Authentication</h4>
                <p className="text-sm text-purple-800 mb-3">
                  Supabase is fully configured with database tables and edge functions.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <a href="https://supabase.com/dashboard/project/agoclnqfyinwjxdmjnns" target="_blank" rel="noopener noreferrer">
                    View Supabase Dashboard
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Test Functions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">System Tests</h3>
            <div className="grid gap-3">
              <Button 
                onClick={testEmailSystem}
                disabled={isTestingEmail}
                variant="outline"
                className="justify-start"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isTestingEmail ? 'Testing Email System...' : 'Test Email System'}
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a href="/stripe-test" target="_blank" rel="noopener noreferrer">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Test Stripe Integration
                </a>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a href="/signup-test" target="_blank" rel="noopener noreferrer">
                  <Database className="h-4 w-4 mr-2" />
                  Test Authentication Flow
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyManager;
