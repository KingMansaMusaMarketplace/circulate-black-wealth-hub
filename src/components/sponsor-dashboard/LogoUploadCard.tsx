import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, ExternalLink, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LogoUploadCardProps {
  subscriptionId: string;
  currentLogoUrl?: string;
  currentWebsiteUrl?: string;
  onUpdate: () => void;
  className?: string;
}

export const LogoUploadCard: React.FC<LogoUploadCardProps> = ({
  subscriptionId,
  currentLogoUrl,
  currentWebsiteUrl,
  onUpdate,
  className,
}) => {
  const [uploading, setUploading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState(currentWebsiteUrl || '');
  const [saving, setSaving] = useState(false);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 500 * 1024) {
      toast.error('File size must be less than 500KB');
      return;
    }

    setUploading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${subscriptionId}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('sponsor-logos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('sponsor-logos')
        .getPublicUrl(filePath);

      // Update subscription record
      const { error: updateError } = await supabase
        .from('corporate_subscriptions')
        .update({ logo_url: urlData.publicUrl })
        .eq('id', subscriptionId);

      if (updateError) throw updateError;

      toast.success('Logo uploaded successfully!');
      onUpdate();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload logo: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleWebsiteUpdate = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('corporate_subscriptions')
        .update({ website_url: websiteUrl })
        .eq('id', subscriptionId);

      if (error) throw error;

      toast.success('Website URL updated!');
      onUpdate();
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(`Failed to update: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full" />
      <CardHeader>
        <CardTitle className="text-amber-100 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          Branding & Links
        </CardTitle>
        <CardDescription className="text-blue-200/70">
          Upload your company logo and add your website URL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <div className="space-y-4">
          <Label htmlFor="logo-upload" className="text-blue-100">Company Logo</Label>
          
          {currentLogoUrl && (
            <div className="flex items-center gap-4 p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
              <ImageIcon className="h-8 w-8 text-blue-200/60" />
              <img
                src={currentLogoUrl}
                alt="Current logo"
                className="h-12 w-auto max-w-[180px] object-contain bg-white/10 rounded-lg p-1"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploading}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('logo-upload')?.click()}
              disabled={uploading}
              className="bg-white/5 border-amber-500/30 text-amber-100 hover:bg-white/10 hover:border-amber-400/50"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload New Logo'}
            </Button>
          </div>

          <p className="text-xs text-blue-200/50">
            PNG or SVG recommended. Max 500KB. Transparent background preferred.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <Label htmlFor="website-url" className="text-blue-100">Website URL</Label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-200/60" />
              <Input
                id="website-url"
                type="url"
                placeholder="https://yourcompany.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-blue-100 placeholder:text-blue-200/40 focus:border-amber-500/50"
              />
            </div>
            <Button
              onClick={handleWebsiteUpdate}
              disabled={saving || websiteUrl === currentWebsiteUrl}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700"
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
          <p className="text-xs text-blue-200/50">
            Your logo will link to this website across the platform
          </p>
        </div>
      </CardContent>
    </Card>
  );
};