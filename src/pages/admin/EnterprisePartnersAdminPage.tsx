import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Building2, Loader2, Trash2, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAddChapters,
  useAddLeaderSeat,
  useAdminChapters,
  useAdminLeaderSeats,
  useAdminOrgCounts,
  useAdminOrgs,
  useDeleteChapter,
  useRemoveLeaderSeat,
  useToggleLeaderSeat,
  parseChapterRows,
} from '@/hooks/use-enterprise-admin';

const money = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const EnterprisePartnersAdminPage: React.FC = () => {
  const { data: orgs, isLoading: orgsLoading } = useAdminOrgs();
  const [orgId, setOrgId] = useState<string | undefined>(undefined);
  const activeOrgId = orgId ?? orgs?.[0]?.id;
  const org = useMemo(() => orgs?.find((o) => o.id === activeOrgId), [orgs, activeOrgId]);

  const { data: seats, isLoading: seatsLoading } = useAdminLeaderSeats(activeOrgId);
  const { data: chapters, isLoading: chaptersLoading } = useAdminChapters(activeOrgId);
  const { data: counts } = useAdminOrgCounts(activeOrgId);

  const addSeat = useAddLeaderSeat();
  const toggleSeat = useToggleLeaderSeat();
  const removeSeat = useRemoveLeaderSeat();
  const addChapters = useAddChapters();
  const deleteChapter = useDeleteChapter();

  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('National Leader');
  const [displayName, setDisplayName] = useState('');
  const [bulkChapters, setBulkChapters] = useState('');

  const handleAddSeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrgId) return;
    if (!email.includes('@')) {
      toast.error('Enter a valid email address.');
      return;
    }
    addSeat.mutate(
      { orgId: activeOrgId, email, title, displayName },
      {
        onSuccess: () => {
          toast.success('Seat created. It activates the first time they sign in with that email.');
          setEmail('');
          setDisplayName('');
        },
        onError: (err: any) => toast.error(err?.message ?? 'Could not add that seat.'),
      }
    );
  };

  const handleAddChapters = () => {
    if (!activeOrgId) return;
    const rows = parseChapterRows(bulkChapters);
    if (!rows.length) {
      toast.error('Nothing to import. Use one chapter per line: Name, City, State, Email');
      return;
    }
    addChapters.mutate(
      { orgId: activeOrgId, rows },
      {
        onSuccess: (n) => {
          toast.success(`${n} chapter${n === 1 ? '' : 's'} added.`);
          setBulkChapters('');
        },
        onError: (err: any) => toast.error(err?.message ?? 'Import failed.'),
      }
    );
  };

  if (orgsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <Helmet>
        <title>Enterprise Partners — Admin | 1325.AI</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Enterprise Partners</h1>
          <p className="text-sm text-muted-foreground">
            Leadership seats, chapters, and partner reach for organizations like AAMES.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Label className="mb-1 block text-xs">Organization</Label>
          <Select value={activeOrgId} onValueChange={setOrgId}>
            <SelectTrigger>
              <SelectValue placeholder="Select an organization" />
            </SelectTrigger>
            <SelectContent>
              {(orgs ?? []).map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.short_name || o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {org && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Members joined', value: (counts?.members ?? 0).toLocaleString() },
            { label: 'Business owners', value: (counts?.businesses ?? 0).toLocaleString() },
            { label: 'Chapters', value: (chapters?.length ?? 0).toLocaleString() },
            { label: `Share earned (${org.revenue_share_pct}%)`, value: money(counts?.shareCents ?? 0) },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-xl font-bold text-foreground">{s.value}</p>
            </Card>
          ))}
        </div>
      )}

      <Tabs defaultValue="seats">
        <TabsList>
          <TabsTrigger value="seats">
            <Users className="mr-2 h-4 w-4" /> Leadership seats
          </TabsTrigger>
          <TabsTrigger value="chapters">
            <Building2 className="mr-2 h-4 w-4" /> Chapters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seats" className="space-y-4">
          <Card className="p-4">
            <form onSubmit={handleAddSeat} className="grid gap-3 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <Label htmlFor="seat-email">Leader email</Label>
                <Input
                  id="seat-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="leader@amescouts.org"
                />
              </div>
              <div>
                <Label htmlFor="seat-name">Name (optional)</Label>
                <Input
                  id="seat-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label htmlFor="seat-title">Role</Label>
                <Select value={title} onValueChange={setTitle}>
                  <SelectTrigger id="seat-title">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="National Leader">National Leader</SelectItem>
                    <SelectItem value="Chapter Leader">Chapter Leader</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-4">
                <Button type="submit" disabled={addSeat.isPending || !activeOrgId}>
                  {addSeat.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  Add seat
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  The seat activates automatically the first time that person signs in with a
                  confirmed email address matching the one above.
                </p>
              </div>
            </form>
          </Card>

          <Card className="divide-y">
            {seatsLoading && (
              <div className="p-6 text-center text-sm text-muted-foreground">Loading seats…</div>
            )}
            {!seatsLoading && !seats?.length && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No leadership seats yet. Nobody at this organization can open their dashboard until
                you add one.
              </div>
            )}
            {(seats ?? []).map((s) => (
              <div key={s.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {s.display_name || s.invite_email || 'Leader'}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.invite_email} · {s.title}
                  </p>
                </div>
                <Badge variant={s.user_id ? 'default' : 'secondary'}>
                  {s.user_id ? 'Active' : 'Awaiting first sign-in'}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toggleSeat.mutate({ id: s.id, orgId: s.org_id, isActive: !s.is_active })
                  }
                >
                  {s.is_active ? 'Disable' : 'Enable'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeSeat.mutate({ id: s.id, orgId: s.org_id })}
                  aria-label="Remove seat"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="chapters" className="space-y-4">
          <Card className="p-4">
            <Label htmlFor="chapters-bulk">Paste chapters</Label>
            <p className="mb-2 text-xs text-muted-foreground">
              One chapter per line: Name, City, State, Contact email. You can paste straight from a
              spreadsheet.
            </p>
            <Textarea
              id="chapters-bulk"
              rows={6}
              value={bulkChapters}
              onChange={(e) => setBulkChapters(e.target.value)}
              placeholder={'Troop 101, Atlanta, GA, troop101@amescouts.org\nTroop 205, Chicago, IL,'}
            />
            <Button className="mt-3" onClick={handleAddChapters} disabled={addChapters.isPending}>
              {addChapters.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Import chapters
            </Button>
          </Card>

          <Card className="divide-y">
            {chaptersLoading && (
              <div className="p-6 text-center text-sm text-muted-foreground">Loading chapters…</div>
            )}
            {!chaptersLoading && !chapters?.length && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No chapters loaded yet.
              </div>
            )}
            {(chapters ?? []).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[c.city, c.state].filter(Boolean).join(', ') || 'No location'}
                    {c.contact_email ? ` · ${c.contact_email}` : ''}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteChapter.mutate({ id: c.id, orgId: c.org_id })}
                  aria-label="Remove chapter"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterprisePartnersAdminPage;
