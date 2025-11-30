import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Search, UserX, Mail, Calendar, Shield, Users as UsersIcon } from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  user_type: string | null;
  created_at: string;
  phone: string | null;
}

interface AccountDeletionRequest {
  id: string;
  user_id: string;
  reason: string | null;
  requested_at: string;
  status: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [deletionRequests, setDeletionRequests] = useState<AccountDeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [userStats, setUserStats] = useState({ total: 0, customers: 0, businesses: 0, agents: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Calculate stats
      const stats = {
        total: usersData?.length || 0,
        customers: usersData?.filter(u => u.user_type === 'customer').length || 0,
        businesses: usersData?.filter(u => u.user_type === 'business').length || 0,
        agents: usersData?.filter(u => u.user_type === 'sales_agent').length || 0,
      };
      setUserStats(stats);

      // Load deletion requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('account_deletion_requests')
        .select('*, profiles(email, full_name)')
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });

      if (requestsError) throw requestsError;
      setDeletionRequests(requestsData || []);
    } catch (error: any) {
      toast.error('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeletion = async (requestId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('account_deletion_requests')
        .update({
          status: 'approved',
          processed_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success('Account deletion approved. User will be notified.');
      loadData();
    } catch (error: any) {
      toast.error('Failed to approve deletion: ' + error.message);
    }
  };

  const handleRejectDeletion = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('account_deletion_requests')
        .update({
          status: 'rejected',
          processed_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success('Account deletion rejected');
      loadData();
    } catch (error: any) {
      toast.error('Failed to reject deletion: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserTypeBadge = (type: string | null) => {
    const colors: Record<string, string> = {
      customer: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800',
      sales_agent: 'bg-purple-100 text-purple-800',
    };
    return <Badge className={colors[type || ''] || 'bg-gray-100'}>{type || 'Unknown'}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.customers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.businesses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sales Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.agents}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-users">
        <TabsList>
          <TabsTrigger value="all-users" className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            All Users
          </TabsTrigger>
          <TabsTrigger value="deletion-requests" className="flex items-center gap-2">
            <UserX className="h-4 w-4" />
            Deletion Requests {deletionRequests.length > 0 && `(${deletionRequests.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Manage all platform users</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>{user.full_name || 'N/A'}</TableCell>
                        <TableCell>{getUserTypeBadge(user.user_type)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(user.created_at), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDetailsOpen(true);
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deletion-requests">
          <Card>
            <CardHeader>
              <CardTitle>Account Deletion Requests</CardTitle>
              <CardDescription>Review and process user deletion requests</CardDescription>
            </CardHeader>
            <CardContent>
              {deletionRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No pending deletion requests
                </div>
              ) : (
                <div className="space-y-4">
                  {deletionRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="font-medium">{request.profiles.email}</div>
                          {request.profiles.full_name && (
                            <div className="text-sm text-gray-600">{request.profiles.full_name}</div>
                          )}
                          <div className="text-sm text-gray-500">
                            Requested: {format(new Date(request.requested_at), 'MMM d, yyyy h:mm a')}
                          </div>
                          {request.reason && (
                            <div className="text-sm">
                              <span className="font-medium">Reason:</span> {request.reason}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApproveDeletion(request.id, request.user_id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectDeletion(request.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div>{selectedUser.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Full Name</div>
                  <div>{selectedUser.full_name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">User Type</div>
                  <div>{getUserTypeBadge(selectedUser.user_type)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Phone</div>
                  <div>{selectedUser.phone || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Account Created</div>
                  <div>{format(new Date(selectedUser.created_at), 'MMM d, yyyy h:mm a')}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
