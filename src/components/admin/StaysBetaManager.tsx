import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserPlus, Trash2, Copy, Users, Calendar, Activity, RefreshCw, Search, Send, Home, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StaysBetaTester {
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
  properties_viewed: number;
  bookings_count: number;
  messages_sent: number;
  feedback_count: number;
  last_active_at: string | null;
  signed_up_at: string | null;
  created_at: string;
}

interface StaysFeedback {
  id: string;
  rating: number | null;
  comment: string | null;
  page_url: string | null;
  user_id: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  invited: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  expired: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const StaysBetaManager: React.FC = () => {
  const { user } = useAuth();
  const [testers, setTesters] = useState<StaysBetaTester[]>([]);
  const [feedback, setFeedback] = useState<StaysFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newExpiration, setNewExpiration] = useState('');
  const [adding, setAdding] = useState(false);
  const [resendingAll, setResendingAll] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [t, f] = await Promise.all([
      supabase.from('stays_beta_testers' as any).select('*').order('created_at', { ascending: false }),
      supabase.from('stays_beta_feedback' as any).select('*').order('created_at', { ascending: false }).limit(200),
    ]);
    if (t.error) { toast.error('Failed to load stays beta testers'); console.error(t.error); }
    else setTesters((t.data as any) || []);
    if (!f.error) setFeedback((f.data as any) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const sendInviteEmail = async (tester: { id: string; full_name: string; email: string; beta_code: string; expiration_date?: string | null }) => {
    const formattedExpiration = tester.expiration_date
      ? new Date(tester.expiration_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : undefined;
    try {
      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'beta-tester-welcome',
          recipientEmail: tester.email,
          idempotencyKey: `stays-beta-${tester.id}-${Date.now()}`,
          templateData: {
            name: tester.full_name,
            betaCode: tester.beta_code,
            expirationDate: formattedExpiration,
            programName: 'Mansa Stays Beta',
          },
        },
      });
      return true;
    } catch (e) {
      console.error('email failed', tester.email, e);
      return false;
    }
  };

  const handleResendAllEmails = async () => {
    const invited = testers.filter(t => t.status === 'invited');
    if (invited.length === 0) { toast.info('No invited testers'); return; }
    setResendingAll(true);
    let sent = 0, failed = 0;
    for (const t of invited) {
      const ok = await sendInviteEmail(t);
      ok ? sent++ : failed++;
      await new Promise(r => setTimeout(r, 2000));
    }
    setResendingAll(false);
    failed === 0 ? toast.success(`Sent ${sent} invites`) : toast.warning(`Sent ${sent}, failed ${failed}`);
  };

  const handleAdd = async () => {
    if (!newName.trim() || !newEmail.trim()) { toast.error('Name and email are required'); return; }
    setAdding(true);
    const name = newName.trim();
    const email = newEmail.trim().toLowerCase();
    const expDate = newExpiration || null;

    const { data, error } = await supabase.from('stays_beta_testers' as any).insert({
      full_name: name,
      email,
      notes: newNotes.trim() || null,
      expiration_date: expDate,
      invited_by: user?.id,
    } as any).select('id, beta_code').single();

    if (error) {
      if ((error as any).code === '23505') toast.error('Email already a Stays beta tester');
      else toast.error(`Failed: ${error.message}`);
    } else {
      const ok = await sendInviteEmail({ id: (data as any).id, full_name: name, email, beta_code: (data as any).beta_code, expiration_date: expDate });
      toast.success(ok ? `${name} invited — email sent` : `${name} added (email failed — share code manually)`);
      setNewName(''); setNewEmail(''); setNewNotes(''); setNewExpiration('');
      setShowAddDialog(false);
      fetchAll();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const { error } = await supabase.from('stays_beta_testers' as any).delete().eq('id', id);
    if (error) toast.error(`Failed: ${error.message}`);
    else { toast.success(`${name} removed`); fetchAll(); }
  };

  const handleDeactivate = async (id: string) => {
    const { error } = await supabase.from('stays_beta_testers' as any).update({ status: 'inactive' } as any).eq('id', id);
    if (error) toast.error(`Failed: ${error.message}`);
    else { toast.success('Deactivated'); fetchAll(); }
  };

  const copyCode = (code: string) => { navigator.clipboard.writeText(code); toast.success('Code copied'); };

  const filtered = testers.filter(t =>
    t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.beta_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: testers.length,
    active: testers.filter(t => t.status === 'active').length,
    invited: testers.filter(t => t.status === 'invited').length,
    bookings: testers.reduce((s, t) => s + (t.bookings_count || 0), 0),
  };

  const daysSince = (d: string) => Math.floor((Date.now() - new Date(d).getTime()) / 86400000);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Mansa Stays Beta</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Invite-only access to Mansa Stays during the private beta. Each code is single-use.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleResendAllEmails} disabled={resendingAll || stats.invited === 0}>
            <Send className={`h-4 w-4 mr-1 ${resendingAll ? 'animate-pulse' : ''}`} />
            {resendingAll ? 'Sending...' : `Resend All (${stats.invited})`}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />Refresh
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-mansagold text-black hover:bg-mansagold/90">
                <UserPlus className="h-4 w-4 mr-2" />Invite Stays Tester
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Invite Mansa Stays Beta Tester</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label className="text-gray-300">Full Name *</Label>
                  <Input value={newName} onChange={e => setNewName(e.target.value)} className="bg-gray-800 border-gray-600 text-white" />
                </div>
                <div>
                  <Label className="text-gray-300">Email *</Label>
                  <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="bg-gray-800 border-gray-600 text-white" />
                </div>
                <div>
                  <Label className="text-gray-300">Expiration (optional)</Label>
                  <Input type="date" value={newExpiration} onChange={e => setNewExpiration(e.target.value)} className="bg-gray-800 border-gray-600 text-white" />
                </div>
                <div>
                  <Label className="text-gray-300">Notes (optional)</Label>
                  <Textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} className="bg-gray-800 border-gray-600 text-white" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={handleAdd} disabled={adding} className="bg-mansagold text-black hover:bg-mansagold/90">
                  {adding ? 'Adding...' : 'Invite'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Testers', value: stats.total, color: 'text-mansagold' },
          { icon: Activity, label: 'Active', value: stats.active, color: 'text-green-400' },
          { icon: Calendar, label: 'Pending Invites', value: stats.invited, color: 'text-blue-400' },
          { icon: Home, label: 'Total Bookings', value: stats.bookings, color: 'text-purple-400' },
        ].map((s, i) => (
          <Card key={i} className="bg-gray-900/50 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <s.icon className={`h-8 w-8 ${s.color}`} />
                <div>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="testers" className="w-full">
        <TabsList className="bg-gray-900 border border-gray-700">
          <TabsTrigger value="testers">Testers</TabsTrigger>
          <TabsTrigger value="feedback">
            <MessageSquare className="h-3 w-3 mr-1" />Feedback ({feedback.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="testers" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search name, email, code..."
              className="pl-10 bg-gray-900/50 border-gray-700 text-white" />
          </div>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Code</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Views</TableHead>
                    <TableHead className="text-gray-400">Bookings</TableHead>
                    <TableHead className="text-gray-400">Messages</TableHead>
                    <TableHead className="text-gray-400">Days</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      {loading ? 'Loading...' : 'No Stays beta testers yet. Invite your first!'}
                    </TableCell></TableRow>
                  ) : filtered.map(t => (
                    <TableRow key={t.id} className="border-gray-700">
                      <TableCell className="text-white font-medium">{t.full_name}</TableCell>
                      <TableCell className="text-gray-300 text-sm">{t.email}</TableCell>
                      <TableCell>
                        <button onClick={() => copyCode(t.beta_code)} className="flex items-center gap-1 font-mono text-sm text-mansagold hover:text-mansagold/80">
                          {t.beta_code}<Copy className="h-3 w-3" />
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[t.status] || ''}>{t.status}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{t.properties_viewed || 0}</TableCell>
                      <TableCell className="text-gray-300">{t.bookings_count || 0}</TableCell>
                      <TableCell className="text-gray-300">{t.messages_sent || 0}</TableCell>
                      <TableCell className="text-gray-300">{`${daysSince(t.created_at)}d`}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {t.status === 'active' && (
                            <Button variant="ghost" size="sm" onClick={() => handleDeactivate(t.id)}
                              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 text-xs">
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
                                <AlertDialogTitle className="text-white">Remove {t.full_name}?</AlertDialogTitle>
                                <AlertDialogDescription>This will revoke their Stays beta access. Cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(t.id, t.full_name)} className="bg-red-600 hover:bg-red-700">Remove</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4 space-y-3">
              {feedback.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No feedback yet.</p>
              ) : feedback.map(f => (
                <div key={f.id} className="border border-gray-700 rounded-lg p-3 bg-gray-900/30">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {f.rating && <Badge variant="outline" className="text-mansagold border-mansagold/30">{'★'.repeat(f.rating)}</Badge>}
                      {f.page_url && <span className="text-xs text-muted-foreground truncate max-w-xs">{f.page_url}</span>}
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleString()}</span>
                  </div>
                  {f.comment && <p className="text-sm text-gray-200 whitespace-pre-wrap">{f.comment}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaysBetaManager;
