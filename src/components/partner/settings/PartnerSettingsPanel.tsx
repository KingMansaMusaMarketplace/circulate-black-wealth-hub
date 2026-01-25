import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Bell, Eye, Cookie } from 'lucide-react';

interface PartnerSettings {
  email_notifications_enabled: boolean;
  leaderboard_opt_in: boolean;
  cookie_duration_days: number;
}

interface PartnerSettingsPanelProps {
  settings: PartnerSettings;
  onUpdate: (field: keyof PartnerSettings, value: boolean | number) => void;
  loading?: boolean;
}

const PartnerSettingsPanel: React.FC<PartnerSettingsPanelProps> = ({
  settings,
  onUpdate,
  loading = false,
}) => {
  const cookieDurationOptions = [
    { value: 7, label: '7 days' },
    { value: 14, label: '14 days' },
    { value: 30, label: '30 days (recommended)' },
    { value: 60, label: '60 days' },
    { value: 90, label: '90 days' },
  ];

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-amber-400" />
          Partner Settings
        </CardTitle>
        <CardDescription className="text-slate-400">
          Configure your partner account preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-slate-400" />
            <div>
              <Label htmlFor="email-notifications" className="text-white">
                Email Notifications
              </Label>
              <p className="text-xs text-slate-500">
                Receive alerts for new referrals and earnings
              </p>
            </div>
          </div>
          <Switch
            id="email-notifications"
            checked={settings.email_notifications_enabled}
            onCheckedChange={(checked) => onUpdate('email_notifications_enabled', checked)}
            disabled={loading}
          />
        </div>

        {/* Leaderboard Visibility */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-slate-400" />
            <div>
              <Label htmlFor="leaderboard-opt-in" className="text-white">
                Show on Leaderboard
              </Label>
              <p className="text-xs text-slate-500">
                Display your directory on the public partner leaderboard
              </p>
            </div>
          </div>
          <Switch
            id="leaderboard-opt-in"
            checked={settings.leaderboard_opt_in}
            onCheckedChange={(checked) => onUpdate('leaderboard_opt_in', checked)}
            disabled={loading}
          />
        </div>

        {/* Cookie Duration */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cookie className="h-5 w-5 text-slate-400" />
            <div>
              <Label htmlFor="cookie-duration" className="text-white">
                Attribution Window
              </Label>
              <p className="text-xs text-slate-500">
                How long referral cookies are valid
              </p>
            </div>
          </div>
          <Select
            value={String(settings.cookie_duration_days)}
            onValueChange={(value) => onUpdate('cookie_duration_days', parseInt(value))}
            disabled={loading}
          >
            <SelectTrigger className="w-40 bg-slate-900/60 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {cookieDurationOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={String(option.value)}
                  className="text-white hover:bg-slate-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerSettingsPanel;
