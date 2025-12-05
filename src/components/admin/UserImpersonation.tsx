import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserCog, Eye, Search, Clock, AlertTriangle, User, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ImpersonationSession {
  id: string;
  admin_id: string;
  target_user_id: string;
  started_at: string;
  ended_at: string | null;
  reason: string | null;
}

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  user_type: string;
  created_at: string;
}

const UserImpersonation: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [reason, setReason] = useState('');
  const [isViewingAs, setIsViewingAs] = useState<UserProfile | null>(null);

  const { data: users } = useQuery({
    queryKey: ['impersonation-users', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id, full_name, email, user_type, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: searchTerm.length >= 2 || searchTerm === ''
  });

  const { data: sessions } = useQuery({
    queryKey: ['impersonation-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impersonation_sessions')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as ImpersonationSession[];
    }
  });

  const startSessionMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUser || !reason.trim()) return;
      
      const { error } = await supabase
        .from('impersonation_sessions')
        .insert({
          admin_id: user?.id,
          target_user_id: selectedUser.id,
          reason: reason.trim()
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['impersonation-sessions'] });
      setIsViewingAs(selectedUser);
      setSelectedUser(null);
      setReason('');
      toast.success(`Now viewing as ${selectedUser?.full_name || selectedUser?.email}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to start session');
    }
  });

  const endSessionMutation = useMutation({
    mutationFn: async () => {
      if (!isViewingAs) return;
      
      const { error } = await supabase
        .from('impersonation_sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('target_user_id', isViewingAs.id)
        .is('ended_at', null);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['impersonation-sessions'] });
      toast.success('Impersonation session ended');
      setIsViewingAs(null);
    }
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400';
      case 'business': return 'bg-blue-500/20 text-blue-400';
      case 'sales_agent': return 'bg-green-500/20 text-green-400';
      default: return 'bg-white/20 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Impersonation Banner */}
      {isViewingAs && (
        <Card className="bg-yellow-500/20 border-yellow-500/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-yellow-400" />
                <div>
                  <p className="text-yellow-400 font-medium">Viewing as: {isViewingAs.full_name || isViewingAs.email}</p>
                  <p className="text-yellow-400/70 text-sm">Read-only mode - Actions are simulated</p>
                </div>
              </div>
              <Button
                onClick={() => endSessionMutation.mutate()}
                className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
              >
                <X className="h-4 w-4 mr-2" />
                End Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning */}
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">Important Notice</p>
              <p className="text-white/70 text-sm mt-1">
                User impersonation is a sensitive operation. All sessions are logged for security auditing.
                Use this feature only when necessary for debugging or support purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Impersonation */}
      {!isViewingAs && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserCog className="h-5 w-5 text-mansagold" />
              View As User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div>
              <Label className="text-white/80">Search User</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="pl-10 bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            {/* User List */}
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {users?.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedUser?.id === u.id
                        ? 'bg-mansagold/10 border-mansagold/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="h-8 w-8 text-white/40 bg-white/10 rounded-full p-1.5" />
                        <div>
                          <p className="text-white font-medium">{u.full_name || 'No name'}</p>
                          <p className="text-white/60 text-sm">{u.email}</p>
                        </div>
                      </div>
                      <Badge className={getRoleBadge(u.user_type)}>{u.user_type}</Badge>
                    </div>
                  </div>
                ))}
                {users?.length === 0 && (
                  <p className="text-center text-white/60 py-4">No users found</p>
                )}
              </div>
            </ScrollArea>

            {/* Selected User & Reason */}
            {selectedUser && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="p-3 bg-mansagold/10 rounded-lg border border-mansagold/30">
                  <p className="text-white/60 text-sm">Selected User:</p>
                  <p className="text-white font-medium">{selectedUser.full_name || selectedUser.email}</p>
                </div>
                
                <div>
                  <Label className="text-white/80">Reason for Impersonation *</Label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Debugging user-reported issue #1234"
                    className="mt-1 bg-white/5 border-white/20 text-white"
                  />
                  <p className="text-white/40 text-xs mt-1">Required for audit logging</p>
                </div>

                <Button
                  onClick={() => startSessionMutation.mutate()}
                  disabled={!reason.trim() || startSessionMutation.isPending}
                  className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue-dark"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Start Viewing As This User
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Session History */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-mansagold" />
            Impersonation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {sessions && sessions.length > 0 ? (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className={session.ended_at ? 'bg-gray-500/20 text-gray-400' : 'bg-yellow-500/20 text-yellow-400'}>
                            {session.ended_at ? 'Ended' : 'Active'}
                          </Badge>
                        </div>
                        <p className="text-white/60 text-sm mt-1">
                          Target: {session.target_user_id.slice(0, 8)}...
                        </p>
                        {session.reason && (
                          <p className="text-white/50 text-xs mt-1">"{session.reason}"</p>
                        )}
                      </div>
                      <div className="text-right text-white/40 text-xs">
                        <p>Started: {format(new Date(session.started_at), 'MMM d, h:mm a')}</p>
                        {session.ended_at && (
                          <p>Ended: {format(new Date(session.ended_at), 'MMM d, h:mm a')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-white/60">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No impersonation sessions recorded</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserImpersonation;
