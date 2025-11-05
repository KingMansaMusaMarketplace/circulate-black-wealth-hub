import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, TrendingUp, FileText, Award, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface NotificationPreferences {
  partnershipUpdates: boolean;
  impactReports: boolean;
  milestones: boolean;
  newBusinesses: boolean;
  monthlyDigest: boolean;
}

const SponsorNotificationSettings: React.FC = () => {
  const haptics = useHapticFeedback();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    partnershipUpdates: true,
    impactReports: true,
    milestones: true,
    newBusinesses: true,
    monthlyDigest: true,
  });

  const handleToggle = (key: keyof NotificationPreferences) => {
    haptics.light();
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    const newValue = !preferences[key];
    toast.success(
      `${key.replace(/([A-Z])/g, ' $1').trim()} notifications ${newValue ? 'enabled' : 'disabled'}`
    );
  };

  const notificationOptions = [
    {
      key: 'partnershipUpdates' as keyof NotificationPreferences,
      icon: Bell,
      title: 'Partnership Updates',
      description: 'Get notified about new partnerships and collaborations',
    },
    {
      key: 'impactReports' as keyof NotificationPreferences,
      icon: FileText,
      title: 'Monthly Impact Reports',
      description: 'Receive detailed reports on your sponsorship impact',
    },
    {
      key: 'milestones' as keyof NotificationPreferences,
      icon: Award,
      title: 'Milestone Achievements',
      description: 'Celebrate when your sponsorship reaches new milestones',
    },
    {
      key: 'newBusinesses' as keyof NotificationPreferences,
      icon: Users,
      title: 'New Business Alerts',
      description: 'Be the first to know when new businesses join',
    },
    {
      key: 'monthlyDigest' as keyof NotificationPreferences,
      icon: TrendingUp,
      title: 'Monthly Digest',
      description: 'Summary of your impact and platform updates',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose which notifications you'd like to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.key}
              className="flex items-start justify-between space-x-4 py-3 border-b last:border-b-0"
            >
              <div className="flex items-start space-x-3 flex-1">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor={option.key}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {option.title}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
              <Switch
                id={option.key}
                checked={preferences[option.key]}
                onCheckedChange={() => handleToggle(option.key)}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SponsorNotificationSettings;
