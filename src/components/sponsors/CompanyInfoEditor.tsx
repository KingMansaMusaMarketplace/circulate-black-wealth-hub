import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Building, Globe, Image, Loader2, Sparkles } from 'lucide-react';

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
  const { user } = useAuth();
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
      queryClient.invalidateQueries({ queryKey: ['sponsor-subscription', user?.id] });
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
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden relative">
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full" />
      <CardHeader>
        <CardTitle className="text-amber-100 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          Company Information
        </CardTitle>
        <CardDescription className="text-blue-200/70">
          Update your company details that will be displayed to users
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name" className="text-blue-100">
              <Building className="h-4 w-4 inline mr-2" />
              Company Name
            </Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your Company Name"
              required
              className="bg-white/5 border-white/10 text-blue-100 placeholder:text-blue-200/40 focus:border-amber-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website-url" className="text-blue-100">
              <Globe className="h-4 w-4 inline mr-2" />
              Website URL
            </Label>
            <Input
              id="website-url"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourcompany.com"
              className="bg-white/5 border-white/10 text-blue-100 placeholder:text-blue-200/40 focus:border-amber-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo-url" className="text-blue-100">
              <Image className="h-4 w-4 inline mr-2" />
              Logo URL
            </Label>
            <Input
              id="logo-url"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://yourcompany.com/logo.png"
              className="bg-white/5 border-white/10 text-blue-100 placeholder:text-blue-200/40 focus:border-amber-500/50"
            />
            {logoUrl && (
              <div className="mt-2 p-4 border border-white/10 rounded-lg bg-white/5">
                <p className="text-sm text-blue-200/70 mb-2">Logo Preview:</p>
                <img src={logoUrl} alt="Logo preview" className="max-h-20 object-contain" />
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700"
          >
            {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};