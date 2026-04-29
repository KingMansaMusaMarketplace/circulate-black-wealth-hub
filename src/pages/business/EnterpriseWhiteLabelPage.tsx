import { useState, useEffect } from 'react';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { useWhiteLabel } from '@/hooks/use-white-label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Palette, Key, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function EnterpriseWhiteLabelPage() {
  const { profile, loading: profileLoading } = useBusinessProfile();
  const { config, apiKey, loading, updateConfig, generateApiKey } = useWhiteLabel(profile?.id || '');

  const [form, setForm] = useState({
    subdomain: '',
    custom_domain: '',
    primary_color: '0 51 102',
    secondary_color: '210 11 15',
    accent_color: '45 100 50',
    logo_url: '',
    favicon_url: '',
    branding_enabled: false,
  });

  useEffect(() => {
    if (config) {
      setForm({
        subdomain: config.subdomain ?? '',
        custom_domain: config.custom_domain ?? '',
        primary_color: config.primary_color,
        secondary_color: config.secondary_color,
        accent_color: config.accent_color,
        logo_url: config.logo_url ?? '',
        favicon_url: config.favicon_url ?? '',
        branding_enabled: config.branding_enabled,
      });
    }
  }, [config]);

  const handleSave = async () => {
    await updateConfig(form);
  };

  const copyKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied');
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] text-white">
      <Helmet>
        <title>White-Label Settings — Kayla AI Enterprise</title>
        <meta name="description" content="Configure your white-label branding, custom domain, and API access with Kayla AI Enterprise." />
      </Helmet>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <Link to="/business/dashboard">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#003366] to-[#FFB300] flex items-center justify-center">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">White-Label Settings</h1>
            <p className="text-sm text-slate-400">Enterprise feature — branding, custom domains, and API access</p>
          </div>
        </div>

        {profileLoading || loading ? (
          <Card className="bg-white/5 border-white/10"><CardContent className="p-6 text-slate-300">Loading…</CardContent></Card>
        ) : !profile ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-slate-300">
              You need a business profile first.
              <Link to="/business/register" className="ml-2 text-amber-300 underline">Create one</Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Branding</CardTitle>
                <CardDescription className="text-slate-400">Customize colors, logo, and domain.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-200">Branding enabled</Label>
                  <Switch
                    checked={form.branding_enabled}
                    onCheckedChange={(v) => setForm({ ...form, branding_enabled: v })}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-200">Subdomain</Label>
                    <Input value={form.subdomain} onChange={(e) => setForm({ ...form, subdomain: e.target.value })} placeholder="yourbrand" />
                  </div>
                  <div>
                    <Label className="text-slate-200">Custom domain</Label>
                    <Input value={form.custom_domain} onChange={(e) => setForm({ ...form, custom_domain: e.target.value })} placeholder="app.yourbrand.com" />
                  </div>
                  <div>
                    <Label className="text-slate-200">Logo URL</Label>
                    <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-slate-200">Favicon URL</Label>
                    <Input value={form.favicon_url} onChange={(e) => setForm({ ...form, favicon_url: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-slate-200">Primary color (HSL)</Label>
                    <Input value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} placeholder="0 51 102" />
                  </div>
                  <div>
                    <Label className="text-slate-200">Accent color (HSL)</Label>
                    <Input value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} placeholder="45 100 50" />
                  </div>
                </div>
                <Button onClick={handleSave} className="bg-gradient-to-r from-[#003366] to-[#FFB300] text-white">
                  Save Branding
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2"><Key className="h-4 w-4" /> API Access</CardTitle>
                <CardDescription className="text-slate-400">Generate API keys for custom integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={generateApiKey} variant="outline" className="border-white/20 text-slate-200 hover:bg-white/10">
                  Generate New API Key
                </Button>
                {apiKey && (
                  <div className="p-3 rounded bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                    <code className="text-xs text-amber-300 break-all">{apiKey}</code>
                    <Button size="sm" variant="ghost" onClick={copyKey}><Copy className="h-4 w-4" /></Button>
                  </div>
                )}
                <p className="text-xs text-slate-500">Copy now — the key will not be shown again.</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
