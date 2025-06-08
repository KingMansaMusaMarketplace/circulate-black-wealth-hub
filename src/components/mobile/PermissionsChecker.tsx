
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, Bell, Check, X, AlertTriangle } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/use-device-detection';

interface Permission {
  name: string;
  status: 'granted' | 'denied' | 'prompt' | 'unknown';
  icon: React.ReactNode;
  description: string;
  required: boolean;
}

const PermissionsChecker: React.FC = () => {
  const { isCapacitor } = useDeviceDetection();
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      name: 'camera',
      status: 'unknown',
      icon: <Camera className="h-4 w-4" />,
      description: 'Required for QR code scanning',
      required: true,
    },
    {
      name: 'geolocation',
      status: 'unknown',
      icon: <MapPin className="h-4 w-4" />,
      description: 'Find businesses near you',
      required: false,
    },
    {
      name: 'notifications',
      status: 'unknown',
      icon: <Bell className="h-4 w-4" />,
      description: 'Get updates about rewards and events',
      required: false,
    },
  ]);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const updatedPermissions = await Promise.all(
      permissions.map(async (permission) => {
        let status: Permission['status'] = 'unknown';
        
        try {
          if (permission.name === 'camera') {
            const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
            status = result.state as Permission['status'];
          } else if (permission.name === 'geolocation') {
            const result = await navigator.permissions.query({ name: 'geolocation' });
            status = result.state as Permission['status'];
          } else if (permission.name === 'notifications') {
            if ('Notification' in window) {
              status = Notification.permission as Permission['status'];
            }
          }
        } catch (error) {
          console.warn(`Could not check ${permission.name} permission:`, error);
        }

        return { ...permission, status };
      })
    );

    setPermissions(updatedPermissions);
  };

  const requestPermission = async (permissionName: string) => {
    try {
      if (permissionName === 'camera') {
        await navigator.mediaDevices.getUserMedia({ video: true });
      } else if (permissionName === 'geolocation') {
        navigator.geolocation.getCurrentPosition(() => {}, () => {});
      } else if (permissionName === 'notifications') {
        await Notification.requestPermission();
      }
      
      // Recheck permissions after request
      setTimeout(checkPermissions, 1000);
    } catch (error) {
      console.error(`Error requesting ${permissionName} permission:`, error);
    }
  };

  const getStatusIcon = (status: Permission['status']) => {
    switch (status) {
      case 'granted':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'denied':
        return <X className="h-4 w-4 text-red-600" />;
      case 'prompt':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Permission['status']) => {
    const variants = {
      granted: 'bg-green-100 text-green-800',
      denied: 'bg-red-100 text-red-800',
      prompt: 'bg-yellow-100 text-yellow-800',
      unknown: 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge className={variants[status]}>
        {status === 'granted' ? 'Allowed' : status === 'denied' ? 'Blocked' : 'Pending'}
      </Badge>
    );
  };

  const criticalPermissionsDenied = permissions.some(
    (p) => p.required && p.status === 'denied'
  );

  if (!isCapacitor) {
    return null; // Only show for mobile app
  }

  return (
    <Card className="mx-4 my-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          App Permissions
        </CardTitle>
        <CardDescription>
          Ensure all permissions are granted for the best experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {permissions.map((permission) => (
            <div
              key={permission.name}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {permission.icon}
                <div>
                  <div className="font-medium capitalize">{permission.name}</div>
                  <div className="text-sm text-gray-600">{permission.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(permission.status)}
                {getStatusBadge(permission.status)}
                {permission.status === 'prompt' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => requestPermission(permission.name)}
                  >
                    Allow
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {criticalPermissionsDenied && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                Some required permissions are blocked. Please enable them in your device settings to use all features.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsChecker;
