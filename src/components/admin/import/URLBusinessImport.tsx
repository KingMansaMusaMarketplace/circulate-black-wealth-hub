import React, { useState } from 'react';
import { Globe, Loader2, Save, X, CheckCircle, AlertCircle, Building2, Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExtractedBusinessData {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  category: string;
  website: string;
  logoUrl: string;
  hours: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface URLBusinessImportProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const URLBusinessImport: React.FC<URLBusinessImportProps> = ({ isOpen, onClose, onSuccess }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedBusinessData | null>(null);
  const [editableData, setEditableData] = useState<ExtractedBusinessData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!url.trim()) {
      toast.error('Please enter a website URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedData(null);
    setEditableData(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('scrape-business-website', {
        body: { url: url.trim(), saveAsDraft: false }
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to extract business data');
      }

      setExtractedData(data.data);
      setEditableData(data.data);
      toast.success('Business data extracted! Review and save when ready.');
    } catch (err) {
      console.error('Scrape error:', err);
      const message = err instanceof Error ? err.message : 'Failed to scrape website';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    if (!editableData) return;

    setIsSaving(true);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('scrape-business-website', {
        body: { 
          url: editableData.website, 
          saveAsDraft: true,
          // Pass the edited data
          overrideData: editableData
        }
      });

      // If we need to save directly, let's do it here instead
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to save');
      }

      const { data: business, error: insertError } = await supabase
        .from('businesses')
        .insert({
          owner_id: user.id,
          name: editableData.name || 'Untitled Business',
          business_name: editableData.name || 'Untitled Business',
          description: editableData.description,
          phone: editableData.phone,
          email: editableData.email,
          address: editableData.address,
          city: editableData.city,
          state: editableData.state,
          zip_code: editableData.zipCode,
          category: editableData.category || 'Other',
          website: editableData.website,
          logo_url: editableData.logoUrl,
          listing_status: 'draft',
          is_verified: false,
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast.success('Business saved as draft! Review in your business list.');
      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error('Save error:', err);
      const message = err instanceof Error ? err.message : 'Failed to save business';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setExtractedData(null);
    setEditableData(null);
    setError(null);
    onClose();
  };

  const updateField = (field: keyof ExtractedBusinessData, value: string) => {
    if (!editableData) return;
    setEditableData({ ...editableData, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Import Business from Website
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* URL Input */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label className="text-blue-200 mb-2 block">Website URL</Label>
                  <Input
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleScrape}
                    disabled={isLoading || !url.trim()}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        Extract Data
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-blue-300 mt-2">
                We'll scrape the website and use AI to extract business information automatically.
              </p>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-12">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                  <div className="text-center">
                    <p className="text-white font-medium">Analyzing website...</p>
                    <p className="text-sm text-blue-200">This may take 10-30 seconds</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Extracted Data Preview */}
          {editableData && !isLoading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Extracted Data
                </h3>
                <Badge className="bg-yellow-500/20 text-yellow-300">Review & Edit</Badge>
              </div>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-6 space-y-4">
                  {/* Business Name */}
                  <div className="grid gap-2">
                    <Label className="text-blue-200 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Business Name
                    </Label>
                    <Input
                      value={editableData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  {/* Description */}
                  <div className="grid gap-2">
                    <Label className="text-blue-200">Description</Label>
                    <Textarea
                      value={editableData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      className="bg-white/10 border-white/20 text-white min-h-[80px]"
                    />
                  </div>

                  {/* Category */}
                  <div className="grid gap-2">
                    <Label className="text-blue-200">Category</Label>
                    <Input
                      value={editableData.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  {/* Contact Info Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-blue-200 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </Label>
                      <Input
                        value={editableData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-blue-200 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        value={editableData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="grid gap-2">
                    <Label className="text-blue-200 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Street Address
                    </Label>
                    <Input
                      value={editableData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-blue-200">City</Label>
                      <Input
                        value={editableData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-blue-200">State</Label>
                      <Input
                        value={editableData.state}
                        onChange={(e) => updateField('state', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-blue-200">ZIP Code</Label>
                      <Input
                        value={editableData.zipCode}
                        onChange={(e) => updateField('zipCode', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div className="grid gap-2">
                    <Label className="text-blue-200 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Website
                    </Label>
                    <Input
                      value={editableData.website}
                      onChange={(e) => updateField('website', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  {/* Hours if available */}
                  {editableData.hours && (
                    <div className="grid gap-2">
                      <Label className="text-blue-200 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Hours
                      </Label>
                      <Input
                        value={editableData.hours}
                        onChange={(e) => updateField('hours', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  )}

                  {/* Logo URL */}
                  <div className="grid gap-2">
                    <Label className="text-blue-200">Logo URL</Label>
                    <Input
                      value={editableData.logoUrl}
                      onChange={(e) => updateField('logoUrl', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="https://..."
                    />
                    {editableData.logoUrl && (
                      <div className="mt-2">
                        <img 
                          src={editableData.logoUrl} 
                          alt="Business logo preview" 
                          className="h-16 w-auto rounded-lg border border-white/10"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="border-white/20 text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveAsDraft}
                  disabled={isSaving || !editableData.name}
                  className="bg-gradient-to-r from-green-500 to-emerald-500"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save as Draft
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default URLBusinessImport;
