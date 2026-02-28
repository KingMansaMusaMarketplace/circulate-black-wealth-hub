import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  MessageSquare, Plus, Edit, Trash2, Clock, Send, 
  Home, Key, MapPin, LogOut, Sparkles, Mail
} from 'lucide-react';

const TRIGGER_TYPES = [
  { value: 'booking_confirmed', label: 'Booking Confirmed', desc: 'Sent immediately when booking is confirmed' },
  { value: 'before_checkin', label: 'Before Check-in', desc: 'Sent X hours before check-in' },
  { value: 'at_checkin', label: 'At Check-in', desc: 'Sent at check-in time' },
  { value: 'during_stay', label: 'During Stay', desc: 'Sent X hours after check-in' },
  { value: 'before_checkout', label: 'Before Check-out', desc: 'Sent X hours before check-out' },
  { value: 'after_checkout', label: 'After Check-out', desc: 'Sent after guest checks out' },
  { value: 'manual', label: 'Manual Only', desc: 'Only sent when you trigger it' },
];

const CATEGORIES = [
  { value: 'welcome', label: 'Welcome', icon: Sparkles },
  { value: 'check_in', label: 'Check-in Instructions', icon: Key },
  { value: 'house_rules', label: 'House Rules', icon: Home },
  { value: 'local_recommendations', label: 'Local Recommendations', icon: MapPin },
  { value: 'checkout', label: 'Check-out', icon: LogOut },
  { value: 'general', label: 'General', icon: Mail },
];

interface MessageTemplate {
  id: string;
  name: string;
  subject: string | null;
  body: string;
  trigger_type: string;
  trigger_offset_hours: number;
  is_active: boolean;
  category: string;
  property_id: string | null;
  created_at: string;
}

interface Property {
  id: string;
  title: string;
}

