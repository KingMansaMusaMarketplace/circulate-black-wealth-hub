import React, { useState } from 'react';
import { X, Plus, Building2, Mail, Phone, Globe, MapPin, User, Wand2, Loader2 } from 'lucide-react';
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
  // Food & Beverage
  'Restaurant',
  'Café & Coffee Shop',
  'Bakery',
  'Catering',
  'Food Truck',
  'Bar & Lounge',
  // Beauty & Personal Care
  'Beauty & Salon',
  'Barbershop',
  'Nail Salon',
  'Spa & Massage',
  'Skincare & Esthetics',
  'Braiding & Natural Hair',
  // Retail
  'Retail',
  'Clothing & Apparel',
  'Jewelry & Accessories',
  'Shoe Store',
  'Bookstore',
  'Gift Shop',
  'Art & Crafts',
  'Electronics',
  'Furniture & Home Décor',
  // Professional Services
  'Professional Services',
  'Law Firm',
  'Accounting & Tax',
  'Consulting',
  'Insurance',
  'Marketing & Advertising',
  'IT Services',
  'Web & App Development',
  'Graphic Design',
  'Photography & Video',
  // Health & Wellness
  'Health & Wellness',
  'Fitness & Gym',
  'Yoga & Pilates',
  'Personal Training',
  'Chiropractic',
  'Physical Therapy',
  'Mental Health & Counseling',
  'Nutrition & Dietetics',
  'Medical Practice',
  'Dental Practice',
  'Pharmacy',
  // Home Services
  'Home Services',
  'Cleaning Services',
  'Landscaping & Lawn Care',
  'Plumbing',
  'Electrical',
  'HVAC',
  'Pest Control',
  'Handyman',
  'Interior Design',
  'Moving & Storage',
  // Automotive
  'Automotive',
  'Auto Repair',
  'Auto Detailing',
  'Car Wash',
  'Tire Shop',
  'Auto Sales',
  'Towing',
  // Construction & Trade
  'Construction',
  'General Contractor',
  'Roofing',
  'Painting',
  'Flooring',
  'Masonry',
  'Carpentry',
  'Welding',
  // Real Estate
  'Real Estate',
  'Property Management',
  'Real Estate Agent',
  'Mortgage & Lending',
  'Title & Escrow',
  // Education & Childcare
  'Education',
  'Tutoring',
  'Daycare & Childcare',
  'Music Lessons',
  'Dance Studio',
  'Driving School',
  'Trade School',
  // Entertainment & Events
  'Entertainment',
  'Event Planning',
  'DJ & Music',
  'Party Rentals',
  'Venue & Event Space',
  'Florist',
  'Wedding Services',
  // Technology
  'Technology',
  'Software Development',
  'Tech Support',
  'Data Services',
  'Cybersecurity',
  // Financial Services
  'Financial Services',
  'Banking',
  'Investment & Wealth Management',
  'Credit Repair',
  'Bookkeeping',
  // Transportation & Logistics
  'Transportation',
  'Trucking & Freight',
  'Courier & Delivery',
  'Limousine & Chauffeur',
  'Taxi & Rideshare',
  // Media & Communications
  'Media & Communications',
  'Print & Publishing',
  'Radio & Podcast',
  'Social Media Management',
  'Public Relations',
  // Non-Profit & Community
  'Non-Profit',
  'Church & Religious',
  'Community Organization',
  // Other
  'Agriculture & Farming',
  'Pet Services',
  'Security Services',
  'Dry Cleaning & Laundry',
  'Tailoring & Alterations',
  'Travel & Tourism',
  'Other'
];

interface FormData {
  business_name: string;
  owner_name: string;
  owner_email: string;
  phone_number: string;
  website_url: string;
  category: string;
  city: string;
  state: string;
  business_description: string;
}

export const ManualLeadEntry: React.FC<ManualLeadEntryProps> = ({ onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [showPasteMode, setShowPasteMode] = useState(true);
  const [formData, setFormData] = useState<FormData>({
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

  const handleSmartParse = async () => {
    if (!pasteText.trim()) {
      toast.error('Please paste some text first');
      return;
    }

    setIsParsing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-business-info', {
        body: { text: pasteText }
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        const parsed = data.data;
        setFormData({
          business_name: parsed.business_name || '',
          owner_name: parsed.owner_name || '',
          owner_email: parsed.owner_email || '',
          phone_number: parsed.phone_number || '',
          website_url: parsed.website_url || '',
          category: parsed.category || '',
          city: parsed.city || '',
          state: parsed.state || '',
          business_description: parsed.business_description || ''
        });
        setShowPasteMode(false);
        toast.success('Business info extracted! Review and save.');
      } else {
        toast.error(data?.error || 'Could not extract business info');
      }
    } catch (error: any) {
      console.error('Parse error:', error);
      if (error.message?.includes('429')) {
        toast.error('Rate limit reached. Please try again in a moment.');
      } else if (error.message?.includes('402')) {
        toast.error('AI credits exhausted. Please add funds.');
      } else {
        toast.error('Failed to parse business info');
      }
    } finally {
      setIsParsing(false);
    }
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
              <p className="text-sm text-blue-200">Paste info or enter manually</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Smart Paste Mode */}
          {showPasteMode && (
            <div className="space-y-3 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-purple-300">
                <Wand2 className="w-4 h-4" />
                <span className="font-medium">Smart Paste</span>
              </div>
              <p className="text-sm text-blue-200">
                Copy contact info from a website and paste it below. AI will extract the details automatically.
              </p>
              <Textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={`Paste business info here...

Example:
Aura Hair Salon
Contact: Sarah Johnson
Email: info@aurahair.com
Phone: (404) 555-1234
123 Main Street, Atlanta, GA
www.aurahairsalon.com`}
                className="bg-white/5 border-white/20 text-white min-h-[120px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleSmartParse}
                  disabled={isParsing || !pasteText.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 flex-1"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Extract Info
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasteMode(false)}
                  className="border-white/20 text-white"
                >
                  Manual Entry
                </Button>
              </div>
            </div>
          )}

          {!showPasteMode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPasteMode(true)}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Use Smart Paste
            </Button>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
    </div>
  );
};
