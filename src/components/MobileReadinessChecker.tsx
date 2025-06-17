
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, AlertTriangle, Smartphone, Wifi, Battery } from 'lucide-react';

const MobileReadinessChecker: React.FC = () => {
  const { user } = useAuth();
  const deviceInfo = useDeviceDetection();
  const [connectivity, setConnectivity] = useState({
    online: navigator.onLine,
    connectionType: 'unknown',
    effectiveType: 'unknown'
  });

  useEffect(() => {
    const updateConnectivity = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      setConnectivity({
        online: navigator.onLine,
        connectionType: connection?.type || 'unknown',
        effectiveType: connection?.effectiveType || 'unknown'
      });
    };

    updateConnectivity();
    window.addEventListener('online', updateConnectivity);
    window.addEventListener('offline', updateConnectivity);

    return () => {
      window.removeEventListener('online', updateConnectivity);
      window.removeEventListener('offline', updateConnectivity);
    };
  }, []);

  const checkMobileReadiness = () => {
    const checks = [
      {
        name: 'User Authentication',
        status: user ? 'pass' : 'warning',
        message: user ? `Logged in as ${user.email}` : 'No user logged in'
      },
      {
        name: 'Mobile Device Detection',
        status: deviceInfo.isMobile ? 'pass' : 'info',
        message: deviceInfo.isMobile ? 'Mobile device detected' : 'Desktop device detected'
      },
      {
        name: 'Internet Connection',
        status: connectivity.online ? 'pass' : 'fail',
        message: connectivity.online ? `Connected (${connectivity.effectiveType})` : 'No internet connection'
      },
      {
        name: 'Touch Support',
        status: 'ontouchstart' in window ? 'pass' : 'warning',
        message: 'ontouchstart' in window ? 'Touch events supported' : 'No touch support detected'
      },
      {
        name: 'Local Storage',
        status: typeof(Storage) !== "undefined" ? 'pass' : 'fail',
        message: typeof(Storage) !== "undefined" ? 'Local storage available' : 'Local storage not supported'
      },
      {
        name: 'Camera API',
        status: navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? 'pass' : 'warning',
        message: navigator.mediaDevices ? 'Camera API available' : 'Camera API not available'
      },
      {
        name: 'Geolocation',
        status: navigator.geolocation ? 'pass' : 'warning',
        message: navigator.geolocation ? 'Geolocation supported' : 'Geolocation not available'
      }
    ];

    return checks;
  };

  const readinessChecks = checkMobileReadiness();
  const passedChecks = readinessChecks.filter(check => check.status === 'pass').length;
  const failedChecks = readinessChecks.filter(check => check.status === 'fail').length;
  const isReadyForMobile = failedChecks === 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Mobile Readiness Check
        </CardTitle>
        <CardDescription>
          Quick assessment of mobile deployment readiness
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <Alert className={isReadyForMobile ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
          {isReadyForMobile ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          )}
          <AlertDescription className={isReadyForMobile ? "text-green-800" : "text-yellow-800"}>
            {isReadyForMobile ? (
              <strong>✅ Ready for Mobile Deployment</strong>
            ) : (
              <strong>⚠️ Some issues detected - check details below</strong>
            )}
            <br />
            {passedChecks}/{readinessChecks.length} checks passed
          </AlertDescription>
        </Alert>

        {/* Device Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium mb-1">Device Type</div>
            <Badge variant={deviceInfo.isMobile ? "default" : "secondary"}>
              {deviceInfo.isMobile ? 'Mobile' : 'Desktop'}
            </Badge>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Platform</div>
            <Badge variant="outline">
              {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : 'Web'}
            </Badge>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Screen Size</div>
            <Badge variant="outline">{deviceInfo.screenSize}</Badge>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Orientation</div>
            <Badge variant="outline">{deviceInfo.orientation}</Badge>
          </div>
        </div>

        {/* Detailed Checks */}
        <div className="space-y-3">
          <h4 className="font-medium">System Checks</h4>
          {readinessChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(check.status)}
                <span className="text-sm font-medium">{check.name}</span>
              </div>
              <span className="text-xs text-gray-600">{check.message}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            <Wifi className="h-3 w-3 mr-1" />
            {connectivity.online ? 'Online' : 'Offline'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Battery className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileReadinessChecker;
