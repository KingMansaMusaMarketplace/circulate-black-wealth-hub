import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, User, Mail, Calendar, Shield, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  created_at: string;
  avatar_url: string | null;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
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
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="sales_agent">Sales Agent</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchUsers} variant="outline" className="border-white/10 text-blue-200 hover:bg-white/10">
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
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.full_name || 'No name'}</p>
                      <p className="text-blue-300 text-sm flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
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
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-blue-300">
                  No users found matching your criteria
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
