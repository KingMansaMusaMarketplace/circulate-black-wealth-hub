import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, MapPin, Phone, Globe, Clock, Image, 
  CheckCircle, ChevronRight, AlertCircle, Sparkles,
  Eye, EyeOff
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { businessCategories } from '@/data/categories';

interface BusinessSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  fields: string[];
  required: boolean;
}

const SECTIONS: BusinessSection[] = [
  {
    id: 'basic',
    title: 'Basic Info',
    description: 'Category and description',
    icon: Building2,
    fields: ['category', 'description'],
    required: true,
  },
  {
    id: 'location',
    title: 'Location',
    description: 'Full address for map listing',
    icon: MapPin,
    fields: ['address', 'city', 'state', 'zip_code'],
    required: true,
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'Phone and website',
    icon: Phone,
    fields: ['phone', 'website'],
    required: false,
  },
  {
    id: 'hours',
    title: 'Business Hours',
    description: 'When you\'re open',
    icon: Clock,
    fields: ['hours'],
    required: false,
  },
  {
    id: 'media',
    title: 'Photos & Logo',
    description: 'Visual branding',
    icon: Image,
    fields: ['logo_url', 'cover_image'],
    required: false,
  },
];

interface BusinessProfileBuilderProps {
  business: {
    id: string;
    name: string;
    category?: string | null;
    description?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zip_code?: string | null;
    phone?: string | null;
    website?: string | null;
    hours?: any;
    logo_url?: string | null;
    listing_status?: string;
  };
  onUpdate?: () => void;
}

export const BusinessProfileBuilder: React.FC<BusinessProfileBuilderProps> = ({
  business,
  onUpdate,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: business.category || '',
    description: business.description || '',
    address: business.address || '',
    city: business.city || '',
    state: business.state || '',
    zip_code: business.zip_code || '',
    phone: business.phone || '',
    website: business.website || '',
  });

  const categoryOptions = Array.from(
    new Set((businessCategories || []).map(c => c.name).filter(Boolean))
  ).sort();

  // Calculate completion
  const getSectionCompletion = (section: BusinessSection) => {
    const filledFields = section.fields.filter(field => {
      const value = business[field as keyof typeof business];
      return value && value.toString().trim() !== '';
    });
    return Math.round((filledFields.length / section.fields.length) * 100);
  };

  const requiredSections = SECTIONS.filter(s => s.required);
  const requiredComplete = requiredSections.every(s => getSectionCompletion(s) === 100);
  const overallCompletion = Math.round(
    SECTIONS.reduce((sum, s) => sum + getSectionCompletion(s), 0) / SECTIONS.length
  );

  const isLive = requiredComplete;

  const handleSaveSection = async (sectionId: string) => {
    setIsLoading(true);
    try {
      const updates: Record<string, any> = {};
      const section = SECTIONS.find(s => s.id === sectionId);
      
      if (section) {
        section.fields.forEach(field => {
          if (formData[field as keyof typeof formData] !== undefined) {
            updates[field] = formData[field as keyof typeof formData];
          }
        });
      }

      // Check if listing can go live
      if (sectionId === 'basic' || sectionId === 'location') {
        const hasCategory = formData.category || business.category;
        const hasDescription = formData.description || business.description;
        const hasAddress = formData.address || business.address;
        const hasCity = formData.city || business.city;
        
        if (hasCategory && hasDescription && hasAddress && hasCity) {
          updates.listing_status = 'live';
        }
      }

      const { error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', business.id);

      if (error) throw error;

      toast.success('Section saved successfully!');
      
      // Move to next section
      const currentIndex = SECTIONS.findIndex(s => s.id === sectionId);
      if (currentIndex < SECTIONS.length - 1) {
        setExpandedSection(SECTIONS[currentIndex + 1].id);
      } else {
        setExpandedSection(null);
      }
      
      onUpdate?.();
    } catch (err) {
      console.error('Error saving section:', err);
      toast.error('Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <Card className={`border-2 ${isLive ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'}`}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isLive ? (
                <Eye className="w-6 h-6 text-green-600" />
              ) : (
                <EyeOff className="w-6 h-6 text-amber-600" />
              )}
              <div>
                <p className="font-semibold">
                  {isLive ? 'Your listing is LIVE!' : 'Your listing is in DRAFT mode'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isLive 
                    ? 'Customers can now find your business' 
                    : 'Complete Basic Info & Location to go live'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{overallCompletion}%</p>
              <p className="text-xs text-muted-foreground">complete</p>
            </div>
          </div>
          <Progress value={overallCompletion} className="mt-3 h-2" />
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-3">
        {SECTIONS.map((section) => {
          const completion = getSectionCompletion(section);
          const isComplete = completion === 100;
          const isExpanded = expandedSection === section.id;
          const Icon = section.icon;

          return (
            <Card 
              key={section.id}
              className={`transition-all ${isExpanded ? 'ring-2 ring-mansablue' : ''}`}
            >
              <CardHeader 
                className="cursor-pointer py-4"
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isComplete 
                        ? 'bg-green-100 dark:bg-green-900' 
                        : 'bg-muted'
                    }`}>
                      {isComplete ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{section.title}</CardTitle>
                        {section.required && !isComplete && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-sm">{section.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{completion}%</span>
                    <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 pb-4 space-y-4">
                  {section.id === 'basic' && (
                    <>
                      <div className="space-y-2">
                        <Label>Business Category *</Label>
                        <Select 
                          value={formData.category}
                          onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {categoryOptions.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Business Description *</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Tell customers what makes your business special..."
                          rows={4}
                        />
                      </div>
                    </>
                  )}

                  {section.id === 'location' && (
                    <>
                      <div className="space-y-2">
                        <Label>Street Address *</Label>
                        <Input
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label>City *</Label>
                          <Input
                            value={formData.city}
                            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="City"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>State</Label>
                          <Input
                            value={formData.state}
                            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                            placeholder="State"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ZIP Code</Label>
                          <Input
                            value={formData.zip_code}
                            onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                            placeholder="ZIP"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === 'contact' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Website</Label>
                        <Input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://yourbusiness.com"
                        />
                      </div>
                    </div>
                  )}

                  {section.id === 'hours' && (
                    <div className="text-center py-4 text-muted-foreground">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Business hours editor coming soon!</p>
                      <p className="text-sm">For now, include hours in your description.</p>
                    </div>
                  )}

                  {section.id === 'media' && (
                    <div className="text-center py-4 text-muted-foreground">
                      <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Photo upload coming soon!</p>
                      <p className="text-sm">We're working on this feature.</p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleSaveSection(section.id)}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Saving...' : 'Save & Continue'}
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessProfileBuilder;
