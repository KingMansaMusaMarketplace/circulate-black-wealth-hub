import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Save, Loader2 } from 'lucide-react';
import { SponsorSubscription } from '@/hooks/useSponsorSubscription';

interface CompanyInfoEditorProps {
  subscription: SponsorSubscription;
  onUpdate: (updates: { company_name?: string; logo_url?: string; website_url?: string }) => Promise<void>;
  isUpdating: boolean;
}

export const CompanyInfoEditor = ({ subscription, onUpdate, isUpdating }: CompanyInfoEditorProps) => {
  const [companyName, setCompanyName] = useState(subscription.company_name);
  const [logoUrl, setLogoUrl] = useState(subscription.logo_url || '');
  const [websiteUrl, setWebsiteUrl] = useState(subscription.website_url || '');

  const hasChanges =
    companyName !== subscription.company_name ||
    logoUrl !== (subscription.logo_url || '') ||
    websiteUrl !== (subscription.website_url || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: any = {};
    if (companyName !== subscription.company_name) updates.company_name = companyName;
    if (logoUrl !== (subscription.logo_url || '')) updates.logo_url = logoUrl || null;
    if (websiteUrl !== (subscription.website_url || '')) updates.website_url = websiteUrl || null;

    if (Object.keys(updates).length > 0) {
      await onUpdate(updates);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-primary" />
          <div>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update your company details displayed to users</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name *</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your Company Name"
              required
              maxLength={255}
            />
            <p className="text-sm text-muted-foreground">This will be displayed publicly</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo-url">Logo URL</Label>
            <Input
              id="logo-url"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              maxLength={2048}
            />
            <p className="text-sm text-muted-foreground">Direct URL to your company logo image</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website-url">Website URL</Label>
            <Input
              id="website-url"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              maxLength={2048}
            />
            <p className="text-sm text-muted-foreground">Your company website</p>
          </div>

          <Button type="submit" disabled={!hasChanges || isUpdating} className="w-full">
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
