import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { VacationProperty } from '@/types/vacation-rental';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Users, Plus, Trash2, Mail, Home, ShieldCheck, MessageSquare, Calendar, DollarSign, X, Clock } from 'lucide-react';

interface CoHost {
  id: string;
  property_id: string;
  cohost_email: string;
  cohost_user_id: string | null;
  permissions: string[];
  status: string;
  invited_at: string;
  accepted_at: string | null;
}

interface CoHostManagerProps {
  properties: VacationProperty[];
}

const PERMISSION_OPTIONS = [
  { key: 'messaging', label: 'Guest Messaging', icon: MessageSquare, description: 'Reply to guest inquiries & messages' },
  { key: 'calendar', label: 'Calendar', icon: Calendar, description: 'Manage availability & block dates' },
  { key: 'bookings', label: 'Reservations', icon: Home, description: 'View and manage booking details' },
  { key: 'payouts', label: 'Payouts', icon: DollarSign, description: 'View payout history and earnings' },
];

const CoHostManager: React.FC<CoHostManagerProps> = ({ properties }) => {
  const { user } = useAuth();
  const [cohosts, setCohosts] = useState<CoHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['messaging', 'calendar']);
  const [inviting, setInviting] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);

  useEffect(() => {
    if (user) loadCohosts();
  }, [user]);

  const loadCohosts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_cohosts')
        .select('*')
        .eq('host_user_id', user.id)
        .order('invited_at', { ascending: false });

      if (error) throw error;
      setCohosts((data as CoHost[]) || []);
    } catch (err) {
      console.error('Error loading cohosts:', err);
      toast.error('Failed to load co-hosts');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (key: string) => {
    setSelectedPermissions(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  const handleInvite = async () => {
    if (!user || !inviteEmail.trim() || !selectedPropertyId) return;
    if (selectedPermissions.length === 0) {
      toast.error('Select at least one permission');
      return;
    }

    setInviting(true);
    try {
      // Generate secure invite token
      const tokenBytes = new Uint8Array(32);
      crypto.getRandomValues(tokenBytes);
      const inviteToken = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from('property_cohosts')
        .insert({
          property_id: selectedPropertyId,
          host_user_id: user.id,
          cohost_email: inviteEmail.trim().toLowerCase(),
          permissions: selectedPermissions,
          status: 'pending',
          invite_token: inviteToken,
          invite_expires_at: expiresAt,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('This person is already a co-host for this property');
        } else {
          throw error;
        }
        return;
      }

      // Show invite link to copy
      const inviteLink = `${window.location.origin}/stays/cohost-accept?token=${inviteToken}`;
      await navigator.clipboard.writeText(inviteLink).catch(() => {});
      toast.success(`Invitation created! Share this link with ${inviteEmail}`, {
        description: inviteLink,
        duration: 8000,
        action: {
          label: 'Copy',
          onClick: () => navigator.clipboard.writeText(inviteLink),
        },
      });
      setInviteEmail('');
      setShowInviteForm(false);
      setSelectedPermissions(['messaging', 'calendar']);
      loadCohosts();
    } catch (err) {
      console.error('Error inviting cohost:', err);
      toast.error('Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (cohostId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('property_cohosts')
        .delete()
        .eq('id', cohostId)
        .eq('host_user_id', user?.id);

      if (error) throw error;
      toast.success(`Removed ${email} as co-host`);
      setCohosts(prev => prev.filter(c => c.id !== cohostId));
    } catch (err) {
      console.error('Error removing cohost:', err);
      toast.error('Failed to remove co-host');
    }
  };

  const getPropertyTitle = (propertyId: string) =>
    properties.find(p => p.id === propertyId)?.title || 'Unknown Property';

  const getStatusBadge = (status: string) => {
    if (status === 'accepted') return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
    return <Badge variant="outline" className="text-yellow-400 border-yellow-500/30 bg-yellow-500/10"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
  };

  if (properties.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="w-12 h-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No properties yet</h3>
          <p className="text-slate-400 text-center">Add a property before inviting co-hosts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Co-Host Management</h2>
          <p className="text-slate-400 text-sm mt-1">
            Invite trusted people to help manage your properties
          </p>
        </div>
        <Button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="bg-mansagold hover:bg-mansagold/90 text-black"
        >
          {showInviteForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showInviteForm ? 'Cancel' : 'Invite Co-Host'}
        </Button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <Card className="bg-slate-800/50 border-mansagold/30 border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-mansagold" />
              Invite a Co-Host
            </CardTitle>
            <CardDescription className="text-slate-400">
              They'll receive an invitation and can accept to start helping manage your listing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Property Select */}
            <div className="space-y-2">
              <Label className="text-slate-300">Property</Label>
              <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {properties.map(p => (
                    <SelectItem key={p.id} value={p.id} className="text-white">{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-slate-300">Co-Host Email</Label>
              <Input
                type="email"
                placeholder="their@email.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <Label className="text-slate-300">Permissions</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PERMISSION_OPTIONS.map(({ key, label, icon: Icon, description }) => (
                  <div
                    key={key}
                    onClick={() => togglePermission(key)}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPermissions.includes(key)
                        ? 'border-mansagold/50 bg-mansagold/10'
                        : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                    }`}
                  >
                    <Checkbox
                      checked={selectedPermissions.includes(key)}
                      onCheckedChange={() => togglePermission(key)}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-mansagold" />
                        <span className="text-sm font-medium text-white">{label}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleInvite}
              disabled={inviting || !inviteEmail.trim()}
              className="w-full bg-mansagold hover:bg-mansagold/90 text-black font-semibold"
            >
              {inviting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Co-hosts List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-20 bg-slate-800/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : cohosts.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShieldCheck className="w-12 h-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No co-hosts yet</h3>
            <p className="text-slate-400 text-center text-sm max-w-sm">
              Invite a trusted person to help manage guest messaging, calendars, and reservations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {cohosts.map(cohost => (
            <Card key={cohost.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-medium">{cohost.cohost_email}</span>
                      {getStatusBadge(cohost.status)}
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      {getPropertyTitle(cohost.property_id)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {cohost.permissions.map(perm => {
                        const opt = PERMISSION_OPTIONS.find(o => o.key === perm);
                        return opt ? (
                          <Badge key={perm} variant="outline" className="text-xs text-slate-300 border-slate-600">
                            {opt.label}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(cohost.id, cohost.cohost_email)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 self-start sm:self-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoHostManager;
