import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Users,
  Plus,
  MapPin,
  UserPlus,
  LogOut,
  Share2,
  Wrench,
  Camera,
  Lightbulb,
  Tag,
  Megaphone,
  Sparkles,
  Crown,
  Brush,
} from 'lucide-react';

const CIRCLE_TYPES = [
  { value: 'general', label: 'General', icon: Users, description: 'All-purpose networking' },
  { value: 'cleaning', label: 'Cleaning Teams', icon: Brush, description: 'Share cleaning crews' },
  { value: 'maintenance', label: 'Maintenance', icon: Wrench, description: 'Share handymen & contractors' },
  { value: 'marketing', label: 'Co-Marketing', icon: Megaphone, description: 'Cross-promote properties' },
  { value: 'investment', label: 'Investment', icon: Sparkles, description: 'Group investment opportunities' },
];

const RESOURCE_TYPES = [
  { value: 'cleaning_team', label: 'Cleaning Team', icon: Brush },
  { value: 'handyman', label: 'Handyman', icon: Wrench },
  { value: 'photographer', label: 'Photographer', icon: Camera },
  { value: 'tip', label: 'Host Tip', icon: Lightbulb },
  { value: 'deal', label: 'Deal / Discount', icon: Tag },
  { value: 'co_marketing', label: 'Co-Marketing Opportunity', icon: Megaphone },
];

interface Circle {
  id: string;
  name: string;
  description: string | null;
  region: string | null;
  circle_type: string;
  max_members: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  member_count?: number;
  is_member?: boolean;
}

interface Resource {
  id: string;
  circle_id: string;
  shared_by: string;
  resource_type: string;
  title: string;
  description: string | null;
  contact_info: string | null;
  rating: number;
  created_at: string;
}

