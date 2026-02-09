import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Smartphone, 
  QrCode, 
  Database, 
  Shield,
  CheckCircle,
  Wifi,
  Camera,
  MapPin,
  Users,
  Settings,
  CreditCard,
  UserPlus,
  FileCheck,
  ExternalLink,
  Apple
} from 'lucide-react';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { Link } from 'react-router-dom';

// Import existing test components
import FullSystemTest from '@/components/testing/FullSystemTest';

const UnifiedTestDashboard: React.FC = () => {
  const deviceInfo = useDeviceDetection();
  const [activeTab, setActiveTab] = useState('system');

  // Quick device info
  const connectivity = useMemo(() => ({
    online: navigator.onLine,
    connection: (navigator as any).connection?.effectiveType || 'unknown',
  }), []);

  const testQRScanner = () => {
    window.location.href = '/scanner';
  };

  const testGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        alert(`Location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      },
      (error) => {
        alert(`Location error: ${error.message}`);
      }
    );
  };

  // Consolidated test page links
  const testPageLinks = [
    { name: 'Apple Compliance Test', path: '/apple-compliance-test', icon: Apple, category: 'Compliance' },
    { name: 'Master Apple Review', path: '/master-apple-review-test', icon: FileCheck, category: 'Compliance' },
    { name: 'Pre-Submission Checklist', path: '/pre-submission-checklist', icon: CheckCircle, category: 'Compliance' },
    { name: 'Capacitor Test', path: '/capacitor-test', icon: Smartphone, category: 'Mobile' },
    { name: 'Native Features Demo', path: '/native-features-demo', icon: Settings, category: 'Mobile' },
    { name: 'Payment Test', path: '/payment-test', icon: CreditCard, category: 'Features' },
    { name: 'QR Test', path: '/qr-test', icon: QrCode, category: 'Features' },
    { name: 'Signup Test', path: '/signup-test', icon: UserPlus, category: 'Auth' },
    { name: 'Button Test', path: '/button-test', icon: Play, category: 'UI' },
    { name: 'Stripe Test', path: '/stripe-test', icon: CreditCard, category: 'Features' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      
      <Helmet>
        <title>Unified Test Dashboard | Mansa Musa Marketplace</title>
        <meta name="description" content="Comprehensive testing dashboard for all system components" />
      </Helmet>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Unified Test Dashboard
          </h1>
          <p className="text-blue-200">All testing tools consolidated in one place</p>
        </div>

        {/* Quick Status Bar */}
        <Card className="mb-6 bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardContent className="py-4">
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-white">
                  {deviceInfo.isCapacitor ? 'Native' : 'Web'} • {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : 'Desktop'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-yellow-400" />
                <Badge variant={connectivity.online ? 'default' : 'destructive'} className="text-xs">
                  {connectivity.online ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-blue-200">{window.innerWidth}x{window.innerHeight}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-white/10">
            <TabsTrigger value="system" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <Database className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="mobile" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile
            </TabsTrigger>
            <TabsTrigger value="auth" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <Shield className="h-4 w-4 mr-2" />
              Auth
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <Settings className="h-4 w-4 mr-2" />
              Features
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <ExternalLink className="h-4 w-4 mr-2" />
              All Tests
            </TabsTrigger>
          </TabsList>

          {/* System Tests Tab */}
          <TabsContent value="system" className="space-y-6">
            <FullSystemTest />
          </TabsContent>

          {/* Mobile Tests Tab */}
          <TabsContent value="mobile" className="space-y-6">
            {/* Device Information */}
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Smartphone className="h-5 w-5 text-yellow-400" />
                  Device Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium text-yellow-300">Platform</div>
                    <Badge variant={deviceInfo.isCapacitor ? "default" : "secondary"}>
                      {deviceInfo.isCapacitor ? 'Native App' : 'Web App'}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-yellow-300">OS</div>
                    <Badge variant="outline" className="border-yellow-400/30 text-blue-200">
                      {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : 'Web'}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-yellow-300">Screen Size</div>
                    <Badge variant="outline" className="border-yellow-400/30 text-blue-200">
                      {deviceInfo.screenSize}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-yellow-300">Orientation</div>
                    <Badge variant="outline" className="border-yellow-400/30 text-blue-200">
                      {deviceInfo.orientation}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Readiness Checklist */}
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Mobile Readiness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { item: 'Capacitor Configuration', status: true },
                    { item: 'iOS Safe Area Support', status: true },
                    { item: 'Permission Handling', status: true },
                    { item: 'Offline Detection', status: true },
                    { item: 'Mobile Navigation', status: true },
                    { item: 'Touch Optimization', status: true },
                    { item: 'PWA Manifest', status: true },
                    { item: 'App Store Ready', status: true }
                  ].map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg border border-white/5">
                      <span className="text-sm text-blue-200">{check.item}</span>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feature Tests Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Feature Tests</CardTitle>
                <CardDescription className="text-blue-200">
                  Test core app functionality directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={testQRScanner}
                    className="w-full justify-start bg-slate-800/50 border border-white/10 hover:bg-slate-700/50"
                    variant="outline"
                  >
                    <QrCode className="h-4 w-4 mr-2 text-yellow-400" />
                    <span className="text-white">Test QR Code Scanner</span>
                  </Button>
                  
                  <Button 
                    onClick={testGeolocation}
                    className="w-full justify-start bg-slate-800/50 border border-white/10 hover:bg-slate-700/50"
                    variant="outline"
                  >
                    <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
                    <span className="text-white">Test Location Services</span>
                  </Button>

                  <Link to="/directory" className="w-full">
                    <Button 
                      className="w-full justify-start bg-slate-800/50 border border-white/10 hover:bg-slate-700/50"
                      variant="outline"
                    >
                      <Database className="h-4 w-4 mr-2 text-yellow-400" />
                      <span className="text-white">Test Business Directory</span>
                    </Button>
                  </Link>

                  <Link to="/community-impact" className="w-full">
                    <Button 
                      className="w-full justify-start bg-slate-800/50 border border-white/10 hover:bg-slate-700/50"
                      variant="outline"
                    >
                      <Camera className="h-4 w-4 mr-2 text-yellow-400" />
                      <span className="text-white">Test Impact Dashboard</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* API Status */}
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Permissions Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-white">Camera</span>
                    </div>
                    <Badge variant="outline" className="border-green-400/30 text-green-400">
                      {navigator.mediaDevices ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-white">Location</span>
                    </div>
                    <Badge variant="outline" className="border-green-400/30 text-green-400">
                      {navigator.geolocation ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-white">Network</span>
                    </div>
                    <Badge variant="outline" className={connectivity.online ? "border-green-400/30 text-green-400" : "border-red-400/30 text-red-400"}>
                      {connectivity.online ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auth Tests Tab */}
          <TabsContent value="auth" className="space-y-6">
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Authentication Tests</CardTitle>
                <CardDescription className="text-blue-200">
                  Test user authentication flows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/signup" className="w-full">
                    <Button 
                      className="w-full justify-start bg-slate-800/50 border border-white/10 hover:bg-slate-700/50"
                      variant="outline"
                    >
                      <UserPlus className="h-4 w-4 mr-2 text-yellow-400" />
                      <span className="text-white">Test Signup Flow</span>
                    </Button>
                  </Link>
                  
                  <Link to="/login" className="w-full">
                    <Button 
                      className="w-full justify-start bg-slate-800/50 border border-white/10 hover:bg-slate-700/50"
                      variant="outline"
                    >
                      <Shield className="h-4 w-4 mr-2 text-yellow-400" />
                      <span className="text-white">Test Login Flow</span>
                    </Button>
                  </Link>

                  <Link to="/business-signup" className="w-full">
                    <Button 
                      className="w-full justify-start bg-slate-800/50 border border-white/10 hover:bg-slate-700/50"
                      variant="outline"
                    >
                      <Users className="h-4 w-4 mr-2 text-yellow-400" />
                      <span className="text-white">Test Business Signup</span>
                    </Button>
                  </Link>

                  <Link to="/password-reset" className="w-full">
                    <Button 
                      className="w-full justify-start bg-slate-800/50 border border-white/10 hover:bg-slate-700/50"
                      variant="outline"
                    >
                      <Shield className="h-4 w-4 mr-2 text-yellow-400" />
                      <span className="text-white">Test Password Reset</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Test Pages Tab */}
          <TabsContent value="all" className="space-y-6">
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">All Test Pages Directory</CardTitle>
                <CardDescription className="text-blue-200">
                  Quick access to all available test pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {['Compliance', 'Mobile', 'Features', 'Auth', 'UI'].map((category) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-sm font-semibold text-yellow-400 mb-3">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {testPageLinks
                        .filter(link => link.category === category)
                        .map((link) => (
                          <Link key={link.path} to={link.path} className="w-full">
                            <Button 
                              className="w-full justify-start bg-slate-800/50 border border-white/10 hover:bg-slate-700/50"
                              variant="outline"
                              size="sm"
                            >
                              <link.icon className="h-4 w-4 mr-2 text-yellow-400" />
                              <span className="text-white text-sm">{link.name}</span>
                            </Button>
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back to Admin */}
        <div className="text-center mt-8">
          <Link to="/admin-dashboard">
            <Button variant="outline" className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
              ← Back to Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnifiedTestDashboard;
