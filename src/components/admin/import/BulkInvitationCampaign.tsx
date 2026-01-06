import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Users, Calendar, Target, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useBusinessImport } from '@/hooks/use-business-import';
import { toast } from 'sonner';

interface BulkInvitationCampaignProps {
  onClose: () => void;
}

export const BulkInvitationCampaign: React.FC<BulkInvitationCampaignProps> = ({ onClose }) => {
  const { templates, createCampaign, creatingCampaign, leadStats } = useBusinessImport();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template_id: '',
    target_states: [] as string[],
    target_cities: [] as string[],
    target_categories: [] as string[],
    scheduled_at: '',
    exclude_previously_invited: true,
  });

  const [stateInput, setStateInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');

  const handleAddState = () => {
    if (stateInput && !formData.target_states.includes(stateInput)) {
      setFormData(prev => ({
        ...prev,
        target_states: [...prev.target_states, stateInput],
      }));
      setStateInput('');
    }
  };

  const handleAddCity = () => {
    if (cityInput && !formData.target_cities.includes(cityInput)) {
      setFormData(prev => ({
        ...prev,
        target_cities: [...prev.target_cities, cityInput],
      }));
      setCityInput('');
    }
  };

  const handleAddCategory = () => {
    if (categoryInput && !formData.target_categories.includes(categoryInput)) {
      setFormData(prev => ({
        ...prev,
        target_categories: [...prev.target_categories, categoryInput],
      }));
      setCategoryInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Campaign name is required');
      return;
    }
    if (!formData.template_id) {
      toast.error('Please select an email template');
      return;
    }

    createCampaign({
      name: formData.name,
      description: formData.description,
      template_id: formData.template_id,
      target_states: formData.target_states.length > 0 ? formData.target_states : undefined,
      target_cities: formData.target_cities.length > 0 ? formData.target_cities : undefined,
      target_categories: formData.target_categories.length > 0 ? formData.target_categories : undefined,
      scheduled_at: formData.scheduled_at || undefined,
    }, {
      onSuccess: () => onClose(),
    });
  };

  const estimatedTargets = leadStats?.not_sent || 0;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-slate-900 border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-400" />
            Create Outreach Campaign
          </DialogTitle>
          <DialogDescription className="text-blue-200">
            Send bulk invitation emails to businesses in your leads database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Info */}
          <div className="space-y-4">
            <div>
              <Label className="text-blue-200">Campaign Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., January 2026 Launch Campaign"
                className="bg-white/5 border-white/20"
              />
            </div>

            <div>
              <Label className="text-blue-200">Description (optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Internal notes about this campaign"
                className="bg-white/5 border-white/20"
                rows={2}
              />
            </div>

            <div>
              <Label className="text-blue-200">Email Template</Label>
              <Select
                value={formData.template_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, template_id: value }))}
              >
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} {template.is_default && '(Default)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Targeting */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="font-medium text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              Target Audience
            </h4>

            {/* States */}
            <div>
              <Label className="text-blue-200 text-sm">Filter by States</Label>
              <div className="flex gap-2">
                <Input
                  value={stateInput}
                  onChange={(e) => setStateInput(e.target.value.toUpperCase())}
                  placeholder="e.g., CA, NY, TX"
                  className="bg-white/5 border-white/20"
                  maxLength={2}
                />
                <Button type="button" variant="outline" onClick={handleAddState} className="border-white/20">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.target_states.map((state) => (
                  <Badge 
                    key={state} 
                    variant="secondary" 
                    className="bg-blue-500/20 text-blue-300 cursor-pointer"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      target_states: prev.target_states.filter(s => s !== state),
                    }))}
                  >
                    {state} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cities */}
            <div>
              <Label className="text-blue-200 text-sm">Filter by Cities</Label>
              <div className="flex gap-2">
                <Input
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="e.g., Los Angeles, New York"
                  className="bg-white/5 border-white/20"
                />
                <Button type="button" variant="outline" onClick={handleAddCity} className="border-white/20">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.target_cities.map((city) => (
                  <Badge 
                    key={city} 
                    variant="secondary" 
                    className="bg-purple-500/20 text-purple-300 cursor-pointer"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      target_cities: prev.target_cities.filter(c => c !== city),
                    }))}
                  >
                    {city} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <Label className="text-blue-200 text-sm">Filter by Categories</Label>
              <div className="flex gap-2">
                <Input
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="e.g., Restaurant, Retail"
                  className="bg-white/5 border-white/20"
                />
                <Button type="button" variant="outline" onClick={handleAddCategory} className="border-white/20">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.target_categories.map((category) => (
                  <Badge 
                    key={category} 
                    variant="secondary" 
                    className="bg-green-500/20 text-green-300 cursor-pointer"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      target_categories: prev.target_categories.filter(c => c !== category),
                    }))}
                  >
                    {category} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="font-medium text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-yellow-400" />
              Settings
            </h4>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-blue-200">Exclude Previously Invited</Label>
                <p className="text-xs text-blue-300">Skip businesses that have already received invitations</p>
              </div>
              <Switch
                checked={formData.exclude_previously_invited}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, exclude_previously_invited: checked }))}
              />
            </div>

            <div>
              <Label className="text-blue-200">Schedule Send (optional)</Label>
              <Input
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                className="bg-white/5 border-white/20"
              />
              <p className="text-xs text-blue-300 mt-1">Leave empty to start immediately after creation</p>
            </div>
          </div>

          {/* Estimated Reach */}
          <div className="p-4 bg-purple-500/10 border border-purple-400/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-purple-200">Estimated Reach</span>
              </div>
              <span className="text-2xl font-bold text-white">
                ~{estimatedTargets.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-purple-300 mt-1">
              Based on leads that haven't been contacted yet
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose} className="border-white/20">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creatingCampaign}
              className="bg-gradient-to-r from-purple-500 to-blue-500"
            >
              <Send className="w-4 h-4 mr-2" />
              {creatingCampaign ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