const MansaHostCircles: React.FC = () => {
  const { user } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [myCircles, setMyCircles] = useState<Circle[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [showCreateCircle, setShowCreateCircle] = useState(false);
  const [showShareResource, setShowShareResource] = useState(false);

  // Create circle form
  const [newCircle, setNewCircle] = useState({ name: '', description: '', region: '', circle_type: 'general' });
  // Share resource form
  const [newResource, setNewResource] = useState({ resource_type: 'tip', title: '', description: '', contact_info: '' });

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      // Fetch all active circles
      const { data: allCircles, error: circlesErr } = await supabase
        .from('host_circles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (circlesErr) throw circlesErr;

      // Fetch my memberships
      const { data: memberships, error: memErr } = await supabase
        .from('host_circle_members')
        .select('circle_id')
        .eq('user_id', user!.id);

      if (memErr) throw memErr;

      const myCircleIds = new Set((memberships || []).map(m => m.circle_id));

      const enriched = (allCircles || []).map(c => ({
        ...c,
        is_member: myCircleIds.has(c.id),
      }));

      setCircles(enriched.filter(c => !c.is_member));
      setMyCircles(enriched.filter(c => c.is_member));
    } catch (err) {
      console.error('Error loading circles:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCircle = async () => {
    if (!newCircle.name.trim()) {
      toast.error('Circle name is required');
      return;
    }
    try {
      const { data: circle, error } = await supabase
        .from('host_circles')
        .insert({
          name: newCircle.name,
          description: newCircle.description || null,
          region: newCircle.region || null,
          circle_type: newCircle.circle_type,
          created_by: user!.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join as admin
      await supabase
        .from('host_circle_members')
        .insert({ circle_id: circle.id, user_id: user!.id, role: 'admin' });

      toast.success('Circle created!');
      setShowCreateCircle(false);
      setNewCircle({ name: '', description: '', region: '', circle_type: 'general' });
      await loadData();
    } catch (err) {
      console.error('Error creating circle:', err);
      toast.error('Failed to create circle');
    }
  };

  const joinCircle = async (circleId: string) => {
    try {
      const { error } = await supabase
        .from('host_circle_members')
        .insert({ circle_id: circleId, user_id: user!.id, role: 'member' });

      if (error) throw error;
      toast.success('Joined circle!');
      await loadData();
    } catch (err) {
      console.error('Error joining circle:', err);
      toast.error('Failed to join circle');
    }
  };

  const leaveCircle = async (circleId: string) => {
    try {
      const { error } = await supabase
        .from('host_circle_members')
        .delete()
        .eq('circle_id', circleId)
        .eq('user_id', user!.id);

      if (error) throw error;
      toast.info('Left circle');
      if (selectedCircle?.id === circleId) setSelectedCircle(null);
      await loadData();
    } catch (err) {
      console.error('Error leaving circle:', err);
      toast.error('Failed to leave circle');
    }
  };

  const loadResources = async (circleId: string) => {
    try {
      const { data, error } = await supabase
        .from('host_circle_resources')
        .select('*')
        .eq('circle_id', circleId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources((data as any[]) || []);
    } catch (err) {
      console.error('Error loading resources:', err);
    }
  };

  const shareResource = async () => {
    if (!selectedCircle || !newResource.title.trim()) {
      toast.error('Title is required');
      return;
    }
    try {
      const { error } = await supabase
        .from('host_circle_resources')
        .insert({
          circle_id: selectedCircle.id,
          shared_by: user!.id,
          resource_type: newResource.resource_type,
          title: newResource.title,
          description: newResource.description || null,
          contact_info: newResource.contact_info || null,
        });

      if (error) throw error;
      toast.success('Resource shared!');
      setShowShareResource(false);
      setNewResource({ resource_type: 'tip', title: '', description: '', contact_info: '' });
      await loadResources(selectedCircle.id);
    } catch (err) {
      console.error('Error sharing resource:', err);
      toast.error('Failed to share resource');
    }
  };

  const selectCircle = (circle: Circle) => {
    setSelectedCircle(circle);
    loadResources(circle.id);
  };

  const getCircleTypeInfo = (type: string) => CIRCLE_TYPES.find(t => t.value === type) || CIRCLE_TYPES[0];
  const getResourceTypeInfo = (type: string) => RESOURCE_TYPES.find(t => t.value === type) || RESOURCE_TYPES[0];

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mansagold/20 rounded-lg">
                <Users className="w-6 h-6 text-mansagold" />
              </div>
              <div>
                <CardTitle className="text-white">Mansa Host Circles</CardTitle>
                <CardDescription className="text-slate-400">
                  Susu-style networking — share cleaning teams, resources, and co-market your properties
                </CardDescription>
              </div>
            </div>
            <Dialog open={showCreateCircle} onOpenChange={setShowCreateCircle}>
              <DialogTrigger asChild>
                <Button className="bg-mansagold hover:bg-mansagold/90 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Circle
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create a Host Circle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="Circle name"
                    value={newCircle.name}
                    onChange={e => setNewCircle(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newCircle.description}
                    onChange={e => setNewCircle(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Input
                    placeholder="Region (e.g., Atlanta Metro)"
                    value={newCircle.region}
                    onChange={e => setNewCircle(prev => ({ ...prev, region: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Select value={newCircle.circle_type} onValueChange={v => setNewCircle(prev => ({ ...prev, circle_type: v }))}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {CIRCLE_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value} className="text-white">
                          {t.label} — {t.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={createCircle} className="w-full bg-mansagold hover:bg-mansagold/90 text-black">
                    Create Circle
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
              <p className="text-2xl font-bold text-white">{myCircles.length}</p>
              <p className="text-xs text-slate-400">My Circles</p>
            </div>
            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
              <p className="text-2xl font-bold text-mansagold">{circles.length}</p>
              <p className="text-xs text-slate-400">Available to Join</p>
            </div>
            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
              <p className="text-2xl font-bold text-green-400">{resources.length}</p>
              <p className="text-xs text-slate-400">Shared Resources</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circles List */}
        <div className="lg:col-span-1 space-y-4">
          <Tabs defaultValue="my-circles">
            <TabsList className="bg-slate-800 w-full">
              <TabsTrigger value="my-circles" className="flex-1">My Circles</TabsTrigger>
              <TabsTrigger value="discover" className="flex-1">Discover</TabsTrigger>
            </TabsList>

            <TabsContent value="my-circles" className="space-y-3 mt-4">
              {myCircles.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">Join or create a circle to get started</p>
              ) : (
                myCircles.map(circle => {
                  const typeInfo = getCircleTypeInfo(circle.circle_type);
                  const TypeIcon = typeInfo.icon;
                  return (
                    <Card
                      key={circle.id}
                      className={`cursor-pointer transition-all border-slate-700 ${selectedCircle?.id === circle.id ? 'bg-mansagold/10 border-mansagold/50' : 'bg-slate-800/50 hover:bg-slate-800'}`}
                      onClick={() => selectCircle(circle)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-slate-700 rounded-lg">
                            <TypeIcon className="w-4 h-4 text-mansagold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-sm truncate">{circle.name}</h4>
                            {circle.region && (
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" /> {circle.region}
                              </p>
                            )}
                            <Badge variant="outline" className="text-xs mt-2">{typeInfo.label}</Badge>
                          </div>
                          {circle.created_by === user?.id && (
                            <Crown className="w-4 h-4 text-mansagold flex-shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="discover" className="space-y-3 mt-4">
              {circles.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">No circles available to join right now</p>
              ) : (
                circles.map(circle => {
                  const typeInfo = getCircleTypeInfo(circle.circle_type);
                  const TypeIcon = typeInfo.icon;
                  return (
                    <Card key={circle.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-slate-700 rounded-lg">
                            <TypeIcon className="w-4 h-4 text-slate-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-sm">{circle.name}</h4>
                            {circle.description && (
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{circle.description}</p>
                            )}
                            {circle.region && (
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" /> {circle.region}
                              </p>
                            )}
                          </div>
                          <Button size="sm" onClick={() => joinCircle(circle.id)} className="bg-mansagold hover:bg-mansagold/90 text-black flex-shrink-0">
                            <UserPlus className="w-3 h-3 mr-1" /> Join
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Circle Detail */}
        <div className="lg:col-span-2">
          {!selectedCircle ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Share2 className="w-12 h-12 text-slate-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Select a Circle</h3>
                <p className="text-slate-400 text-center">
                  Choose a circle from the left to view shared resources and collaborate with other hosts
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Circle Header */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedCircle.name}</h2>
                      {selectedCircle.description && (
                        <p className="text-slate-400 text-sm mt-1">{selectedCircle.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline">{getCircleTypeInfo(selectedCircle.circle_type).label}</Badge>
                        {selectedCircle.region && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {selectedCircle.region}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={showShareResource} onOpenChange={setShowShareResource}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-mansagold hover:bg-mansagold/90 text-black">
                            <Plus className="w-4 h-4 mr-1" /> Share Resource
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Share a Resource</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <Select value={newResource.resource_type} onValueChange={v => setNewResource(prev => ({ ...prev, resource_type: v }))}>
                              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                {RESOURCE_TYPES.map(t => (
                                  <SelectItem key={t.value} value={t.value} className="text-white">{t.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Resource title"
                              value={newResource.title}
                              onChange={e => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                            <Textarea
                              placeholder="Details, review, or recommendation..."
                              value={newResource.description}
                              onChange={e => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                            <Input
                              placeholder="Contact info (phone, email, website)"
                              value={newResource.contact_info}
                              onChange={e => setNewResource(prev => ({ ...prev, contact_info: e.target.value }))}
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                            <Button onClick={shareResource} className="w-full bg-mansagold hover:bg-mansagold/90 text-black">
                              Share with Circle
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => leaveCircle(selectedCircle.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <LogOut className="w-4 h-4 mr-1" /> Leave
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resources */}
              {resources.length === 0 ? (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Lightbulb className="w-10 h-10 text-slate-500 mb-3" />
                    <h3 className="text-white font-semibold mb-1">No resources shared yet</h3>
                    <p className="text-slate-400 text-sm text-center">
                      Be the first to share a cleaning team, tip, or co-marketing opportunity!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map(resource => {
                    const typeInfo = getResourceTypeInfo(resource.resource_type);
                    const TypeIcon = typeInfo.icon;
                    return (
                      <Card key={resource.id} className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-700 rounded-lg">
                              <TypeIcon className="w-4 h-4 text-mansagold" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-white text-sm">{resource.title}</h4>
                                <Badge variant="outline" className="text-xs">{typeInfo.label}</Badge>
                              </div>
                              {resource.description && (
                                <p className="text-xs text-slate-400 mt-1">{resource.description}</p>
                              )}
                              {resource.contact_info && (
                                <p className="text-xs text-mansagold mt-2">📞 {resource.contact_info}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MansaHostCircles;
