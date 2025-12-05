import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Wrench, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const MaintenanceModeControl: React.FC = () => {
  const queryClient = useQueryClient();
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [message, setMessage] = useState('We are performing scheduled maintenance. Please check back soon.');
  const [scheduledEnd, setScheduledEnd] = useState('');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['system-settings-maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .in('setting_key', ['maintenance_mode', 'maintenance_message', 'maintenance_scheduled_end']);
      
      if (error) throw error;
      
      const settingsMap: Record<string, any> = {};
      data?.forEach(s => {
        try {
          settingsMap[s.setting_key] = JSON.parse(s.setting_value);
        } catch {
          settingsMap[s.setting_key] = s.setting_value;
        }
      });
      
      return settingsMap;
    }
  });

  React.useEffect(() => {
    if (settings) {
      setMaintenanceEnabled(settings.maintenance_mode === true || settings.maintenance_mode === 'true');
      setMessage(settings.maintenance_message || 'We are performing scheduled maintenance. Please check back soon.');
      setScheduledEnd(settings.maintenance_scheduled_end || '');
    }
  }, [settings]);

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: key,
          setting_value: JSON.stringify(value),
          setting_type: typeof value === 'boolean' ? 'boolean' : 'string',
          category: 'system',
          description: key === 'maintenance_mode' ? 'Enable maintenance mode' :
                       key === 'maintenance_message' ? 'Message shown during maintenance' :
                       'Scheduled end time of maintenance'
        }, { onConflict: 'setting_key' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings-maintenance'] });
    }
  });

  const toggleMaintenance = async () => {
    const newValue = !maintenanceEnabled;
    setMaintenanceEnabled(newValue);
    
    await updateSettingMutation.mutateAsync({ key: 'maintenance_mode', value: newValue });
    
    if (newValue) {
      await updateSettingMutation.mutateAsync({ key: 'maintenance_message', value: message });
      if (scheduledEnd) {
        await updateSettingMutation.mutateAsync({ key: 'maintenance_scheduled_end', value: scheduledEnd });
      }
      toast.success('Maintenance mode enabled');
    } else {
      toast.success('Maintenance mode disabled');
    }
  };

  const saveSettings = async () => {
    await updateSettingMutation.mutateAsync({ key: 'maintenance_message', value: message });
    if (scheduledEnd) {
      await updateSettingMutation.mutateAsync({ key: 'maintenance_scheduled_end', value: scheduledEnd });
    }
    toast.success('Maintenance settings saved');
  };

  return (
    <Card className={`border-2 ${maintenanceEnabled ? 'bg-red-500/10 border-red-500/50' : 'bg-white/5 border-white/10'}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wrench className={`h-5 w-5 ${maintenanceEnabled ? 'text-red-400' : 'text-mansagold'}`} />
          Maintenance Mode
          {maintenanceEnabled && (
            <Badge className="bg-red-500 text-white ml-2">ACTIVE</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Alert */}
        {maintenanceEnabled && (
          <div className="p-4 bg-red-500/20 rounded-lg border border-red-500/30 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">Maintenance Mode is Active</p>
              <p className="text-white/70 text-sm mt-1">
                Users (except admins) will see the maintenance message instead of the app.
              </p>
            </div>
          </div>
        )}

        {/* Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
          <div>
            <p className="text-white font-medium">Enable Maintenance Mode</p>
            <p className="text-white/60 text-sm">Show maintenance page to all non-admin users</p>
          </div>
          <Switch
            checked={maintenanceEnabled}
            onCheckedChange={toggleMaintenance}
            className="data-[state=checked]:bg-red-500"
          />
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div>
            <Label className="text-white/80">Maintenance Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="We are performing scheduled maintenance..."
              className="mt-1 bg-white/5 border-white/20 text-white min-h-[100px]"
            />
          </div>

          <div>
            <Label className="text-white/80">Scheduled End Time (optional)</Label>
            <Input
              type="datetime-local"
              value={scheduledEnd}
              onChange={(e) => setScheduledEnd(e.target.value)}
              className="mt-1 bg-white/5 border-white/20 text-white"
            />
            <p className="text-white/40 text-xs mt-1">
              Users will see a countdown to this time
            </p>
          </div>

          {!maintenanceEnabled && (
            <Button
              onClick={saveSettings}
              className="bg-mansagold hover:bg-mansagold/90 text-mansablue-dark"
            >
              Save Settings
            </Button>
          )}
        </div>

        {/* Preview */}
        <div className="pt-4 border-t border-white/10">
          <Label className="text-white/80 mb-3 block">Preview</Label>
          <div className="p-6 bg-mansablue-dark rounded-lg border border-white/20 text-center">
            <Wrench className="h-12 w-12 text-mansagold mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Under Maintenance</h3>
            <p className="text-white/70">{message}</p>
            {scheduledEnd && (
              <div className="mt-4 flex items-center justify-center gap-2 text-mansagold">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  Estimated completion: {format(new Date(scheduledEnd), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setMessage('We are performing scheduled maintenance. The app will be back online shortly.');
              setScheduledEnd('');
            }}
            className="border-white/20 text-white/80"
          >
            Quick Maintenance
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setMessage('We are deploying new features and improvements. Thank you for your patience!');
              const now = new Date();
              now.setHours(now.getHours() + 1);
              setScheduledEnd(format(now, "yyyy-MM-dd'T'HH:mm"));
            }}
            className="border-white/20 text-white/80"
          >
            Deployment (1 hour)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceModeControl;
