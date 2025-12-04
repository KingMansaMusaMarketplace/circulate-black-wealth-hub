import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, User, Mail, Calendar, Shield, RefreshCw, ShieldCheck, ShieldOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  created_at: string;
  avatar_url: string | null;
}

interface UserRole {
  user_id: string;
  role: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string;
    userName: string;
    action: 'grant' | 'revoke';
  }>({ open: false, userId: '', userName: '', action: 'grant' });

  useEffect(() => {
    fetchUsers();
    fetchUserRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const isAdmin = (userId: string) => {
    return userRoles.some(ur => ur.user_id === userId && ur.role === 'admin');
  };

  const handleAdminToggle = (userId: string, userName: string, currentlyAdmin: boolean) => {
    setConfirmDialog({
      open: true,
      userId,
      userName: userName || 'this user',
      action: currentlyAdmin ? 'revoke' : 'grant'
    });
  };

  const confirmAdminChange = async () => {
    const { userId, action } = confirmDialog;
    
    try {
      if (action === 'grant') {
        // Grant admin access
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });
        
        if (error) {
          if (error.code === '23505') {
            toast.info('User already has admin access');
          } else {
            throw error;
          }
        } else {
          toast.success('Admin access granted successfully');
        }
      } else {
        // Revoke admin access
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
        
        if (error) throw error;
        toast.success('Admin access revoked successfully');
      }
      
      fetchUserRoles();
    } catch (error: any) {
      console.error('Error changing admin status:', error);
      toast.error(error.message || 'Failed to change admin status');
    } finally {
      setConfirmDialog({ open: false, userId: '', userName: '', action: 'grant' });
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.rpc('secure_change_user_role', {
        target_user_id: userId,
        new_role: newRole,
        reason: 'Admin role change from dashboard'
      });

      if (error) throw error;
      
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (roleFilter === 'admin') {
      return matchesSearch && isAdmin(user.id);
    }
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'business': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'sales_agent': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-blue-300"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admins Only</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="sales_agent">Sales Agent</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => { fetchUsers(); fetchUserRoles(); }} variant="outline" className="border-white/10 text-blue-200 hover:bg-white/10">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5 text-yellow-400" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => {
                const userIsAdmin = isAdmin(user.id);
                return (
                  <div
                    key={user.id}
                    className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border gap-4 ${
                      userIsAdmin 
                        ? 'bg-red-500/10 border-red-500/30' 
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        userIsAdmin 
                          ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-500'
                      }`}>
                        {user.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{user.full_name || 'No name'}</p>
                          {userIsAdmin && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              ADMIN
                            </Badge>
                          )}
                        </div>
                        <p className="text-blue-300 text-sm flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role || 'customer'}
                      </Badge>
                      <p className="text-blue-300 text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(user.created_at), 'MMM d, yyyy')}
                      </p>
                      <Select
                        value={user.role || 'customer'}
                        onValueChange={(value) => updateUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="sales_agent">Sales Agent</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant={userIsAdmin ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleAdminToggle(user.id, user.full_name || user.email || '', userIsAdmin)}
                        className={userIsAdmin 
                          ? "bg-red-600 hover:bg-red-700 text-white" 
                          : "border-green-500/30 text-green-400 hover:bg-green-500/20"
                        }
                      >
                        {userIsAdmin ? (
                          <>
                            <ShieldOff className="h-4 w-4 mr-1" />
                            Revoke Admin
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4 mr-1" />
                            Grant Admin
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-blue-300">
                  No users found matching your criteria
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent className="bg-slate-900 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {confirmDialog.action === 'grant' ? 'Grant Admin Access' : 'Revoke Admin Access'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-blue-300">
              {confirmDialog.action === 'grant' 
                ? `Are you sure you want to grant admin access to ${confirmDialog.userName}? They will have full access to the admin dashboard.`
                : `Are you sure you want to revoke admin access from ${confirmDialog.userName}? They will no longer be able to access the admin dashboard.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmAdminChange}
              className={confirmDialog.action === 'grant' 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-red-600 hover:bg-red-700"
              }
            >
              {confirmDialog.action === 'grant' ? 'Grant Access' : 'Revoke Access'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;
