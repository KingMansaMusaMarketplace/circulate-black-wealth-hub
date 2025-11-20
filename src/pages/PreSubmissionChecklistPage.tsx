import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, AlertCircle, XCircle, ExternalLink, Shield, Sparkles, Target } from 'lucide-react';
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
      case 'completed': return <CheckCircle2 className="h-6 w-6 text-green-600 animate-pulse" />;
      case 'failed': return <XCircle className="h-6 w-6 text-red-600 animate-pulse" />;
      default: return <AlertCircle className="h-6 w-6 text-gray-400" />;
    }
  };

  const criticalItems = checklist.filter(item => item.critical);
  const completedCritical = criticalItems.filter(item => item.status === 'completed').length;
  const failedCritical = criticalItems.filter(item => item.status === 'failed').length;

  const isReadyForSubmission = completedCritical === criticalItems.length && failedCritical === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-yellow-500/15 to-amber-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-gradient-to-br from-green-400/15 to-emerald-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <Helmet>
        <title>Pre-Submission Checklist | Mansa Musa Marketplace</title>
        <meta name="description" content="Final checklist before Apple App Store submission" />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-yellow-500 to-purple-600 text-white py-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-yellow-400/20"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border-2 border-white/30 shadow-xl">
              <Shield className="h-12 w-12 drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-bold drop-shadow-lg">Pre-Submission Checklist</h1>
          </div>
          <p className="text-white text-xl font-medium">
            ✨ Final verification before resubmitting to Apple App Store
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* Status Card */}
        <Card className="mb-8 bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-all group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Target className="h-7 w-7 text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Submission Readiness Status
              </span>
            </CardTitle>
            <CardDescription className="text-base font-medium text-white/80">
              Complete all critical items before resubmitting
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur rounded-xl border-2 border-green-400/30">
                <div>
                  <p className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Critical Items: {completedCritical}/{criticalItems.length} completed
                  </p>
                  {failedCritical > 0 && (
                    <p className="text-base text-red-400 font-bold mt-1 animate-pulse">
                      🚨 {failedCritical} critical item(s) failed - fix before submission!
                    </p>
                  )}
                </div>
                {isReadyForSubmission && (
                  <Badge className="text-lg px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-xl animate-pulse">
                    ✅ Ready for Submission
                  </Badge>
                )}
              </div>

              {isReadyForSubmission && (
                <Alert className="bg-green-900/40 backdrop-blur border-2 border-green-400 shadow-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <AlertDescription className="text-base font-medium text-green-200">
                    <strong>🎉 All critical items completed!</strong> You can now resubmit to Apple App Store Connect.
                    Remember to update the demo account credentials in App Store Connect review information.
                  </AlertDescription>
                </Alert>
              )}

              {!isReadyForSubmission && (
                <Alert variant="destructive" className="bg-red-900/40 backdrop-blur border-2 border-red-400 shadow-lg">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="text-base font-medium text-white">
                    Complete all critical items before resubmission to avoid another rejection.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Checklist Items */}
        <div className="space-y-4">
          {checklist.map((item, index) => {
            
            return (
              <Card 
                key={item.id}
                className={`
                  transition-all cursor-pointer hover:shadow-2xl hover:scale-102 group
                  bg-slate-900/40 backdrop-blur-xl border-white/10
                  shadow-xl
                  ${item.status === 'completed' ? 'ring-4 ring-green-400/50 shadow-green-400/20' : ''}
                  ${item.status === 'failed' ? 'ring-4 ring-red-400/50 shadow-red-400/20' : ''}
                `}
                onClick={() => toggleStatus(item.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2 flex-wrap text-white">
                          <span className="font-bold">{item.title}</span>
                          {item.critical && (
                            <Badge className="text-xs bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 shadow-lg animate-pulse">
                              ⚠️ CRITICAL
                            </Badge>
                          )}
                          {item.status === 'completed' && (
                            <Badge className="text-xs bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg">
                              ✅ Done
                            </Badge>
                          )}
                          {item.status === 'failed' && (
                            <Badge className="text-xs bg-gradient-to-r from-red-600 to-pink-600 text-white border-0 shadow-lg">
                              ❌ Failed
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-2 text-base font-medium text-white/80">
                          {item.description}
                        </CardDescription>
                      </div>
                    </div>
                    {item.link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:scale-110 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(item.link, '_blank');
                        }}
                      >
                        <ExternalLink className="h-5 w-5 text-white" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                📝 Quick Actions
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 relative z-10">
            <Button 
              variant="outline" 
              className="w-full justify-start text-base font-semibold hover:scale-105 transition-transform shadow-lg border-2 border-white/20 hover:border-white/40 bg-slate-800/50 text-white hover:bg-slate-700/50"
              onClick={() => window.location.href = '/apple-compliance'}
            >
              🧪 Run Full Compliance Test
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-base font-semibold hover:scale-105 transition-transform shadow-lg border-2 border-white/20 hover:border-white/40 bg-slate-800/50 text-white hover:bg-slate-700/50"
              onClick={() => window.location.href = '/button-test'}
            >
              🎨 Test All Buttons
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-base font-semibold hover:scale-105 transition-transform shadow-lg border-2 border-white/20 hover:border-white/40 bg-slate-800/50 text-white hover:bg-slate-700/50"
              onClick={() => window.location.href = '/login'}
            >
              👤 View Demo Account Credentials
            </Button>
          </CardContent>
        </Card>

        {/* Important Note */}
        <Alert className="mt-6 bg-yellow-900/40 backdrop-blur border-2 border-yellow-400 shadow-xl">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
          <AlertDescription className="text-base font-medium text-yellow-200">
            <strong className="text-yellow-300">💡 Important:</strong> After completing this checklist, run the full compliance test at /apple-compliance 
            to verify all systems are working correctly before resubmission.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  );
};

export default PreSubmissionChecklistPage;
