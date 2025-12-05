import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Plus, Users, Lock, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface AdminPermission {
  id: string;
  admin_role: string;
  permission: string;
  created_at: string;
}

const allPermissions = [
  { key: 'all', label: 'Full Access', description: 'Complete control over all features' },
  { key: 'users', label: 'User Management', description: 'View and manage users' },
  { key: 'users_view', label: 'View Users', description: 'View user data (read-only)' },
  { key: 'businesses', label: 'Business Management', description: 'Manage businesses' },
  { key: 'tickets', label: 'Support Tickets', description: 'Handle support requests' },
  { key: 'moderation', label: 'Content Moderation', description: 'Review flagged content' },
  { key: 'reviews', label: 'Reviews', description: 'Manage reviews' },
  { key: 'financial', label: 'Financial', description: 'Access financial data' },
  { key: 'payouts', label: 'Payouts', description: 'Process payments' },
  { key: 'analytics', label: 'Analytics', description: 'View analytics dashboards' },
  { key: 'reports', label: 'Reports', description: 'Generate and view reports' },
  { key: 'settings', label: 'System Settings', description: 'Modify system configuration' },
  { key: 'verifications', label: 'Verifications', description: 'Handle verification requests' },
  { key: 'agents', label: 'Sales Agents', description: 'Manage sales agents' }
];

const AdminRolesManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const { data: permissions, isLoading } = useQuery({
    queryKey: ['admin-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('*')
        .order('admin_role', { ascending: true });
      if (error) throw error;
      return data as AdminPermission[];
    }
  });

  // Group permissions by role
  const roleGroups = React.useMemo(() => {
    if (!permissions) return {};
    return permissions.reduce((acc, perm) => {
      if (!acc[perm.admin_role]) {
        acc[perm.admin_role] = [];
      }
      acc[perm.admin_role].push(perm.permission);
      return acc;
    }, {} as Record<string, string[]>);
  }, [permissions]);

  const createRoleMutation = useMutation({
    mutationFn: async () => {
      const roleName = newRoleName.toLowerCase().replace(/\s+/g, '_');
      
      for (const permission of selectedPermissions) {
        const { error } = await supabase
          .from('admin_permissions')
          .insert({
            admin_role: roleName,
            permission
          });
        if (error && !error.message.includes('duplicate')) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
      setIsCreateOpen(false);
      setNewRoleName('');
      setSelectedPermissions([]);
      toast.success('Admin role created!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create role');
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ role, permissions: newPermissions }: { role: string; permissions: string[] }) => {
      // Delete existing permissions for this role
      await supabase
        .from('admin_permissions')
        .delete()
        .eq('admin_role', role);
      
      // Insert new permissions
      for (const permission of newPermissions) {
        const { error } = await supabase
          .from('admin_permissions')
          .insert({
            admin_role: role,
            permission
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
      setEditingRole(null);
      toast.success('Role updated');
    }
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      const { error } = await supabase
        .from('admin_permissions')
        .delete()
        .eq('admin_role', role);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
      toast.success('Role deleted');
    }
  });

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'support_admin': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'content_admin': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'finance_admin': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'analytics_admin': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-white/20 text-white border-white/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-mansagold/10 border-mansagold/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-mansagold" />
              <div>
                <p className="text-white/60 text-sm">Total Roles</p>
                <p className="text-2xl font-bold text-mansagold">{Object.keys(roleGroups).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lock className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-white/60 text-sm">Permissions</p>
                <p className="text-2xl font-bold text-blue-400">{permissions?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-white/60 text-sm">Available Permissions</p>
                <p className="text-2xl font-bold text-purple-400">{allPermissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-mansagold" />
              Admin Roles & Permissions
            </CardTitle>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-mansagold hover:bg-mansagold/90 text-mansablue-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-mansablue-dark border-white/20 max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Admin Role</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/80">Role Name</Label>
                    <Input
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="e.g., Marketing Admin"
                      className="bg-white/5 border-white/20 text-white"
                    />
                    <p className="text-white/40 text-xs mt-1">
                      Will be saved as: {newRoleName.toLowerCase().replace(/\s+/g, '_') || 'role_name'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-white/80 mb-2 block">Permissions</Label>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-2">
                        {allPermissions.map((perm) => (
                          <div
                            key={perm.key}
                            onClick={() => togglePermission(perm.key)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedPermissions.includes(perm.key)
                                ? 'bg-mansagold/10 border-mansagold/50'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={selectedPermissions.includes(perm.key)}
                                className="mt-1"
                              />
                              <div>
                                <p className="text-white font-medium">{perm.label}</p>
                                <p className="text-white/60 text-sm">{perm.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  <Button
                    onClick={() => createRoleMutation.mutate()}
                    disabled={!newRoleName || selectedPermissions.length === 0 || createRoleMutation.isPending}
                    className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue-dark"
                  >
                    Create Role
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansagold"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(roleGroups).map(([role, perms]) => (
                  <div
                    key={role}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(role)}>
                          {role.replace(/_/g, ' ')}
                        </Badge>
                        <span className="text-white/40 text-sm">
                          {perms.length} permission{perms.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {role !== 'super_admin' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteRoleMutation.mutate(role)}
                            className="text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {perms.map((perm) => {
                        const permInfo = allPermissions.find(p => p.key === perm);
                        return (
                          <Badge
                            key={perm}
                            variant="outline"
                            className="text-xs border-white/20 text-white/70"
                          >
                            {permInfo?.label || perm}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {Object.keys(roleGroups).length === 0 && (
                  <div className="text-center py-12 text-white/60">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No admin roles configured</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Permission Reference */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-mansagold" />
            Available Permissions Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allPermissions.map((perm) => (
              <div key={perm.key} className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white font-medium text-sm">{perm.label}</p>
                <p className="text-white/50 text-xs mt-1">{perm.description}</p>
                <code className="text-mansagold/70 text-xs mt-2 block">{perm.key}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRolesManager;
