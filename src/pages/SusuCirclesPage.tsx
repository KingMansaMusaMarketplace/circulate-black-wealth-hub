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
import { Users, Plus, DollarSign, Calendar, TrendingUp, Shield, ArrowRight, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-gradient-to-b from-mansablue-dark to-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-mansagold/20 border-2 border-mansagold/40 mb-4">
            <Users className="w-10 h-10 text-mansagold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Susu <span className="text-mansagold">Circles</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Join or create community savings circles. Pool resources with trusted members 
            and take turns receiving the full pot - a tradition of collective empowerment.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-mansagold/20">
                <Users className="w-6 h-6 text-mansagold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{myMemberships?.length || 0}</p>
                <p className="text-white/60 text-sm">My Circles</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  ${myMemberships?.reduce((sum, m) => sum + (m.susu_circles?.contribution_amount || 0), 0) || 0}
                </p>
                <p className="text-white/60 text-sm">Total Committed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">1.5%</p>
                <p className="text-white/60 text-sm">Platform Fee</p>
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
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white/5">
            <TabsTrigger value="my-circles">My Circles</TabsTrigger>
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
          </TabsList>

          <TabsContent value="my-circles" className="mt-6">
            {loadingMemberships ? (
              <div className="text-center py-12">
                <p className="text-white/60">Loading your circles...</p>
              </div>
            ) : myMemberships?.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Circles Yet</h3>
                  <p className="text-white/60 mb-6">Create or join a circle to start saving together</p>
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
                    <Card className="bg-white/5 border-white/10 hover:border-mansagold/30 transition-all">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-white flex items-center gap-2">
                              {membership.susu_circles?.name}
                              {membership.susu_circles?.creator_id === user?.id && (
                                <Crown className="w-4 h-4 text-mansagold" />
                              )}
                            </CardTitle>
                            <CardDescription className="text-white/60">
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
                            <p className="text-white/50">Contribution</p>
                            <p className="text-white font-semibold">
                              ${membership.susu_circles?.contribution_amount} {getFrequencyLabel(membership.susu_circles?.frequency || '')}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/50">Your Position</p>
                            <p className="text-white font-semibold">#{membership.payout_position}</p>
                          </div>
                          <div>
                            <p className="text-white/50">Current Round</p>
                            <p className="text-white font-semibold">{membership.susu_circles?.current_round || 1}</p>
                          </div>
                          <div>
                            <p className="text-white/50">Total Payout</p>
                            <p className="text-mansagold font-bold">
                              ${(membership.susu_circles?.contribution_amount || 0) * (membership.susu_circles?.max_members || 0)}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-white/60">
                            <span>Round Progress</span>
                            <span>{membership.susu_circles?.current_round || 1} of {membership.susu_circles?.max_members}</span>
                          </div>
                          <Progress 
                            value={((membership.susu_circles?.current_round || 1) / (membership.susu_circles?.max_members || 10)) * 100} 
                            className="h-2"
                          />
                        </div>
                        {membership.has_received_payout && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            ✓ Payout Received
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="how-it-works" className="mt-6">
            <Card className="bg-white/5 border-white/10">
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
                      <div className="w-12 h-12 rounded-full bg-mansagold/20 border-2 border-mansagold/40 flex items-center justify-center mx-auto">
                        <item.icon className="w-6 h-6 text-mansagold" />
                      </div>
                      <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                      <p className="text-white/60 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 rounded-lg bg-mansagold/10 border border-mansagold/20">
                  <p className="text-center text-white/80">
                    <Shield className="w-5 h-5 inline-block mr-2 text-mansagold" />
                    <strong>Secure Escrow:</strong> All contributions are held safely until payout. 
                    Only a 1.5% platform fee applies.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SusuCirclesPage;
