import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Megaphone, Plus, Pencil, Trash2, Eye, EyeOff, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  message: string;
  announcement_type: string;
  target_audience: string;
  priority: number;
  is_active: boolean;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
}

const typeConfig: Record<string, { icon: React.ElementType; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  info: { icon: Info, variant: 'secondary' },
  warning: { icon: AlertTriangle, variant: 'outline' },
  alert: { icon: AlertCircle, variant: 'destructive' },
  success: { icon: CheckCircle, variant: 'default' },
};

const BroadcastAnnouncements: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [announcementType, setAnnouncementType] = useState('info');
  const [targetAudience, setTargetAudience] = useState('all');
  const [priority, setPriority] = useState(0);
  const [startsAt, setStartsAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('broadcast_announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setAnnouncementType('info');
    setTargetAudience('all');
    setPriority(0);
    setStartsAt('');
    setExpiresAt('');
    setEditingAnnouncement(null);
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setTitle(announcement.title);
    setMessage(announcement.message);
    setAnnouncementType(announcement.announcement_type);
    setTargetAudience(announcement.target_audience);
    setPriority(announcement.priority);
    setStartsAt(announcement.starts_at.slice(0, 16));
    setExpiresAt(announcement.expires_at?.slice(0, 16) || '');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title || !message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const announcementData = {
        title,
        message,
        announcement_type: announcementType,
        target_audience: targetAudience,
        priority,
        starts_at: startsAt || new Date().toISOString(),
        expires_at: expiresAt || null,
        created_by: user?.id,
      };

      if (editingAnnouncement) {
        const { error } = await supabase
          .from('broadcast_announcements')
          .update(announcementData)
          .eq('id', editingAnnouncement.id);
        if (error) throw error;
        toast.success('Announcement updated');
      } else {
        const { error } = await supabase
          .from('broadcast_announcements')
          .insert(announcementData);
        if (error) throw error;
        toast.success('Announcement created');
      }

      setDialogOpen(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error('Failed to save announcement');
    }
  };

  const toggleActive = async (announcement: Announcement) => {
    try {
      const { error } = await supabase
        .from('broadcast_announcements')
        .update({ is_active: !announcement.is_active })
        .eq('id', announcement.id);

      if (error) throw error;
      toast.success(`Announcement ${announcement.is_active ? 'deactivated' : 'activated'}`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement:', error);
      toast.error('Failed to update announcement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const { error } = await supabase
        .from('broadcast_announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Announcement deleted');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };

  const getTypeConfig = (type: string) => {
    return typeConfig[type] || typeConfig.info;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Broadcast Announcements
              </CardTitle>
              <CardDescription>
                Create and manage platform-wide announcements
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAnnouncement ? 'Update the announcement details' : 'Create a new broadcast announcement'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder="Announcement title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      placeholder="Announcement message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <Select value={announcementType} onValueChange={setAnnouncementType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="alert">Alert</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Target Audience</label>
                      <Select value={targetAudience} onValueChange={setTargetAudience}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="customers">Customers</SelectItem>
                          <SelectItem value="businesses">Businesses</SelectItem>
                          <SelectItem value="agents">Sales Agents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority (0-10)</label>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={priority}
                      onChange={(e) => setPriority(Number(e.target.value))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Starts At</label>
                      <Input
                        type="datetime-local"
                        value={startsAt}
                        onChange={(e) => setStartsAt(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expires At (optional)</label>
                      <Input
                        type="datetime-local"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    {editingAnnouncement ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No announcements yet. Create your first announcement.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => {
                  const config = getTypeConfig(announcement.announcement_type);
                  const Icon = config.icon;
                  const isExpired = announcement.expires_at && new Date(announcement.expires_at) < new Date();
                  const isScheduled = new Date(announcement.starts_at) > new Date();

                  return (
                    <TableRow key={announcement.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{announcement.title}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-xs">
                              {announcement.message}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>
                          {announcement.announcement_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{announcement.target_audience}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={announcement.is_active}
                            onCheckedChange={() => toggleActive(announcement)}
                          />
                          {isExpired && <Badge variant="destructive">Expired</Badge>}
                          {isScheduled && <Badge variant="secondary">Scheduled</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>From: {format(new Date(announcement.starts_at), 'MMM d, yyyy HH:mm')}</div>
                          {announcement.expires_at && (
                            <div>To: {format(new Date(announcement.expires_at), 'MMM d, yyyy HH:mm')}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(announcement)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(announcement.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BroadcastAnnouncements;
