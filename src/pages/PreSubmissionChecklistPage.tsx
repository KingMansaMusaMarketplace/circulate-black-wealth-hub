import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, XCircle, ExternalLink, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  critical: boolean;
  link?: string;
}

const PreSubmissionChecklistPage: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'demo-account',
      title: 'Demo Account Credentials Match',
      description: 'Verify demo@mansamusa.com / Demo123! is set up in Supabase and displayed on login page',
      status: 'pending',
      critical: true,
    },
    {
      id: 'demo-data',
      title: 'Demo Account Has Full Data',
      description: 'Ensure demo account has complete business profile, QR codes, analytics, and transactions',
      status: 'pending',
      critical: true,
    },
    {
      id: 'video-playback',
      title: 'Video Playback Works on iPad',
      description: 'All YouTube videos use youtube-nocookie.com and have fallback buttons',
      status: 'pending',
      critical: true,
    },
    {
      id: 'buttons-visible',
      title: 'All Buttons Visible & Working',
      description: 'White and red variant buttons have proper contrast and readable text',
      status: 'pending',
      critical: true,
    },
    {
      id: 'auth-flow',
      title: 'Authentication Flow Works',
      description: 'Login, signup, password reset all functional',
      status: 'pending',
      critical: true,
    },
    {
      id: 'screenshots-clean',
      title: 'App Store Screenshots Are Clean',
      description: 'No pricing text or promotional language in screenshots',
      status: 'pending',
      critical: false,
    },
    {
      id: 'metadata-accurate',
      title: 'App Store Metadata Accurate',
      description: 'Description, features list, and keywords match actual app functionality',
      status: 'pending',
      critical: false,
    },
    {
      id: 'native-features',
      title: 'Native Features Tested',
      description: 'QR scanner, notifications, and geolocation tested on physical device',
      status: 'pending',
      critical: false,
    },
    {
      id: 'app-connect-updated',
      title: 'App Store Connect Updated',
      description: 'Demo credentials and review notes updated with: demo@mansamusa.com / Demo123!',
      status: 'pending',
      critical: true,
    },
  ]);

  const toggleStatus = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = item.status === 'pending' ? 'completed' : 
                         item.status === 'completed' ? 'failed' : 'pending';
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const criticalItems = checklist.filter(item => item.critical);
  const completedCritical = criticalItems.filter(item => item.status === 'completed').length;
  const failedCritical = criticalItems.filter(item => item.status === 'failed').length;

  const isReadyForSubmission = completedCritical === criticalItems.length && failedCritical === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Helmet>
        <title>Pre-Submission Checklist | Mansa Musa Marketplace</title>
        <meta name="description" content="Final checklist before Apple App Store submission" />
      </Helmet>

      <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-12 shadow-lg">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Pre-Submission Checklist</h1>
          </div>
          <p className="text-green-100 text-lg">
            Final verification before resubmitting to Apple App Store
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="mb-6 border-2 border-primary">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              Submission Readiness Status
            </CardTitle>
            <CardDescription>
              Complete all critical items before resubmitting
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    Critical Items: {completedCritical}/{criticalItems.length} completed
                  </p>
                  {failedCritical > 0 && (
                    <p className="text-sm text-red-600 font-medium">
                      🚨 {failedCritical} critical item(s) failed - fix before submission!
                    </p>
                  )}
                </div>
                {isReadyForSubmission && (
                  <Badge variant="default" className="text-lg px-4 py-2">
                    ✅ Ready for Submission
                  </Badge>
                )}
              </div>

              {isReadyForSubmission && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    All critical items completed! You can now resubmit to Apple App Store Connect.
                    Remember to update the demo account credentials in App Store Connect review information.
                  </AlertDescription>
                </Alert>
              )}

              {!isReadyForSubmission && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Complete all critical items before resubmission to avoid another rejection.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {checklist.map((item) => (
            <Card 
              key={item.id}
              className={`
                transition-all cursor-pointer hover:shadow-md
                ${item.status === 'completed' ? 'border-green-500 bg-green-50' : ''}
                ${item.status === 'failed' ? 'border-red-500 bg-red-50' : ''}
                ${item.critical ? 'border-2' : ''}
              `}
              onClick={() => toggleStatus(item.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(item.status)}
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {item.title}
                        {item.critical && (
                          <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                  {item.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.link, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>📝 Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/apple-compliance'}
            >
              Run Full Compliance Test
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/button-test'}
            >
              Test All Buttons
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/login'}
            >
              View Demo Account Credentials
            </Button>
          </CardContent>
        </Card>

        <Alert className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> After completing this checklist, run the full compliance test at /apple-compliance 
            to verify all systems are working correctly before resubmission.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  );
};

export default PreSubmissionChecklistPage;
