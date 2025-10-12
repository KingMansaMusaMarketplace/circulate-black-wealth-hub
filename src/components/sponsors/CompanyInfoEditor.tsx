import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Building, Globe, Image, Loader2 } from 'lucide-react';

interface CompanyInfoEditorProps {
  subscription: {
    id: string;
    company_name: string;
    logo_url: string | null;
    website_url: string | null;
  };
}

export const CompanyInfoEditor = ({ subscription }: CompanyInfoEditorProps) => {
  const queryClient = useQueryClient();
  const [companyName, setCompanyName] = useState(subscription.company_name);
  const [websiteUrl, setWebsiteUrl] = useState(subscription.website_url || '');
  const [logoUrl, setLogoUrl] = useState(subscription.logo_url || '');

  const updateMutation = useMutation({
    mutationFn: async (updates: { company_name?: string; logo_url?: string; website_url?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-subscription'] });
      toast.success('Company information updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update company information');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      company_name: companyName,
      website_url: websiteUrl,
      logo_url: logoUrl,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>
          Update your company details that will be displayed to users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">
              <Building className="h-4 w-4 inline mr-2" />
              Company Name
            </Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your Company Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website-url">
              <Globe className="h-4 w-4 inline mr-2" />
              Website URL
            </Label>
            <Input
              id="website-url"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourcompany.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo-url">
              <Image className="h-4 w-4 inline mr-2" />
              Logo URL
            </Label>
            <Input
              id="logo-url"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://yourcompany.com/logo.png"
            />
            {logoUrl && (
              <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Logo Preview:</p>
                <img src={logoUrl} alt="Logo preview" className="max-h-20 object-contain" />
              </div>
            )}
          </div>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
