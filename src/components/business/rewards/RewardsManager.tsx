import React, { useState, useEffect } from 'react';
import { Plus, Gift, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Reward {
  id?: string;
  title: string;
  description: string;
  points_cost: number;
  image_url?: string;
  is_active: boolean;
  business_id?: string;
}

interface RewardsManagerProps {
  businessId: string;
}

const RewardsManager: React.FC<RewardsManagerProps> = ({ businessId }) => {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [formData, setFormData] = useState<Reward>({
    title: '',
    description: '',
    points_cost: 100,
    image_url: '',
    is_active: true,
    business_id: businessId
  });

  useEffect(() => {
    loadRewards();
  }, [businessId]);

  const loadRewards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error loading rewards:', error);
      toast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Reward, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      points_cost: 100,
      image_url: '',
      is_active: true,
      business_id: businessId
    });
    setEditingReward(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingReward) {
        // Update existing reward
        const { error } = await supabase
          .from('rewards')
          .update({
            title: formData.title,
            description: formData.description,
            points_cost: formData.points_cost,
            image_url: formData.image_url,
            is_active: formData.is_active
          })
          .eq('id', editingReward.id);

        if (error) throw error;
        toast.success('Reward updated successfully');
      } else {
        // Create new reward
        const { error } = await supabase
          .from('rewards')
          .insert({
            ...formData,
            business_id: businessId
          });

        if (error) throw error;
        toast.success('Reward created successfully');
      }

      await loadRewards();
      resetForm();
      setIsCreating(false);
    } catch (error: any) {
      console.error('Error saving reward:', error);
      toast.error(error.message || 'Failed to save reward');
    }
  };

  const handleEdit = (reward: Reward) => {
    setFormData({
      title: reward.title,
      description: reward.description,
      points_cost: reward.points_cost,
      image_url: reward.image_url || '',
      is_active: reward.is_active,
      business_id: businessId
    });
    setEditingReward(reward);
    setIsCreating(true);
  };

  const handleDelete = async (rewardId: string) => {
    if (!confirm('Are you sure you want to delete this reward?')) return;

    try {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', rewardId)
        .eq('business_id', businessId); // Extra security

      if (error) throw error;
      
      toast.success('Reward deleted successfully');
      await loadRewards();
    } catch (error: any) {
      console.error('Error deleting reward:', error);
      toast.error(error.message || 'Failed to delete reward');
    }
  };

  const toggleRewardStatus = async (reward: Reward) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .update({ is_active: !reward.is_active })
        .eq('id', reward.id)
        .eq('business_id', businessId);

      if (error) throw error;
      
      toast.success(`Reward ${!reward.is_active ? 'activated' : 'deactivated'}`);
      await loadRewards();
    } catch (error: any) {
      console.error('Error toggling reward status:', error);
      toast.error('Failed to update reward status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Rewards Management</h2>
        <Dialog open={isCreating} onOpenChange={(open) => {
          setIsCreating(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Reward
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingReward ? 'Edit Reward' : 'Create New Reward'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Reward Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., 10% Off Your Next Purchase"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what customers get with this reward..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="points_cost">Points Required *</Label>
                  <Input
                    id="points_cost"
                    type="number"
                    min="1"
                    value={formData.points_cost}
                    onChange={(e) => handleInputChange('points_cost', parseInt(e.target.value) || 100)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="is_active">Status</Label>
                  <select
                    id="is_active"
                    value={formData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => handleInputChange('is_active', e.target.value === 'active')}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="image_url">Image URL (Optional)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  placeholder="https://example.com/reward-image.jpg"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingReward ? 'Update Reward' : 'Create Reward'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rewards List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading rewards...</p>
        </div>
      ) : rewards.length === 0 ? (
        <Alert>
          <Gift className="h-4 w-4" />
          <AlertDescription>
            No rewards created yet. Create your first reward to start attracting customers!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <Card key={reward.id} className="relative">
              {reward.image_url && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={reward.image_url} 
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{reward.title}</CardTitle>
                  <Badge variant={reward.is_active ? 'default' : 'secondary'}>
                    {reward.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {reward.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Gift className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{reward.points_cost} points</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(reward)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRewardStatus(reward)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {reward.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => reward.id && handleDelete(reward.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 Reward Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Start with lower point values (50-200 points) to encourage frequent redemptions</li>
            <li>• Offer a mix of discounts, free items, and exclusive experiences</li>
            <li>• Update your rewards regularly to keep customers engaged</li>
            <li>• Consider seasonal or limited-time rewards to create urgency</li>
            <li>• Track which rewards are most popular and adjust accordingly</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsManager;