import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Copy, Plus } from 'lucide-react';

export default function APIClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [orgName, setOrgName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [tier, setTier] = useState('starter');
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from('developer_accounts')
      .select('*')
      .order('created_at', { ascending: false });
    setClients(data || []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!orgName || !contactEmail) { toast.error('Fill all fields'); return; }
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('provision-api-client', {
        body: { orgName, contactEmail, tier },
      });
      if (error || !data?.success) throw new Error(data?.error || error?.message);
      setNewKey(data.api_key);
      setOrgName(''); setContactEmail('');
      await load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <Helmet><title>API Clients | Admin</title></Helmet>
      <h1 className="text-3xl font-bold mb-8">Institutional API Clients</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Provision new client</CardTitle>
          <CardDescription>Generates a one-time API key — copy and send securely.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Organization</Label>
              <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Acme Bank" />
            </div>
            <div>
              <Label>Contact email</Label>
              <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
            <div>
              <Label>Tier</Label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter ($99 / 1k)</SelectItem>
                  <SelectItem value="pro">Pro ($499 / 10k)</SelectItem>
                  <SelectItem value="enterprise">Enterprise ($999 / 100k)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={create} disabled={creating}><Plus className="mr-2 h-4 w-4" />Create</Button>

          {newKey && (
            <div className="border-2 border-primary rounded-md p-4 bg-primary/5">
              <div className="font-bold mb-2">⚠️ Copy this key now — it won't be shown again.</div>
              <div className="flex items-center gap-2">
                <code className="bg-background p-2 rounded text-sm flex-1 break-all">{newKey}</code>
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(newKey); toast.success('Copied'); }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button size="sm" variant="ghost" className="mt-2" onClick={() => setNewKey(null)}>Dismiss</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Active clients</h2>
      <div className="space-y-2">
        {clients.map((c) => (
          <Card key={c.id}>
            <CardContent className="py-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{c.company_name}</div>
                <div className="text-sm text-muted-foreground">Quota: {c.monthly_cmal_limit}/mo</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{c.tier}</Badge>
                <Badge variant={c.status === 'active' ? 'default' : 'secondary'}>{c.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {clients.length === 0 && <p className="text-muted-foreground">No clients yet.</p>}
      </div>
    </div>
  );
}
