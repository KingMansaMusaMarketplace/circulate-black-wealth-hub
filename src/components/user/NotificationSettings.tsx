import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, Smartphone, Globe, Star, Gift, MapPin, Calendar, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface NotificationPrefs {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  new_businesses: boolean;
  special_offers: boolean;
  loyalty_updates: boolean;
  event_reminders: boolean;
  location_based: boolean;
  weekly_digest: boolean;
  reward_expiry: boolean;
  point_milestones: boolean;
}

const defaultPreferences: NotificationPrefs = {
  email_notifications: true,
  push_notifications: true,
  sms_notifications: false,
  marketing_emails: true,
  new_businesses: true,
  special_offers: true,
  loyalty_updates: true,
  event_reminders: true,
  location_based: false,
  weekly_digest: true,
  reward_expiry: true,
  point_milestones: true,
};

export const NotificationSettings: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPrefs>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from database on mount
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading preferences:', error);
        }

        if (data) {
          setPreferences({
            email_notifications: data.email_notifications ?? defaultPreferences.email_notifications,
            push_notifications: data.push_notifications ?? defaultPreferences.push_notifications,
            sms_notifications: data.sms_notifications ?? defaultPreferences.sms_notifications,
            marketing_emails: data.marketing_emails ?? defaultPreferences.marketing_emails,
            new_businesses: data.new_businesses ?? defaultPreferences.new_businesses,
            special_offers: data.special_offers ?? defaultPreferences.special_offers,
            loyalty_updates: data.loyalty_updates ?? defaultPreferences.loyalty_updates,
            event_reminders: data.event_reminders ?? defaultPreferences.event_reminders,
            location_based: data.location_based ?? defaultPreferences.location_based,
            weekly_digest: data.weekly_digest ?? defaultPreferences.weekly_digest,
            reward_expiry: data.reward_expiry ?? defaultPreferences.reward_expiry,
            point_milestones: data.point_milestones ?? defaultPreferences.point_milestones,
          });
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const updatePreference = (key: keyof NotificationPrefs, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const savePreferences = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save preferences',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);
    try {
      // Check if preferences exist
      const { data: existing } = await supabase
        .from('notification_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Update existing preferences
        const { error } = await supabase
          .from('notification_preferences')
          .update({
            ...preferences,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new preferences
        const { error } = await supabase
          .from('notification_preferences')
          .insert({
            user_id: user.id,
            ...preferences
          });

        if (error) throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Notification preferences updated successfully'
      });
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update notification preferences',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Communication Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Communication Channels</span>
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications from us.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
            </div>
            <Switch
              checked={preferences.email_notifications}
              onCheckedChange={(checked) => updatePreference('email_notifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-green-500" />
              <div>
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Browser and mobile app notifications</p>
              </div>
            </div>
            <Switch
              checked={preferences.push_notifications}
              onCheckedChange={(checked) => updatePreference('push_notifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-purple-500" />
              <div>
                <Label className="text-base">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Text message alerts for urgent updates</p>
              </div>
            </div>
            <Switch
              checked={preferences.sms_notifications}
              onCheckedChange={(checked) => updatePreference('sms_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Content Preferences</span>
          </CardTitle>
          <CardDescription>
            Select the types of content you'd like to receive notifications about.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <Label className="text-base">New Businesses</Label>
                <p className="text-sm text-muted-foreground">Get notified when new businesses join</p>
              </div>
            </div>
            <Switch
              checked={preferences.new_businesses}
              onCheckedChange={(checked) => updatePreference('new_businesses', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gift className="h-5 w-5 text-red-500" />
              <div>
                <Label className="text-base">Special Offers</Label>
                <p className="text-sm text-muted-foreground">Discounts, deals, and promotions</p>
              </div>
            </div>
            <Switch
              checked={preferences.special_offers}
              onCheckedChange={(checked) => updatePreference('special_offers', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-blue-500" />
              <div>
                <Label className="text-base">Loyalty Updates</Label>
                <p className="text-sm text-muted-foreground">Points balance and reward updates</p>
              </div>
            </div>
            <Switch
              checked={preferences.loyalty_updates}
              onCheckedChange={(checked) => updatePreference('loyalty_updates', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <Label className="text-base">Event Reminders</Label>
                <p className="text-sm text-muted-foreground">Community events and business activities</p>
              </div>
            </div>
            <Switch
              checked={preferences.event_reminders}
              onCheckedChange={(checked) => updatePreference('event_reminders', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-green-500" />
              <div>
                <Label className="text-base">Location-Based Offers</Label>
                <p className="text-sm text-muted-foreground">Deals from businesses near your location</p>
              </div>
            </div>
            <Switch
              checked={preferences.location_based}
              onCheckedChange={(checked) => updatePreference('location_based', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Digest & Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Digest & Summary</CardTitle>
          <CardDescription>
            Control how often you receive summary notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-indigo-500" />
              <div>
                <Label className="text-base">Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Summary of new businesses and offers</p>
              </div>
            </div>
            <Switch
              checked={preferences.weekly_digest}
              onCheckedChange={(checked) => updatePreference('weekly_digest', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gift className="h-5 w-5 text-orange-500" />
              <div>
                <Label className="text-base">Reward Expiry Alerts</Label>
                <p className="text-sm text-muted-foreground">Reminders when rewards are about to expire</p>
              </div>
            </div>
            <Switch
              checked={preferences.reward_expiry}
              onCheckedChange={(checked) => updatePreference('reward_expiry', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <Label className="text-base">Point Milestones</Label>
                <p className="text-sm text-muted-foreground">Celebrate when you reach point goals</p>
              </div>
            </div>
            <Switch
              checked={preferences.point_milestones}
              onCheckedChange={(checked) => updatePreference('point_milestones', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Marketing */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Communications</CardTitle>
          <CardDescription>
            Control marketing and promotional content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <Label className="text-base">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">General promotional content and newsletters</p>
              </div>
            </div>
            <Switch
              checked={preferences.marketing_emails}
              onCheckedChange={(checked) => updatePreference('marketing_emails', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Notification Settings'
          )}
        </Button>
      </div>
    </div>
  );
};
