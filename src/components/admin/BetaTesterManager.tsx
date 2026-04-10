import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserPlus, Trash2, Copy, Users, Clock, Calendar, Activity, RefreshCw, Search } from 'lucide-react';

interface BetaTester {
  id: string;
  full_name: string;
  email: string;
  beta_code: string;
  status: string;
  user_id: string | null;
  expiration_date: string | null;
  notes: string | null;
  total_session_minutes: number;
  active_days_count: number;
  feature_interactions_count: number;
  last_active_at: string | null;
  signed_up_at: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  invited: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  expired: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const getEngagementLevel = (minutes: number, days: number): { label: string; color: string } => {
  if (days === 0) return { label: 'No Activity', color: 'text-gray-400' };
  const avgMinutesPerDay = minutes / days;
  if (avgMinutesPerDay >= 30) return { label: 'High', color: 'text-green-400' };
  if (avgMinutesPerDay >= 10) return { label: 'Medium', color: 'text-yellow-400' };
  return { label: 'Low', color: 'text-red-400' };
};

const BetaTesterManager: React.FC = () => {
  const { user } = useAuth();
  const [testers, setTesters] = useState<BetaTester[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newExpiration, setNewExpiration] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchTesters = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('beta_testers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load beta testers');
      console.error(error);
    } else {
      setTesters((data as any[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTesters(); }, [fetchTesters]);

  const handleAdd = async () => {
    if (!newName.trim() || !newEmail.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setAdding(true);
    const trimmedName = newName.trim();
    const trimmedEmail = newEmail.trim().toLowerCase();
    const expDate = newExpiration || null;

    const { data: insertedData, error } = await supabase.from('beta_testers').insert({
      full_name: trimmedName,
      email: trimmedEmail,
      notes: newNotes.trim() || null,
      expiration_date: expDate,
      invited_by: user?.id,
    } as any).select('id, beta_code').single();

    if (error) {
      if (error.code === '23505') {
        toast.error('This email is already registered as a beta tester');
      } else {
        toast.error(`Failed to add: ${error.message}`);
      }
    } else {
      // Auto-send welcome email with beta code
      const betaCode = (insertedData as any)?.beta_code;
      const formattedExpiration = expDate
        ? new Date(expDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : undefined;

      try {
        await supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'beta-tester-welcome',
            recipientEmail: trimmedEmail,
            idempotencyKey: `beta-welcome-${(insertedData as any)?.id}`,
            templateData: {
              name: trimmedName,
              betaCode: betaCode,
              expirationDate: formattedExpiration,
            },
          },
        });
        toast.success(`${trimmedName} added and welcome email sent with beta code!`);
      } catch (emailErr) {
        console.warn('Welcome email failed (non-blocking):', emailErr);
        toast.success(`${trimmedName} added! Email couldn't be sent — you can copy the code manually.`);
      }

      setNewName('');
      setNewEmail('');
      setNewNotes('');
      setNewExpiration('');
      setShowAddDialog(false);
      fetchTesters();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const { error } = await supabase.from('beta_testers').delete().eq('id', id);
    if (error) {
      toast.error(`Failed to remove: ${error.message}`);
    } else {
      toast.success(`${name} removed from beta program`);
      fetchTesters();
    }
  };

  const handleDeactivate = async (id: string) => {
    const { error } = await supabase.from('beta_testers').update({ status: 'inactive' } as any).eq('id', id);
    if (error) {
      toast.error(`Failed to deactivate: ${error.message}`);
    } else {
      toast.success('Beta tester deactivated — free access revoked');
      fetchTesters();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Beta code copied!');
  };

  const filtered = testers.filter(t =>
    t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.beta_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: testers.length,
    active: testers.filter(t => t.status === 'active').length,
    invited: testers.filter(t => t.status === 'invited').length,
    totalMinutes: testers.reduce((sum, t) => sum + (t.total_session_minutes || 0), 0),
  };

  const formatMinutes = (m: number) => {
    if (m < 60) return `${Math.round(m)}m`;
    const hrs = Math.floor(m / 60);
    const mins = Math.round(m % 60);
    return `${hrs}h ${mins}m`;
  };

  const daysSince = (date: string) => {
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Beta Tester Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage beta testers who get free business access. Each beta code is single-use.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchTesters} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-mansagold text-black hover:bg-mansagold/90">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Beta Tester
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Beta Tester</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label className="text-gray-300">Full Name *</Label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="John Doe"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Email Address *</Label>
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Expiration Date (optional)</Label>
                  <Input
                    type="date"
                    value={newExpiration}
                    onChange={(e) => setNewExpiration(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Notes (optional)</Label>
                  <Textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="e.g., Referred by partner, testing mobile features..."
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAdd} disabled={adding} className="bg-mansagold text-black hover:bg-mansagold/90">
                  {adding ? 'Adding...' : 'Add Beta Tester'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-mansagold" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Testers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active (Signed Up)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.invited}</p>
                <p className="text-xs text-muted-foreground">Pending Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">{formatMinutes(stats.totalMinutes)}</p>
                <p className="text-xs text-muted-foreground">Total Usage Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or beta code..."
          className="pl-10 bg-gray-900/50 border-gray-700 text-white"
        />
      </div>

      {/* Table */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-transparent">
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Email</TableHead>
                <TableHead className="text-gray-400">Beta Code</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Usage</TableHead>
                <TableHead className="text-gray-400">Active Days</TableHead>
                <TableHead className="text-gray-400">Engagement</TableHead>
                <TableHead className="text-gray-400">Days in Beta</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    {loading ? 'Loading...' : 'No beta testers found. Add your first one!'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((tester) => {
                  const engagement = getEngagementLevel(tester.total_session_minutes || 0, tester.active_days_count || 0);
                  return (
                    <TableRow key={tester.id} className="border-gray-700">
                      <TableCell className="text-white font-medium">{tester.full_name}</TableCell>
                      <TableCell className="text-gray-300 text-sm">{tester.email}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => copyCode(tester.beta_code)}
                          className="flex items-center gap-1 font-mono text-sm text-mansagold hover:text-mansagold/80 transition-colors"
                          title="Click to copy"
                        >
                          {tester.beta_code}
                          <Copy className="h-3 w-3" />
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[tester.status] || ''}>
                          {tester.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatMinutes(tester.total_session_minutes || 0)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {tester.active_days_count || 0}
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${engagement.color}`}>
                          {engagement.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {tester.signed_up_at ? `${daysSince(tester.signed_up_at)}d` : '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {tester.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeactivate(tester.id)}
                              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 text-xs"
                            >
                              Deactivate
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gray-900 border-gray-700">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Remove Beta Tester</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove <strong>{tester.full_name}</strong> from the beta program and revoke their free access. This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(tester.id, tester.full_name)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BetaTesterManager;
