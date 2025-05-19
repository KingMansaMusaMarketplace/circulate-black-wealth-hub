
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SettingsState {
  autoApproveThreshold: number;
  requireOwnershipProof: boolean;
  requireAddressProof: boolean;
  requireRegistrationProof: boolean;
  minOwnershipPercentage: number;
  notifyAdminOnNewRequest: boolean;
  notifyBusinessOnStatusChange: boolean;
}

const VerificationSettings: React.FC = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsState>({
    autoApproveThreshold: 0, // 0 means disabled
    requireOwnershipProof: true,
    requireAddressProof: true,
    requireRegistrationProof: true,
    minOwnershipPercentage: 51,
    notifyAdminOnNewRequest: true,
    notifyBusinessOnStatusChange: true,
  });

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your verification settings have been updated",
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verification Process Settings</CardTitle>
          <CardDescription>Configure how business verification works on the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              These settings control how business verification requests are processed.
              Changes will apply to new verification requests only.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Required Documentation</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="requireRegistrationProof" 
                  checked={settings.requireRegistrationProof}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, requireRegistrationProof: !!checked})
                  }
                />
                <Label htmlFor="requireRegistrationProof">
                  Require Business Registration Documentation
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="requireOwnershipProof" 
                  checked={settings.requireOwnershipProof}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, requireOwnershipProof: !!checked})
                  }
                />
                <Label htmlFor="requireOwnershipProof">
                  Require Ownership Proof Documentation
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="requireAddressProof" 
                  checked={settings.requireAddressProof}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, requireAddressProof: !!checked})
                  }
                />
                <Label htmlFor="requireAddressProof">
                  Require Address Verification Documentation
                </Label>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Verification Thresholds</h3>
            
            <div className="space-y-2">
              <Label htmlFor="minOwnershipPercentage">
                Minimum Ownership Percentage Required: {settings.minOwnershipPercentage}%
              </Label>
              <Slider 
                id="minOwnershipPercentage"
                min={1} 
                max={100} 
                step={1}
                value={[settings.minOwnershipPercentage]}
                onValueChange={(value) => 
                  setSettings({...settings, minOwnershipPercentage: value[0]})
                }
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Businesses must have at least this percentage of Black ownership to be verified.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="autoApproveThreshold">
                Auto-Approve Ownership Threshold: {settings.autoApproveThreshold > 0 ? `${settings.autoApproveThreshold}%` : "Disabled"}
              </Label>
              <Slider 
                id="autoApproveThreshold"
                min={0} 
                max={100} 
                step={1}
                value={[settings.autoApproveThreshold]}
                onValueChange={(value) => 
                  setSettings({...settings, autoApproveThreshold: value[0]})
                }
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Automatically approve businesses with ownership percentage above this threshold. Set to 0 to disable.
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notifyAdminOnNewRequest" 
                  checked={settings.notifyAdminOnNewRequest}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, notifyAdminOnNewRequest: !!checked})
                  }
                />
                <Label htmlFor="notifyAdminOnNewRequest">
                  Notify administrators on new verification requests
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notifyBusinessOnStatusChange" 
                  checked={settings.notifyBusinessOnStatusChange}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, notifyBusinessOnStatusChange: !!checked})
                  }
                />
                <Label htmlFor="notifyBusinessOnStatusChange">
                  Notify businesses when verification status changes
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Verification Team Management</CardTitle>
          <CardDescription>Configure who can approve or reject business verifications</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This feature will be available in a future update. Currently, all users with admin privileges can manage verifications.
          </p>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default VerificationSettings;
