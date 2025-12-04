import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, Building2, Search, CheckSquare, Trash2, Mail, Ban, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface User {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  user_type: string | null;
}

interface Business {
  id: string;
  business_name: string;
  email: string | null;
  is_verified: boolean | null;
  created_at: string;
}

const BulkActionsPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{ type: string; target: 'users' | 'businesses' } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, businessesRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, email, created_at, user_type')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('businesses')
          .select('id, business_name, email, is_verified, created_at')
          .order('created_at', { ascending: false })
          .limit(100),
      ]);

      if (usersRes.error) throw usersRes.error;
      if (businessesRes.error) throw businessesRes.error;

      setUsers(usersRes.data || []);
      setBusinesses(businessesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const toggleBusinessSelection = (businessId: string) => {
    const newSelection = new Set(selectedBusinesses);
    if (newSelection.has(businessId)) {
      newSelection.delete(businessId);
    } else {
      newSelection.add(businessId);
    }
    setSelectedBusinesses(newSelection);
  };

  const selectAllUsers = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const selectAllBusinesses = () => {
    if (selectedBusinesses.size === filteredBusinesses.length) {
      setSelectedBusinesses(new Set());
    } else {
      setSelectedBusinesses(new Set(filteredBusinesses.map(b => b.id)));
    }
  };

  const executeAction = async () => {
    if (!currentAction) return;

    const ids = currentAction.target === 'users' 
      ? Array.from(selectedUsers) 
      : Array.from(selectedBusinesses);

    if (ids.length === 0) {
      toast.error('No items selected');
      return;
    }

    try {
      switch (currentAction.type) {
        case 'verify':
          if (currentAction.target === 'businesses') {
            const { error } = await supabase
              .from('businesses')
              .update({ is_verified: true })
              .in('id', ids);
            if (error) throw error;
            toast.success(`${ids.length} businesses verified`);
          }
          break;
        case 'unverify':
          if (currentAction.target === 'businesses') {
            const { error } = await supabase
              .from('businesses')
              .update({ is_verified: false })
              .in('id', ids);
            if (error) throw error;
            toast.success(`${ids.length} businesses unverified`);
          }
          break;
        case 'delete':
          if (currentAction.target === 'users') {
            // Note: actual deletion would require admin functions
            toast.info('User deletion requires backend admin function');
          } else {
            const { error } = await supabase
              .from('businesses')
              .delete()
              .in('id', ids);
            if (error) throw error;
            toast.success(`${ids.length} businesses deleted`);
          }
          break;
        case 'notify':
          // Create notifications for selected users/businesses
          const notifications = ids.map(id => ({
            user_id: id,
            type: 'admin_notice',
            title: 'Admin Notification',
            message: 'You have received an admin notification',
          }));
          const { error: notifyError } = await supabase
            .from('notifications')
            .insert(notifications);
          if (notifyError) throw notifyError;
          toast.success(`Notifications sent to ${ids.length} ${currentAction.target}`);
          break;
      }

      setActionDialogOpen(false);
      setCurrentAction(null);
      setSelectedUsers(new Set());
      setSelectedBusinesses(new Set());
      fetchData();
    } catch (error) {
      console.error('Error executing action:', error);
      toast.error('Failed to execute action');
    }
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBusinesses = businesses.filter(b =>
    b.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openActionDialog = (type: string, target: 'users' | 'businesses') => {
    setCurrentAction({ type, target });
    setActionDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Bulk Actions
          </CardTitle>
          <CardDescription>
            Select multiple users or businesses to perform bulk operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList className="mb-4">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users ({selectedUsers.size} selected)
              </TabsTrigger>
              <TabsTrigger value="businesses" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Businesses ({selectedBusinesses.size} selected)
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="users">
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedUsers.size === 0}
                  onClick={() => openActionDialog('notify', 'users')}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Send Notification
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedUsers.size === 0}
                  onClick={() => openActionDialog('suspend', 'users')}
                >
                  <Ban className="h-4 w-4 mr-1" />
                  Suspend Selected
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                          onCheckedChange={selectAllUsers}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.has(user.id)}
                            onCheckedChange={() => toggleUserSelection(user.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                        <TableCell>{user.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.user_type || 'customer'}</Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="businesses">
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedBusinesses.size === 0}
                  onClick={() => openActionDialog('verify', 'businesses')}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Verify Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedBusinesses.size === 0}
                  onClick={() => openActionDialog('unverify', 'businesses')}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Unverify Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedBusinesses.size === 0}
                  onClick={() => openActionDialog('notify', 'businesses')}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Send Notification
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={selectedBusinesses.size === 0}
                  onClick={() => openActionDialog('delete', 'businesses')}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Selected
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedBusinesses.size === filteredBusinesses.length && filteredBusinesses.length > 0}
                          onCheckedChange={selectAllBusinesses}
                        />
                      </TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBusinesses.map((business) => (
                      <TableRow key={business.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedBusinesses.has(business.id)}
                            onCheckedChange={() => toggleBusinessSelection(business.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{business.business_name}</TableCell>
                        <TableCell>{business.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={business.is_verified ? 'default' : 'secondary'}>
                            {business.is_verified ? 'Verified' : 'Unverified'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(business.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {currentAction?.type}{' '}
              {currentAction?.target === 'users' ? selectedUsers.size : selectedBusinesses.size}{' '}
              {currentAction?.target}? This action may not be reversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeAction}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BulkActionsPanel;
