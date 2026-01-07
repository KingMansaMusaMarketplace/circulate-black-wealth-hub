import React, { useState } from 'react';
import { X, Plus, Building2, Mail, Phone, Globe, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ManualLeadEntryProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const BUSINESS_CATEGORIES = [
  'Restaurant',
  'Retail',
  'Beauty & Salon',
  'Professional Services',
  'Health & Wellness',
  'Home Services',
  'Automotive',
  'Entertainment',
  'Education',
  'Technology',
  'Construction',
  'Real Estate',
  'Other'
];

export const ManualLeadEntry: React.FC<ManualLeadEntryProps> = ({ onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    owner_name: '',
    owner_email: '',
    phone_number: '',
    website_url: '',
    category: '',
    city: '',
    state: '',
    business_description: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.business_name.trim()) {
      toast.error('Business name is required');
      return;
    }

    if (!formData.owner_email.trim() && !formData.phone_number.trim()) {
      toast.error('Please provide at least an email or phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('b2b_external_leads')
        .insert({
          business_name: formData.business_name.trim(),
          owner_name: formData.owner_name.trim() || null,
          owner_email: formData.owner_email.trim() || null,
          phone_number: formData.phone_number.trim() || null,
          website_url: formData.website_url.trim() || null,
          category: formData.category || null,
          city: formData.city.trim() || null,
          state: formData.state.trim() || null,
          business_description: formData.business_description.trim() || null,
          source_query: 'manual_entry',
          discovered_by_user_id: user?.user?.id || null,
          validation_status: 'pending',
          is_visible_in_directory: true
        });

      if (error) throw error;

      toast.success('Business lead added successfully!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error adding lead:', error);
      toast.error(error.message || 'Failed to add business lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Plus className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Add Business Lead</h2>
              <p className="text-sm text-blue-200">Manually enter business contact info</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Business Name */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Business Name *
            </Label>
            <Input
              value={formData.business_name}
              onChange={(e) => handleChange('business_name', e.target.value)}
              placeholder="e.g., Aura Hair Salon"
              className="bg-white/5 border-white/20 text-white"
              required
            />
          </div>

          {/* Owner Name */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <User className="w-4 h-4" />
              Owner Name
            </Label>
            <Input
              value={formData.owner_name}
              onChange={(e) => handleChange('owner_name', e.target.value)}
              placeholder="e.g., John Smith"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          {/* Email & Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                type="email"
                value={formData.owner_email}
                onChange={(e) => handleChange('owner_email', e.target.value)}
                placeholder="owner@business.com"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </Label>
              <Input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                placeholder="(555) 123-4567"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website
            </Label>
            <Input
              type="url"
              value={formData.website_url}
              onChange={(e) => handleChange('website_url', e.target.value)}
              placeholder="https://www.business.com"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-white">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City & State Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                City
              </Label>
              <Input
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="e.g., Atlanta"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">State</Label>
              <Input
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="e.g., GA"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-white">Description (optional)</Label>
            <Textarea
              value={formData.business_description}
              onChange={(e) => handleChange('business_description', e.target.value)}
              placeholder="Brief description of the business..."
              className="bg-white/5 border-white/20 text-white min-h-[80px]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose} className="border-white/20 text-white">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-emerald-500"
            >
              {isSubmitting ? 'Adding...' : 'Add Lead'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
