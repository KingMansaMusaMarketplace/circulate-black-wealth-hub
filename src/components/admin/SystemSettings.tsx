import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Settings, DollarSign, Shield, FileText, Save, RefreshCw, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: unknown;
  setting_type: string;
  category: string;
  description: string | null;
  is_public: boolean;
  updated_at: string;
}

const categoryConfig: Record<string, { icon: React.ElementType; label: string }> = {
  financial: { icon: DollarSign, label: 'Financial' },
  system: { icon: Settings, label: 'System' },
  business: { icon: Shield, label: 'Business' },
  limits: { icon: AlertTriangle, label: 'Limits' },
  content: { icon: FileText, label: 'Content' },
};

const SystemSettings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [editedSettings, setEditedSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true })
        .order('setting_key', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
      
      // Initialize edited settings with current values
      const initial: Record<string, unknown> = {};
      (data || []).forEach(s => {
        initial[s.setting_key] = parseSettingValue(s.setting_value, s.setting_type);
      });
      setEditedSettings(initial);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const parseSettingValue = (value: unknown, type: string): unknown => {
    if (type === 'boolean') return value === true || value === 'true';
    if (type === 'number') return Number(value) || 0;
    if (type === 'json') return typeof value === 'object' ? JSON.stringify(value, null, 2) : value;
    return String(value).replace(/^"|"$/g, '');
  };

  const formatValueForSave = (value: unknown, type: string): unknown => {
    if (type === 'boolean') return value;
    if (type === 'number') return `"${value}"`;
    if (type === 'json') {
      try {
        return JSON.parse(value as string);
      } catch {
        return value;
      }
    }
    return `"${value}"`;
  };

  const handleValueChange = (key: string, value: unknown) => {
    setEditedSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (setting: SystemSetting) => {
    setSaving(true);
    try {
      const newValue = formatValueForSave(editedSettings[setting.setting_key], setting.setting_type);
      
      const { error } = await supabase
        .from('system_settings')
        .update({
          setting_value: newValue,
          updated_by: user?.id,
        })
        .eq('id', setting.id);

      if (error) throw error;
      toast.success(`${setting.setting_key} updated successfully`);
      fetchSettings();
    } catch (error) {
      console.error('Error saving setting:', error);
      toast.error('Failed to save setting');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      for (const setting of settings) {
        const newValue = formatValueForSave(editedSettings[setting.setting_key], setting.setting_type);
        await supabase
          .from('system_settings')
          .update({
            setting_value: newValue,
            updated_by: user?.id,
          })
          .eq('id', setting.id);
      }
      toast.success('All settings saved successfully');
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const categories = [...new Set(settings.map(s => s.category))];

  const renderSettingInput = (setting: SystemSetting) => {
    const value = editedSettings[setting.setting_key];
    const originalValue = parseSettingValue(setting.setting_value, setting.setting_type);
    const hasChanged = value !== originalValue;

    switch (setting.setting_type) {
      case 'boolean':
        return (
          <div className="flex items-center gap-4">
            <Switch
              checked={value as boolean}
              onCheckedChange={(checked) => handleValueChange(setting.setting_key, checked)}
            />
            <span className="text-sm text-muted-foreground">
              {value ? 'Enabled' : 'Disabled'}
            </span>
            {hasChanged && (
              <Button size="sm" onClick={() => handleSave(setting)} disabled={saving}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            )}
          </div>
        );
      case 'number':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={value as number}
              onChange={(e) => handleValueChange(setting.setting_key, Number(e.target.value))}
              className="w-32"
            />
            {hasChanged && (
              <Button size="sm" onClick={() => handleSave(setting)} disabled={saving}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            )}
          </div>
        );
      case 'json':
        return (
          <div className="space-y-2">
            <Textarea
              value={value as string}
              onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
              className="font-mono text-sm"
              rows={4}
            />
            {hasChanged && (
              <Button size="sm" onClick={() => handleSave(setting)} disabled={saving}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            )}
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <Input
              value={value as string}
              onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
              className="max-w-md"
            />
            {hasChanged && (
              <Button size="sm" onClick={() => handleSave(setting)} disabled={saving}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure platform-wide settings and preferences
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchSettings}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleSaveAll} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                Save All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <Tabs defaultValue={categories[0]} className="space-y-4">
              <TabsList>
                {categories.map(category => {
                  const config = categoryConfig[category] || { icon: Settings, label: category };
                  const Icon = config.icon;
                  return (
                    <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {config.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {categories.map(category => (
                <TabsContent key={category} value={category} className="space-y-4">
                  {settings
                    .filter(s => s.category === category)
                    .map(setting => (
                      <div
                        key={setting.id}
                        className="p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{setting.setting_key}</h4>
                              <Badge variant="outline" className="text-xs">
                                {setting.setting_type}
                              </Badge>
                              {setting.is_public && (
                                <Badge variant="secondary" className="text-xs">
                                  Public
                                </Badge>
                              )}
                            </div>
                            {setting.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {setting.description}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Updated {format(new Date(setting.updated_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        {renderSettingInput(setting)}
                      </div>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
