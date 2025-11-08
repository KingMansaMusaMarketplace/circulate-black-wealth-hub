import React, { useEffect, useState } from 'react';
import { 
  getAdminNotificationPreferences, 
  updateAdminNotificationPreferences,
  AdminNotificationPreferences 
} from '@/lib/api/admin-notification-preferences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Loader2, Bell, Mail, Clock, TrendingUp, DollarSign, Target, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NotificationPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<AdminNotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [additionalEmails, setAdditionalEmails] = useState<string>('');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    const prefs = await getAdminNotificationPreferences();
    if (prefs) {
      setPreferences({
        ...prefs,
        enable_batching: prefs.enable_batching ?? true,
        batch_window_minutes: prefs.batch_window_minutes ?? 5,
        min_batch_size: prefs.min_batch_size ?? 2,
      });
      setAdditionalEmails(prefs.send_to_multiple_emails?.join(', ') || '');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!preferences) return;

    setSaving(true);
    
    // Parse additional emails
    const emailArray = additionalEmails
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    const updates = {
      business_verification_enabled: preferences.business_verification_enabled,
      agent_milestone_enabled: preferences.agent_milestone_enabled,
      milestone_referrals_enabled: preferences.milestone_referrals_enabled,
      milestone_earnings_enabled: preferences.milestone_earnings_enabled,
      milestone_conversion_enabled: preferences.milestone_conversion_enabled,
      min_referral_milestone: preferences.min_referral_milestone,
      min_earnings_milestone: preferences.min_earnings_milestone,
      min_conversion_milestone: preferences.min_conversion_milestone,
      send_immediate: preferences.send_immediate,
      send_daily_digest: preferences.send_daily_digest,
      send_weekly_digest: preferences.send_weekly_digest,
      digest_time: preferences.digest_time,
      notification_email: preferences.notification_email,
      send_to_multiple_emails: emailArray.length > 0 ? emailArray : null,
      enable_batching: preferences.enable_batching ?? true,
      batch_window_minutes: preferences.batch_window_minutes ?? 5,
      min_batch_size: preferences.min_batch_size ?? 2,
    };

    const success = await updateAdminNotificationPreferences(updates);
    if (success) {
      await loadPreferences();
    }
    setSaving(false);
  };

  const handlePreferenceChange = <K extends keyof AdminNotificationPreferences>(
    key: K,
    value: AdminNotificationPreferences[K]
  ) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load notification preferences
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-mansablue flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notification Preferences
          </h2>
          <p className="text-muted-foreground">Configure which events trigger email alerts</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Settings
            </CardTitle>
            <CardDescription>Configure where notifications are sent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notification_email">Primary Email</Label>
              <Input
                id="notification_email"
                type="email"
                value={preferences.notification_email}
                onChange={(e) => handlePreferenceChange('notification_email', e.target.value)}
                placeholder="admin@example.com"
              />
              <p className="text-xs text-muted-foreground">
                Main email address for receiving notifications
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional_emails">Additional Emails (Optional)</Label>
              <Input
                id="additional_emails"
                type="text"
                value={additionalEmails}
                onChange={(e) => setAdditionalEmails(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated list of additional email addresses
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Frequency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Notification Frequency
            </CardTitle>
            <CardDescription>Choose when to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Notification Batching</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Group similar notifications to reduce email volume
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable_batching">Enable Smart Batching</Label>
                    <p className="text-sm text-muted-foreground">
                      Group similar notifications within a time window
                    </p>
                  </div>
                  <Switch
                    id="enable_batching"
                    checked={preferences.enable_batching ?? true}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('enable_batching', checked)
                    }
                  />
                </div>

                {(preferences.enable_batching ?? true) && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="batch_window_minutes">
                        Batch Window: {preferences.batch_window_minutes ?? 5} minutes
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications within this time window will be grouped together
                      </p>
                      <Slider
                        id="batch_window_minutes"
                        min={1}
                        max={30}
                        step={1}
                        value={[preferences.batch_window_minutes ?? 5]}
                        onValueChange={(value) =>
                          handlePreferenceChange('batch_window_minutes', value[0])
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="min_batch_size">
                        Minimum Batch Size: {preferences.min_batch_size ?? 2} events
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Only batch if this many notifications occur
                      </p>
                      <Slider
                        id="min_batch_size"
                        min={2}
                        max={10}
                        step={1}
                        value={[preferences.min_batch_size ?? 2]}
                        onValueChange={(value) =>
                          handlePreferenceChange('min_batch_size', value[0])
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Immediate Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive emails as events happen
                </p>
              </div>
              <Switch
                checked={preferences.send_immediate}
                onCheckedChange={(checked) => handlePreferenceChange('send_immediate', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Digest</Label>
                <p className="text-xs text-muted-foreground">
                  Summary of all events once per day
                </p>
              </div>
              <Switch
                checked={preferences.send_daily_digest}
                onCheckedChange={(checked) => handlePreferenceChange('send_daily_digest', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Digest</Label>
                <p className="text-xs text-muted-foreground">
                  Summary of all events once per week
                </p>
              </div>
              <Switch
                checked={preferences.send_weekly_digest}
                onCheckedChange={(checked) => handlePreferenceChange('send_weekly_digest', checked)}
              />
            </div>

            {(preferences.send_daily_digest || preferences.send_weekly_digest) && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="digest_time">Digest Time</Label>
                <Input
                  id="digest_time"
                  type="time"
                  value={preferences.digest_time}
                  onChange={(e) => handlePreferenceChange('digest_time', e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Event Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Event Notifications</CardTitle>
          <CardDescription>Select which events should trigger notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Verifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Business Verifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when businesses submit verification documents
                </p>
              </div>
              <Switch
                checked={preferences.business_verification_enabled}
                onCheckedChange={(checked) => handlePreferenceChange('business_verification_enabled', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Agent Milestones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Sales Agent Milestones</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when agents reach performance milestones
                </p>
              </div>
              <Switch
                checked={preferences.agent_milestone_enabled}
                onCheckedChange={(checked) => handlePreferenceChange('agent_milestone_enabled', checked)}
              />
            </div>

            {preferences.agent_milestone_enabled && (
              <div className="pl-6 space-y-4 border-l-2 border-gray-200">
                {/* Referral Milestones */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Referral Milestones
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when agents reach referral counts
                      </p>
                    </div>
                    <Switch
                      checked={preferences.milestone_referrals_enabled}
                      onCheckedChange={(checked) => handlePreferenceChange('milestone_referrals_enabled', checked)}
                    />
                  </div>
                  {preferences.milestone_referrals_enabled && (
                    <div className="space-y-2">
                      <Label htmlFor="min_referral_milestone" className="text-xs">
                        Minimum Referrals to Notify
                      </Label>
                      <Input
                        id="min_referral_milestone"
                        type="number"
                        min="1"
                        value={preferences.min_referral_milestone}
                        onChange={(e) => handlePreferenceChange('min_referral_milestone', parseInt(e.target.value) || 1)}
                        className="w-32"
                      />
                      <p className="text-xs text-muted-foreground">
                        Only notify for milestones at or above this count
                      </p>
                    </div>
                  )}
                </div>

                {/* Earnings Milestones */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Earnings Milestones
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when agents reach earnings amounts
                      </p>
                    </div>
                    <Switch
                      checked={preferences.milestone_earnings_enabled}
                      onCheckedChange={(checked) => handlePreferenceChange('milestone_earnings_enabled', checked)}
                    />
                  </div>
                  {preferences.milestone_earnings_enabled && (
                    <div className="space-y-2">
                      <Label htmlFor="min_earnings_milestone" className="text-xs">
                        Minimum Earnings to Notify ($)
                      </Label>
                      <Input
                        id="min_earnings_milestone"
                        type="number"
                        min="0"
                        step="100"
                        value={preferences.min_earnings_milestone}
                        onChange={(e) => handlePreferenceChange('min_earnings_milestone', parseFloat(e.target.value) || 100)}
                        className="w-32"
                      />
                      <p className="text-xs text-muted-foreground">
                        Only notify for milestones at or above this amount
                      </p>
                    </div>
                  )}
                </div>

                {/* Conversion Milestones */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Conversion Rate Milestones
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when agents reach conversion rates
                      </p>
                    </div>
                    <Switch
                      checked={preferences.milestone_conversion_enabled}
                      onCheckedChange={(checked) => handlePreferenceChange('milestone_conversion_enabled', checked)}
                    />
                  </div>
                  {preferences.milestone_conversion_enabled && (
                    <div className="space-y-2">
                      <Label htmlFor="min_conversion_milestone" className="text-xs">
                        Minimum Conversion Rate to Notify (%)
                      </Label>
                      <Input
                        id="min_conversion_milestone"
                        type="number"
                        min="0"
                        max="100"
                        step="5"
                        value={preferences.min_conversion_milestone}
                        onChange={(e) => handlePreferenceChange('min_conversion_milestone', parseFloat(e.target.value) || 50)}
                        className="w-32"
                      />
                      <p className="text-xs text-muted-foreground">
                        Only notify for milestones at or above this percentage
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Badge */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Bell className="h-8 w-8 text-blue-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Current Configuration</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.send_immediate && (
                  <Badge variant="default">Immediate Alerts</Badge>
                )}
                {preferences.send_daily_digest && (
                  <Badge variant="secondary">Daily Digest</Badge>
                )}
                {preferences.send_weekly_digest && (
                  <Badge variant="secondary">Weekly Digest</Badge>
                )}
                {preferences.business_verification_enabled && (
                  <Badge variant="outline">Business Verifications</Badge>
                )}
                {preferences.agent_milestone_enabled && (
                  <Badge variant="outline">Agent Milestones</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPreferences;