const AutomatedMessaging: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    subject: '',
    body: '',
    trigger_type: 'before_checkin',
    trigger_offset_hours: 24,
    category: 'check_in',
    property_id: 'all',
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      const [templatesRes, propertiesRes] = await Promise.all([
        supabase
          .from('host_message_templates')
          .select('*')
          .eq('host_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('vacation_properties')
          .select('id, title')
          .eq('host_id', user.id),
      ]);

      if (templatesRes.error) throw templatesRes.error;
      if (propertiesRes.error) throw propertiesRes.error;

      setTemplates(templatesRes.data || []);
      setProperties(propertiesRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const openEditor = (template?: MessageTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setForm({
        name: template.name,
        subject: template.subject || '',
        body: template.body,
        trigger_type: template.trigger_type,
        trigger_offset_hours: template.trigger_offset_hours,
        category: template.category,
        property_id: template.property_id || 'all',
        is_active: template.is_active,
      });
    } else {
      setEditingTemplate(null);
      setForm({
        name: '',
        subject: '',
        body: '',
        trigger_type: 'before_checkin',
        trigger_offset_hours: 24,
        category: 'check_in',
        property_id: 'all',
        is_active: true,
      });
    }
    setShowEditor(true);
  };

  const saveTemplate = async () => {
    if (!user || !form.name || !form.body) {
      toast.error('Name and message body are required');
      return;
    }

    try {
      const data = {
        host_id: user.id,
        name: form.name,
        subject: form.subject || null,
        body: form.body,
        trigger_type: form.trigger_type,
        trigger_offset_hours: form.trigger_offset_hours,
        category: form.category,
        property_id: form.property_id === 'all' ? null : form.property_id,
        is_active: form.is_active,
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('host_message_templates')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', editingTemplate.id);
        if (error) throw error;
        toast.success('Template updated');
      } else {
        const { error } = await supabase
          .from('host_message_templates')
          .insert(data);
        if (error) throw error;
        toast.success('Template created');
      }

      setShowEditor(false);
      loadData();
    } catch (err) {
      console.error('Error saving template:', err);
      toast.error('Failed to save template');
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('host_message_templates')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast.success('Template deleted');
    } catch (err) {
      toast.error('Failed to delete template');
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('host_message_templates')
        .update({ is_active: !current })
        .eq('id', id);
      if (error) throw error;
      setTemplates(prev => prev.map(t => t.id === id ? { ...t, is_active: !current } : t));
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const getTriggerLabel = (type: string) => TRIGGER_TYPES.find(t => t.value === type)?.label || type;
  const getCategoryInfo = (cat: string) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[5];

  const PRESETS = [
    {
      name: 'Check-in Instructions',
      category: 'check_in',
      trigger_type: 'before_checkin',
      trigger_offset_hours: 24,
      subject: 'Your check-in details',
      body: `Hi {{guest_name}}! 👋\n\nWe're excited to welcome you to {{property_name}} tomorrow!\n\n🔑 CHECK-IN DETAILS:\n• Check-in time: {{check_in_time}}\n• Address: {{property_address}}\n• Lockbox code: [YOUR CODE]\n\n📶 WiFi: [NETWORK] / Password: [PASSWORD]\n\n🅿️ Parking: [INSTRUCTIONS]\n\nFeel free to message me if you need anything!\n\nWarm regards,\nYour Host`,
    },
    {
      name: 'House Rules Reminder',
      category: 'house_rules',
      trigger_type: 'at_checkin',
      trigger_offset_hours: 0,
      subject: 'Quick house rules reminder',
      body: `Welcome to {{property_name}}! 🏠\n\nA few quick reminders to help you have a great stay:\n\n• Quiet hours: 10 PM - 8 AM\n• No smoking inside\n• Please remove shoes at the door\n• Trash goes out on [DAY]\n• Thermostat: Please keep between 68-74°F\n\nEnjoy your stay! 🌟`,
    },
    {
      name: 'Local Recommendations',
      category: 'local_recommendations',
      trigger_type: 'during_stay',
      trigger_offset_hours: 4,
      subject: 'Local gems near you',
      body: `Hey {{guest_name}}! Hope you're settling in nicely! 🌟\n\nHere are some local favorites:\n\n🍽️ RESTAURANTS:\n• [Restaurant 1] - [Description]\n• [Restaurant 2] - [Description]\n\n☕ COFFEE:\n• [Cafe 1]\n\n🎭 THINGS TO DO:\n• [Activity 1]\n• [Activity 2]\n\n🛒 GROCERY:\n• [Nearest grocery store + directions]\n\nAsk me anything — I love sharing local tips!`,
    },
    {
      name: 'Check-out Reminder',
      category: 'checkout',
      trigger_type: 'before_checkout',
      trigger_offset_hours: 12,
      subject: 'Check-out reminder for tomorrow',
      body: `Hi {{guest_name}},\n\nJust a friendly reminder that check-out is tomorrow at {{check_out_time}}.\n\n✅ Before you go:\n• Strip the beds and leave linens in a pile\n• Start the dishwasher if there are dirty dishes\n• Take out the trash\n• Lock all doors and windows\n• Return keys to [LOCATION]\n\nThank you for staying with us! We'd love a review if you enjoyed your stay. 💛\n\nSafe travels!`,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-slate-800/50 border-white/10 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Automated Messaging</h2>
          <p className="text-sm text-white/50">Schedule messages to guests at key moments during their stay</p>
        </div>
        <Button onClick={() => openEditor()} className="bg-mansagold hover:bg-mansagold/90 text-black">
          <Plus className="w-4 h-4 mr-2" /> New Template
        </Button>
      </div>

      {/* Quick Start Presets */}
      {templates.length === 0 && (
        <Card className="bg-slate-800/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-mansagold" />
              Quick Start — Use a Preset
            </CardTitle>
            <CardDescription className="text-white/50">
              Start with a pre-built template and customize it for your property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRESETS.map((preset) => {
                const catInfo = getCategoryInfo(preset.category);
                const Icon = catInfo.icon;
                return (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setEditingTemplate(null);
                      setForm({
                        ...preset,
                        property_id: 'all',
                        is_active: true,
                      });
                      setShowEditor(true);
                    }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-md bg-mansagold/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-mansagold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{preset.name}</p>
                      <p className="text-xs text-white/40">{getTriggerLabel(preset.trigger_type)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates List */}
      {templates.length > 0 && (
        <div className="space-y-3">
          {templates.map((template) => {
            const catInfo = getCategoryInfo(template.category);
            const Icon = catInfo.icon;
            const propertyName = template.property_id
              ? properties.find(p => p.id === template.property_id)?.title || 'Unknown'
              : 'All Properties';

            return (
              <Card key={template.id} className="bg-slate-800/50 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-mansagold/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-mansagold" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white truncate">{template.name}</h3>
                          <Badge variant={template.is_active ? 'default' : 'secondary'} className="text-[10px] shrink-0">
                            {template.is_active ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getTriggerLabel(template.trigger_type)}
                            {template.trigger_offset_hours > 0 && ` (${template.trigger_offset_hours}h)`}
                          </span>
                          <span>•</span>
                          <span>{catInfo.label}</span>
                          <span>•</span>
                          <span>{propertyName}</span>
                        </div>
                        <p className="text-xs text-white/30 mt-1 line-clamp-1">{template.body}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Switch
                        checked={template.is_active}
                        onCheckedChange={() => toggleActive(template.id, template.is_active)}
                      />
                      <Button size="icon" variant="ghost" onClick={() => openEditor(template)} className="text-white/40 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteTemplate(template.id)} className="text-white/40 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add More Button */}
      {templates.length > 0 && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => openEditor()} className="border-white/10 text-white/60 hover:text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Template
          </Button>
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-white/10 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingTemplate ? 'Edit Template' : 'New Message Template'}
            </DialogTitle>
            <DialogDescription className="text-white/50">
              Create automated messages that are sent to guests at key moments
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-white/70">Template Name</Label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g., Check-in Instructions"
                className="bg-slate-800 border-white/10 text-white mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70">Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="bg-slate-800 border-white/10 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/70">Property</Label>
                <Select value={form.property_id} onValueChange={v => setForm(f => ({ ...f, property_id: v }))}>
                  <SelectTrigger className="bg-slate-800 border-white/10 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {properties.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70">Send When</Label>
                <Select value={form.trigger_type} onValueChange={v => setForm(f => ({ ...f, trigger_type: v }))}>
                  <SelectTrigger className="bg-slate-800 border-white/10 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIGGER_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {['before_checkin', 'during_stay', 'before_checkout'].includes(form.trigger_type) && (
                <div>
                  <Label className="text-white/70">Hours Offset</Label>
                  <Input
                    type="number"
                    min={1}
                    max={168}
                    value={form.trigger_offset_hours}
                    onChange={e => setForm(f => ({ ...f, trigger_offset_hours: parseInt(e.target.value) || 0 }))}
                    className="bg-slate-800 border-white/10 text-white mt-1"
                  />
                </div>
              )}
            </div>

            <div>
              <Label className="text-white/70">Subject (optional)</Label>
              <Input
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="e.g., Your check-in details for tomorrow"
                className="bg-slate-800 border-white/10 text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-white/70">Message Body</Label>
              <Textarea
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder="Write your message... Use {{guest_name}}, {{property_name}}, {{check_in_time}}, {{check_out_time}}"
                className="bg-slate-800 border-white/10 text-white mt-1 min-h-[200px]"
              />
              <p className="text-[11px] text-white/30 mt-1">
                Variables: {'{{guest_name}}'}, {'{{property_name}}'}, {'{{property_address}}'}, {'{{check_in_time}}'}, {'{{check_out_time}}'}
              </p>
            </div>

            <Separator className="bg-white/10" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
                <Label className="text-white/70 text-sm">Active</Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowEditor(false)} className="border-white/10 text-white/60">
                  Cancel
                </Button>
                <Button onClick={saveTemplate} className="bg-mansagold hover:bg-mansagold/90 text-black">
                  <Send className="w-4 h-4 mr-2" />
                  {editingTemplate ? 'Update' : 'Create'} Template
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutomatedMessaging;
