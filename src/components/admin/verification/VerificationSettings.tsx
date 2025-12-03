import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Save } from 'lucide-react';
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
    autoApproveThreshold: 0,
    requireOwnershipProof: true,
    requireAddressProof: true,
    requireRegistrationProof: true,
    minOwnershipPercentage: 51,
    notifyAdminOnNewRequest: true,
    notifyBusinessOnStatusChange: true,
  });

  const handleSaveSettings = () => {
    setIsSaving(true);
    
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
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Verification Process Settings</CardTitle>
          <CardDescription className="text-white/60">Configure how business verification works on the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-mansagold/20 border-mansagold/30">
            <AlertCircle className="h-4 w-4 text-mansagold" />
            <AlertTitle className="text-white">Information</AlertTitle>
            <AlertDescription className="text-white/70">
              These settings control how business verification requests are processed.
              Changes will apply to new verification requests only.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Required Documentation</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="requireRegistrationProof" 
                  checked={settings.requireRegistrationProof}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, requireRegistrationProof: !!checked})
                  }
                  className="border-white/30 data-[state=checked]:bg-mansagold data-[state=checked]:border-mansagold"
                />
                <Label htmlFor="requireRegistrationProof" className="text-white/80">
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
                  className="border-white/30 data-[state=checked]:bg-mansagold data-[state=checked]:border-mansagold"
                />
                <Label htmlFor="requireOwnershipProof" className="text-white/80">
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
                  className="border-white/30 data-[state=checked]:bg-mansagold data-[state=checked]:border-mansagold"
                />
                <Label htmlFor="requireAddressProof" className="text-white/80">
                  Require Address Verification Documentation
                </Label>
              </div>
            </div>
          </div>
          
          <Separator className="bg-white/20" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Verification Thresholds</h3>
            
            <div className="space-y-2">
              <Label htmlFor="minOwnershipPercentage" className="text-white/80">
                Minimum Ownership Percentage Required: <span className="text-mansagold font-bold">{settings.minOwnershipPercentage}%</span>
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
              <p className="text-sm text-white/60">
                Businesses must have at least this percentage of Black ownership to be verified.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="autoApproveThreshold" className="text-white/80">
                Auto-Approve Ownership Threshold: <span className="text-mansagold font-bold">{settings.autoApproveThreshold > 0 ? `${settings.autoApproveThreshold}%` : "Disabled"}</span>
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
              <p className="text-sm text-white/60">
                Automatically approve businesses with ownership percentage above this threshold. Set to 0 to disable.
              </p>
            </div>
          </div>
          
          <Separator className="bg-white/20" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notifyAdminOnNewRequest" 
                  checked={settings.notifyAdminOnNewRequest}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, notifyAdminOnNewRequest: !!checked})
                  }
                  className="border-white/30 data-[state=checked]:bg-mansagold data-[state=checked]:border-mansagold"
                />
                <Label htmlFor="notifyAdminOnNewRequest" className="text-white/80">
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
                  className="border-white/30 data-[state=checked]:bg-mansagold data-[state=checked]:border-mansagold"
                />
                <Label htmlFor="notifyBusinessOnStatusChange" className="text-white/80">
                  Notify businesses when verification status changes
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Verification Team Management</CardTitle>
          <CardDescription className="text-white/60">Configure who can approve or reject business verifications</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/60 mb-4">
            This feature will be available in a future update. Currently, all users with admin privileges can manage verifications.
          </p>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-mansagold hover:bg-mansagold/90 text-mansablue"
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
