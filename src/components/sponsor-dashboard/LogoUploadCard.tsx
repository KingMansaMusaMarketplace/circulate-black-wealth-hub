import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    <Card className={className}>
      <CardHeader>
        <CardTitle>Branding & Links</CardTitle>
        <CardDescription>
          Upload your company logo and add your website URL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="logo-upload">Company Logo</Label>
          
          {currentLogoUrl && (
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <img
                src={currentLogoUrl}
                alt="Current logo"
                className="h-12 w-auto max-w-[180px] object-contain"
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
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload New Logo'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            PNG or SVG recommended. Max 500KB. Transparent background preferred.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <Label htmlFor="website-url">Website URL</Label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="website-url"
                type="url"
                placeholder="https://yourcompany.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleWebsiteUpdate}
              disabled={saving || websiteUrl === currentWebsiteUrl}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your logo will link to this website across the platform
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
