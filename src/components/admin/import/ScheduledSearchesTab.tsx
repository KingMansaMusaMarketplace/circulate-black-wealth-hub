import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, Plus, Trash2, Play, Pause, RefreshCw, Sparkles, MapPin, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ScheduledSearch {
  id: string;
  search_name: string;
  query: string;
  category: string | null;
  location: string | null;
  frequency: string;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  leads_found_total: number;
  created_at: string;
}

export const ScheduledSearchesTab: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newSearch, setNewSearch] = useState({
    search_name: '',
    query: '',
    category: '',
    location: '',
    frequency: 'daily',
  });

  const { data: searches, isLoading } = useQuery({
    queryKey: ['scheduled-searches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_discovery_searches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ScheduledSearch[];
    },
    staleTime: 60000,
  });

  const createSearchMutation = useMutation({
    mutationFn: async (searchData: typeof newSearch) => {
      const nextRun = new Date();
      if (searchData.frequency === 'hourly') {
        nextRun.setHours(nextRun.getHours() + 1);
      } else if (searchData.frequency === 'daily') {
        nextRun.setDate(nextRun.getDate() + 1);
        nextRun.setHours(6, 0, 0, 0); // Run at 6 AM
      } else {
        nextRun.setDate(nextRun.getDate() + 7);
      }

      const { error } = await supabase
        .from('scheduled_discovery_searches')
        .insert({
          ...searchData,
          category: searchData.category || null,
          location: searchData.location || null,
          created_by: user?.id,
          next_run_at: nextRun.toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-searches'] });
      toast.success('Scheduled search created!');
      setShowCreateDialog(false);
      setNewSearch({ search_name: '', query: '', category: '', location: '', frequency: 'daily' });
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast.error('Failed to create scheduled search');
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('scheduled_discovery_searches')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-searches'] });
      toast.success('Search status updated');
    },
  });

  const deleteSearchMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scheduled_discovery_searches')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-searches'] });
      toast.success('Scheduled search deleted');
    },
  });

  const runNowMutation = useMutation({
    mutationFn: async (search: ScheduledSearch) => {
      // Invoke the b2b-web-search function
      const { data, error } = await supabase.functions.invoke('b2b-web-search', {
        body: {
          query: search.query,
          category: search.category,
          location: search.location,
          limit: 50,
        },
      });

      if (error) throw error;

      // Import the found businesses
      if (data.businesses && data.businesses.length > 0) {
        const leads = data.businesses.map((b: any) => ({
          business_name: b.name,
          business_description: b.description,
          category: b.category || search.category,
          location: b.location,
          website_url: b.website,
          owner_email: b.contact?.email || null,
          phone_number: b.contact?.phone || null,
          source_query: `scheduled: ${search.search_name}`,
          confidence_score: b.confidence,
          source_citations: data.citations?.slice(0, 5) || [],
        }));

        await supabase.from('b2b_external_leads').insert(leads);

        // Update the scheduled search stats
        await supabase
          .from('scheduled_discovery_searches')
          .update({
            last_run_at: new Date().toISOString(),
            leads_found_total: (search.leads_found_total || 0) + leads.length,
          })
          .eq('id', search.id);

        return leads.length;
      }
      return 0;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-searches'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      queryClient.invalidateQueries({ queryKey: ['external-leads'] });
      toast.success(`Found and imported ${count} new leads!`);
    },
    onError: (error) => {
      console.error('Run error:', error);
      toast.error('Failed to run search');
    },
  });

  const getFrequencyBadgeColor = (freq: string) => {
    switch (freq) {
      case 'hourly': return 'bg-red-500/20 text-red-400';
      case 'daily': return 'bg-blue-500/20 text-blue-400';
      case 'weekly': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Scheduled Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Scheduled Discovery Searches
                <Badge className="bg-blue-500/20 text-blue-400 ml-2">
                  {searches?.filter(s => s.is_active).length || 0} active
                </Badge>
              </CardTitle>
              <CardDescription className="text-blue-200">
                Automatically discover new leads on a recurring schedule
              </CardDescription>
            </div>
            <Button
              className="bg-gradient-to-r from-purple-500 to-blue-500"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Scheduled Search
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!searches || searches.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-400 opacity-50" />
              <p className="text-blue-200">No scheduled searches yet</p>
              <p className="text-sm text-blue-300">Create a recurring search to automatically discover new leads</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searches.map((search) => (
                <div
                  key={search.id}
                  className={`p-4 bg-white/5 rounded-lg border transition-colors ${
                    search.is_active ? 'border-blue-400/30' : 'border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white">{search.search_name}</h4>
                        <Badge className={getFrequencyBadgeColor(search.frequency)}>
                          <Clock className="w-3 h-3 mr-1" />
                          {search.frequency}
                        </Badge>
                        {!search.is_active && (
                          <Badge className="bg-gray-500/20 text-gray-400">Paused</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-blue-200 mb-2">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        "{search.query}"
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-blue-300">
                        {search.category && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {search.category}
                          </span>
                        )}
                        {search.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {search.location}
                          </span>
                        )}
                        <span className="text-green-400">
                          {search.leads_found_total} leads found total
                        </span>
                        {search.last_run_at && (
                          <span>
                            Last run: {new Date(search.last_run_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={search.is_active}
                        onCheckedChange={(checked) => 
                          toggleActiveMutation.mutate({ id: search.id, isActive: checked })
                        }
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                        onClick={() => runNowMutation.mutate(search)}
                        disabled={runNowMutation.isPending}
                      >
                        {runNowMutation.isPending ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        onClick={() => deleteSearchMutation.mutate(search.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Create Scheduled Search
            </DialogTitle>
            <DialogDescription className="text-blue-200">
              Set up recurring AI discovery to automatically find new leads
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Search Name</Label>
              <Input
                value={newSearch.search_name}
                onChange={(e) => setNewSearch(prev => ({ ...prev, search_name: e.target.value }))}
                placeholder="e.g., Atlanta Caterers Weekly"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Search Query</Label>
              <Input
                value={newSearch.query}
                onChange={(e) => setNewSearch(prev => ({ ...prev, query: e.target.value }))}
                placeholder="e.g., catering services, IT consulting..."
                className="bg-white/5 border-white/20 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-blue-200">Category (optional)</Label>
                <Input
                  value={newSearch.category}
                  onChange={(e) => setNewSearch(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Food & Beverage"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-blue-200">Location (optional)</Label>
                <Input
                  value={newSearch.location}
                  onChange={(e) => setNewSearch(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Atlanta, GA"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Frequency</Label>
              <Select
                value={newSearch.frequency}
                onValueChange={(value) => setNewSearch(prev => ({ ...prev, frequency: value }))}
              >
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily (6 AM)</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              className="border-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={() => createSearchMutation.mutate(newSearch)}
              disabled={!newSearch.search_name || !newSearch.query || createSearchMutation.isPending}
              className="bg-gradient-to-r from-purple-500 to-blue-500"
            >
              {createSearchMutation.isPending ? 'Creating...' : 'Create Schedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
