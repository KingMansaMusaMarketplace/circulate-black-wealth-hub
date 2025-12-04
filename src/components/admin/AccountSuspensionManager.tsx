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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Ban, CheckCircle, Search, AlertTriangle, User, Building2 } from 'lucide-react';
import { format } from 'date-fns';

interface Suspension {
  id: string;
  user_id: string | null;
  business_id: string | null;
  suspended_by: string;
  reason: string;
  suspension_type: string;
  suspended_at: string;
  expires_at: string | null;
  lifted_at: string | null;
  is_active: boolean;
  profiles?: { full_name: string; email: string } | null;
  businesses?: { business_name: string } | null;
}

const AccountSuspensionManager: React.FC = () => {
  const { user } = useAuth();
  const [suspensions, setSuspensions] = useState<Suspension[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [liftDialogOpen, setLiftDialogOpen] = useState(false);
  const [selectedSuspension, setSelectedSuspension] = useState<Suspension | null>(null);
  
  // New suspension form
  const [targetType, setTargetType] = useState<'user' | 'business'>('user');
  const [targetId, setTargetId] = useState('');
  const [reason, setReason] = useState('');
  const [suspensionType, setSuspensionType] = useState('temporary');
  const [expiresAt, setExpiresAt] = useState('');
  const [liftReason, setLiftReason] = useState('');

  const fetchSuspensions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('account_suspensions')
        .select(`
          *,
          profiles:user_id(full_name, email),
          businesses:business_id(business_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuspensions(data || []);
    } catch (error) {
      console.error('Error fetching suspensions:', error);
      toast.error('Failed to load suspensions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuspensions();
  }, []);

  const handleSuspend = async () => {
    if (!targetId || !reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const suspensionData: Record<string, unknown> = {
        suspended_by: user?.id,
        reason,
        suspension_type: suspensionType,
        expires_at: suspensionType === 'temporary' && expiresAt ? expiresAt : null,
      };

      if (targetType === 'user') {
        suspensionData.user_id = targetId;
      } else {
        suspensionData.business_id = targetId;
      }

      const { error } = await supabase
        .from('account_suspensions')
        .insert(suspensionData);

      if (error) throw error;

      toast.success(`${targetType === 'user' ? 'User' : 'Business'} suspended successfully`);
      setDialogOpen(false);
      resetForm();
      fetchSuspensions();
    } catch (error) {
      console.error('Error creating suspension:', error);
      toast.error('Failed to create suspension');
    }
  };

  const handleLiftSuspension = async () => {
    if (!selectedSuspension || !liftReason) {
      toast.error('Please provide a reason for lifting the suspension');
      return;
    }

    try {
      const { error } = await supabase
        .from('account_suspensions')
        .update({
          is_active: false,
          lifted_at: new Date().toISOString(),
          lifted_by: user?.id,
          lift_reason: liftReason,
        })
        .eq('id', selectedSuspension.id);

      if (error) throw error;

      toast.success('Suspension lifted successfully');
      setLiftDialogOpen(false);
      setSelectedSuspension(null);
      setLiftReason('');
      fetchSuspensions();
    } catch (error) {
      console.error('Error lifting suspension:', error);
      toast.error('Failed to lift suspension');
    }
  };

  const resetForm = () => {
    setTargetType('user');
    setTargetId('');
    setReason('');
    setSuspensionType('temporary');
    setExpiresAt('');
  };

  const filteredSuspensions = suspensions.filter(s => {
    const matchesSearch = 
      s.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.businesses?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterActive === 'all' ||
      (filterActive === 'active' && s.is_active) ||
      (filterActive === 'lifted' && !s.is_active);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-destructive" />
                Account Suspensions
              </CardTitle>
              <CardDescription>
                Manage user and business account suspensions
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Ban className="h-4 w-4 mr-2" />
                  New Suspension
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Suspension</DialogTitle>
                  <DialogDescription>
                    Suspend a user or business account
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Type</label>
                    <Select value={targetType} onValueChange={(v) => setTargetType(v as 'user' | 'business')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{targetType === 'user' ? 'User' : 'Business'} ID</label>
                    <Input
                      placeholder={`Enter ${targetType} ID`}
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Suspension Type</label>
                    <Select value={suspensionType} onValueChange={setSuspensionType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temporary">Temporary</SelectItem>
                        <SelectItem value="permanent">Permanent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {suspensionType === 'temporary' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expires At</label>
                      <Input
                        type="datetime-local"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason</label>
                    <Textarea
                      placeholder="Reason for suspension..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleSuspend}>
                    Suspend Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suspensions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterActive} onValueChange={setFilterActive}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="lifted">Lifted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredSuspensions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No suspensions found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Target</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Suspended At</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuspensions.map((suspension) => (
                  <TableRow key={suspension.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {suspension.user_id ? (
                          <>
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{suspension.profiles?.full_name || 'Unknown'}</div>
                              <div className="text-xs text-muted-foreground">{suspension.profiles?.email}</div>
                            </div>
                          </>
                        ) : (
                          <>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <div className="font-medium">{suspension.businesses?.business_name || 'Unknown'}</div>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={suspension.suspension_type === 'permanent' ? 'destructive' : 'secondary'}>
                        {suspension.suspension_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{suspension.reason}</TableCell>
                    <TableCell>
                      <Badge variant={suspension.is_active ? 'destructive' : 'outline'}>
                        {suspension.is_active ? 'Active' : 'Lifted'}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(suspension.suspended_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      {suspension.expires_at
                        ? format(new Date(suspension.expires_at), 'MMM d, yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {suspension.is_active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSuspension(suspension);
                            setLiftDialogOpen(true);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Lift
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Lift Suspension Dialog */}
      <Dialog open={liftDialogOpen} onOpenChange={setLiftDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lift Suspension</DialogTitle>
            <DialogDescription>
              Provide a reason for lifting this suspension
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Reason for lifting suspension..."
              value={liftReason}
              onChange={(e) => setLiftReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLiftDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLiftSuspension}>
              Lift Suspension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountSuspensionManager;
