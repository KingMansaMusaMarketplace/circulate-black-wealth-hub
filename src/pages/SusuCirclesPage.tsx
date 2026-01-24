import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, DollarSign, Calendar, TrendingUp, Shield, ArrowRight, Crown, Lock, CheckCircle, Clock, Eye, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import ContributeButton from '@/components/susu/ContributeButton';
import CircleInviteLink from '@/components/susu/CircleInviteLink';
import CircleMemberList from '@/components/susu/CircleMemberList';
import RoundStatusTracker from '@/components/susu/RoundStatusTracker';
import SusuFAQ from '@/components/susu/SusuFAQ';

interface SusuCircle {
  id: string;
  name: string;
  description: string | null;
  contribution_amount: number;
  frequency: string;
  max_members: number;
  current_round: number;
  status: string;
  created_at: string;
  creator_id: string;
}

interface SusuMembership {
  id: string;
  circle_id: string;
  user_id: string;
  payout_position: number;
  has_received_payout: boolean;
  joined_at: string;
  susu_circles: SusuCircle;
}

interface EscrowTransaction {
  id: string;
  circle_id: string;
  contributor_id: string;
  recipient_id: string | null;
  amount: number;
  round_number: number;
  status: string;
  platform_fee: number | null;
  created_at: string;
  released_at: string | null;
}

const SusuCirclesPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [newCircle, setNewCircle] = useState({
    name: '',
    description: '',
    contribution_amount: 100,
    frequency: 'monthly',
    max_members: 10
  });

  // Fetch user's circles
  const { data: myMemberships, isLoading: loadingMemberships } = useQuery({
    queryKey: ['susu-memberships', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('susu_memberships')
        .select(`
          *,
          susu_circles (*)
        `)
        .eq('user_id', user.id);
      if (error) throw error;
      return data as SusuMembership[];
    },
    enabled: !!user?.id
  });

  // Fetch escrow transactions for user's circles
  const { data: escrowTransactions, isLoading: loadingEscrow } = useQuery({
    queryKey: ['susu-escrow', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('susu_escrow')
        .select('*')
        .or(`contributor_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as EscrowTransaction[];
    },
    enabled: !!user?.id
  });

  // Calculate escrow stats
  const escrowStats = React.useMemo(() => {
    if (!escrowTransactions) return { held: 0, released: 0, pending: 0, received: 0 };
    
    const held = escrowTransactions
      .filter(t => t.status === 'held' && t.contributor_id === user?.id)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const released = escrowTransactions
      .filter(t => t.status === 'released' && t.contributor_id === user?.id)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const received = escrowTransactions
      .filter(t => t.status === 'released' && t.recipient_id === user?.id)
      .reduce((sum, t) => sum + t.amount - (t.platform_fee || 0), 0);
    
    return { held, released, pending: held, received };
  }, [escrowTransactions, user?.id]);

  // Fetch available circles to join
  const { data: availableCircles, isLoading: loadingAvailable } = useQuery({
    queryKey: ['susu-circles-available'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('susu_circles')
        .select('*')
        .eq('status', 'forming')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as SusuCircle[];
    }
  });

  // Create circle mutation
  const createCircleMutation = useMutation({
    mutationFn: async (circleData: typeof newCircle) => {
      const { data, error } = await supabase
        .from('susu_circles')
        .insert({
          ...circleData,
          creator_id: user?.id
        })
        .select()
        .single();
      if (error) throw error;
      
      // Auto-join as first member
      await supabase
        .from('susu_memberships')
        .insert({
          circle_id: data.id,
          user_id: user?.id,
          payout_position: 1
        });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['susu-memberships'] });
      queryClient.invalidateQueries({ queryKey: ['susu-circles-available'] });
      setCreateDialogOpen(false);
      setNewCircle({ name: '', description: '', contribution_amount: 100, frequency: 'monthly', max_members: 10 });
      toast.success('Circle created! You are member #1');
    },
    onError: (error) => {
      toast.error('Failed to create circle: ' + (error as Error).message);
    }
  });

  // Join circle mutation
  const joinCircleMutation = useMutation({
    mutationFn: async (circleId: string) => {
      // Get current member count
      const { count } = await supabase
        .from('susu_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('circle_id', circleId);
      
      const { error } = await supabase
        .from('susu_memberships')
        .insert({
          circle_id: circleId,
          user_id: user?.id,
          payout_position: (count || 0) + 1
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['susu-memberships'] });
      queryClient.invalidateQueries({ queryKey: ['susu-circles-available'] });
      setJoinDialogOpen(false);
      toast.success('Joined circle successfully!');
    },
    onError: (error) => {
      toast.error('Failed to join: ' + (error as Error).message);
    }
  });

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Bi-weekly';
      case 'monthly': return 'Monthly';
      default: return freq;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'forming': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-mansablue/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-mansagold/30 to-amber-500/20 border-2 border-mansagold/40 mb-4">
            <Users className="w-10 h-10 text-mansagold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">
            Susu Circles
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Join or create community savings circles. Pool resources with trusted members 
            and take turns receiving the full pot - a tradition of collective empowerment.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-mansagold to-amber-600 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{myMemberships?.length || 0}</p>
                <p className="text-slate-400 text-sm">My Circles</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  ${myMemberships?.reduce((sum, m) => sum + (m.susu_circles?.contribution_amount || 0), 0) || 0}
                </p>
                <p className="text-slate-400 text-sm">Total Committed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-mansagold/30 bg-gradient-to-br from-mansagold/10 to-amber-900/20 backdrop-blur-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-mansagold to-amber-500 shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-mansagold">${escrowStats.held}</p>
                <p className="text-slate-400 text-sm">In Secure Escrow</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">${escrowStats.received}</p>
                <p className="text-slate-400 text-sm">Total Received</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-mansagold hover:bg-mansagold/90 text-mansablue-dark gap-2">
                <Plus className="w-5 h-5" />
                Create Circle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Create a New Susu Circle</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Circle Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Family Savings Circle"
                    value={newCircle.name}
                    onChange={(e) => setNewCircle(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="What's this circle for?"
                    value={newCircle.description}
                    onChange={(e) => setNewCircle(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Contribution ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min={10}
                      value={newCircle.contribution_amount}
                      onChange={(e) => setNewCircle(prev => ({ ...prev, contribution_amount: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="members">Max Members</Label>
                    <Input
                      id="members"
                      type="number"
                      min={2}
                      max={20}
                      value={newCircle.max_members}
                      onChange={(e) => setNewCircle(prev => ({ ...prev, max_members: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={newCircle.frequency}
                    onValueChange={(value) => setNewCircle(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <p className="text-sm font-medium">Payout Summary</p>
                  <p className="text-2xl font-bold text-mansagold">
                    ${newCircle.contribution_amount * newCircle.max_members}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Each member receives when it's their turn
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => createCircleMutation.mutate(newCircle)}
                  disabled={!newCircle.name || createCircleMutation.isPending}
                  className="bg-mansagold hover:bg-mansagold/90 text-mansablue-dark"
                >
                  {createCircleMutation.isPending ? 'Creating...' : 'Create Circle'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="border-mansagold/50 text-mansagold hover:bg-mansagold/10 gap-2">
                <ArrowRight className="w-5 h-5" />
                Join Circle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Available Circles</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {loadingAvailable ? (
                  <p className="text-center text-muted-foreground">Loading...</p>
                ) : availableCircles?.length === 0 ? (
                  <p className="text-center text-muted-foreground">No circles available to join</p>
                ) : (
                  availableCircles?.map((circle) => (
                    <Card key={circle.id} className="bg-muted/30 border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{circle.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ${circle.contribution_amount} {getFrequencyLabel(circle.frequency)} • {circle.max_members} members max
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => joinCircleMutation.mutate(circle.id)}
                            disabled={joinCircleMutation.isPending}
                            className="bg-mansagold hover:bg-mansagold/90 text-mansablue-dark"
                          >
                            Join
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* My Circles */}
        <Tabs defaultValue="my-circles" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-slate-800/60">
            <TabsTrigger value="my-circles">My Circles</TabsTrigger>
            <TabsTrigger value="escrow" className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Escrow
            </TabsTrigger>
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-circles" className="mt-6">
            {loadingMemberships ? (
              <div className="text-center py-12">
                <p className="text-slate-400">Loading your circles...</p>
              </div>
            ) : myMemberships?.length === 0 ? (
              <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Circles Yet</h3>
                  <p className="text-slate-400 mb-6">Create or join a circle to start saving together</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {myMemberships?.map((membership) => (
                  <motion.div
                    key={membership.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl hover:border-mansagold/30 transition-all">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-white flex items-center gap-2">
                              {membership.susu_circles?.name}
                              {membership.susu_circles?.creator_id === user?.id && (
                                <Crown className="w-4 h-4 text-mansagold" />
                              )}
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                              {membership.susu_circles?.description || 'Community savings circle'}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(membership.susu_circles?.status || 'forming')}>
                            {membership.susu_circles?.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Contribution</p>
                            <p className="text-white font-semibold">
                              ${membership.susu_circles?.contribution_amount} {getFrequencyLabel(membership.susu_circles?.frequency || '')}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Your Position</p>
                            <p className="text-white font-semibold">#{membership.payout_position}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Current Round</p>
                            <p className="text-white font-semibold">{membership.susu_circles?.current_round || 1}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Total Payout</p>
                            <p className="text-mansagold font-bold">
                              ${(membership.susu_circles?.contribution_amount || 0) * (membership.susu_circles?.max_members || 0)}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Round Progress</span>
                            <span>{membership.susu_circles?.current_round || 1} of {membership.susu_circles?.max_members}</span>
                          </div>
                          <Progress 
                            value={((membership.susu_circles?.current_round || 1) / (membership.susu_circles?.max_members || 10)) * 100} 
                            className="h-2"
                          />
                        </div>
                        {membership.has_received_payout && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            ✓ Payout Received
                          </Badge>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                          {membership.susu_circles?.status === 'active' && !membership.has_received_payout && (
                            <ContributeButton
                              circleId={membership.circle_id}
                              circleName={membership.susu_circles?.name || 'Circle'}
                              contributionAmount={membership.susu_circles?.contribution_amount || 0}
                              currentRound={membership.susu_circles?.current_round || 1}
                            />
                          )}
                          <CircleInviteLink
                            circleId={membership.circle_id}
                            circleName={membership.susu_circles?.name || 'Circle'}
                            contributionAmount={membership.susu_circles?.contribution_amount || 0}
                            frequency={getFrequencyLabel(membership.susu_circles?.frequency || 'monthly')}
                          />
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-1.5">
                                <Eye className="w-4 h-4" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Users className="w-5 h-5 text-mansagold" />
                                  {membership.susu_circles?.name}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <RoundStatusTracker
                                  circleId={membership.circle_id}
                                  currentRound={membership.susu_circles?.current_round || 1}
                                  contributionAmount={membership.susu_circles?.contribution_amount || 0}
                                  maxMembers={membership.susu_circles?.max_members || 10}
                                />
                                <CircleMemberList
                                  circleId={membership.circle_id}
                                  creatorId={membership.susu_circles?.creator_id || ''}
                                  currentRound={membership.susu_circles?.current_round || 1}
                                  frequency={membership.susu_circles?.frequency || 'monthly'}
                                  createdAt={membership.susu_circles?.created_at || ''}
                                  maxMembers={membership.susu_circles?.max_members || 10}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Escrow Tab */}
          <TabsContent value="escrow" className="mt-6 space-y-6">
            {/* Escrow Summary */}
            <Card className="border border-mansagold/30 bg-gradient-to-br from-mansagold/5 to-amber-900/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-mansagold" />
                  Secure Digital Escrow
                </CardTitle>
                <CardDescription className="text-slate-400">
                  All contributions are held securely until payout conditions are met
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/60 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      Held in Escrow
                    </div>
                    <p className="text-2xl font-bold text-mansagold">${escrowStats.held}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/60 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <CheckCircle className="w-4 h-4" />
                      Released
                    </div>
                    <p className="text-2xl font-bold text-emerald-400">${escrowStats.released}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/60 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <DollarSign className="w-4 h-4" />
                      Total Received
                    </div>
                    <p className="text-2xl font-bold text-blue-400">${escrowStats.received}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/60 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Shield className="w-4 h-4" />
                      Platform Fee
                    </div>
                    <p className="text-2xl font-bold text-white">1.5%</p>
                  </div>
                </div>

                {/* Escrow Transaction History */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Escrow Transaction History</h4>
                  {loadingEscrow ? (
                    <p className="text-center text-slate-400 py-8">Loading transactions...</p>
                  ) : !escrowTransactions || escrowTransactions.length === 0 ? (
                    <div className="text-center py-8 border border-white/10 rounded-lg bg-slate-800/40">
                      <Lock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No escrow transactions yet</p>
                      <p className="text-slate-500 text-sm mt-1">Make your first contribution to see it here</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {escrowTransactions.map((tx) => (
                        <div 
                          key={tx.id} 
                          className="flex items-center justify-between p-4 rounded-lg bg-slate-800/60 border border-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              tx.status === 'held' 
                                ? 'bg-amber-500/20 text-amber-400' 
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {tx.status === 'held' ? (
                                <Clock className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {tx.contributor_id === user?.id ? 'Contribution' : 'Payout Received'}
                              </p>
                              <p className="text-slate-500 text-xs">
                                Round {tx.round_number} • {new Date(tx.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              tx.recipient_id === user?.id ? 'text-emerald-400' : 'text-white'
                            }`}>
                              {tx.recipient_id === user?.id ? '+' : ''}${tx.amount}
                            </p>
                            <Badge className={`text-xs ${
                              tx.status === 'held' 
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}>
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Security Info */}
                <div className="p-4 rounded-lg bg-mansagold/10 border border-mansagold/20">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-mansagold mt-0.5" />
                    <div>
                      <p className="text-mansagold font-semibold">Patent-Protected Escrow System</p>
                      <p className="text-slate-400 text-sm mt-1">
                        Your funds are held in a secure digital escrow until all round conditions are met. 
                        Automatic distribution ensures fairness. A 1.5% platform fee supports platform operations.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="how-it-works" className="mt-6">
            <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-bold text-white text-center mb-8">
                  How Susu Circles Work
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      step: 1,
                      title: 'Form a Circle',
                      description: 'Create or join a circle with 2-20 members. Set contribution amount and frequency.',
                      icon: Users
                    },
                    {
                      step: 2,
                      title: 'Contribute',
                      description: 'Each period, all members contribute. Platform holds funds securely in escrow.',
                      icon: DollarSign
                    },
                    {
                      step: 3,
                      title: 'Receive Payout',
                      description: 'Each round, one member receives the full pot. Everyone gets their turn!',
                      icon: TrendingUp
                    }
                  ].map((item) => (
                    <div key={item.step} className="text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mansagold to-amber-600 shadow-lg flex items-center justify-center mx-auto">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 rounded-lg bg-mansagold/10 border border-mansagold/20">
                  <p className="text-center text-slate-300">
                    <Shield className="w-5 h-5 inline-block mr-2 text-mansagold" />
                    <strong className="text-mansagold">Secure Escrow:</strong> All contributions are held safely until payout. 
                    Only a 1.5% platform fee applies.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <SusuFAQ />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SusuCirclesPage;
