import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  FileText,
  Plus,
  Send,
  Trash2,
  Edit3,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Newspaper,
  Quote,
} from 'lucide-react';

interface PressRelease {
  id: string;
  title: string;
  subtitle: string | null;
  body: string;
  quote: string | null;
  quote_attribution: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  status: string;
  review_notes: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  subscriptionId: string;
  companyName: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  draft: { label: 'Draft', icon: <Edit3 className="h-3 w-3" />, color: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30' },
  pending_review: { label: 'Pending Review', icon: <Clock className="h-3 w-3" />, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  approved: { label: 'Approved', icon: <CheckCircle className="h-3 w-3" />, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  published: { label: 'Published', icon: <Newspaper className="h-3 w-3" />, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  rejected: { label: 'Rejected', icon: <XCircle className="h-3 w-3" />, color: 'bg-red-500/20 text-red-300 border-red-500/30' },
};

const pressReleaseTemplate = (companyName: string) => ({
  title: `${companyName} Partners with 1325.AI to Strengthen Black-Owned Business Ecosystem`,
  subtitle: `Corporate partnership aims to drive economic impact in underserved communities`,
  body: `[CITY, STATE] — ${companyName} today announced a strategic partnership with 1325.AI, a pioneering technology platform dedicated to strengthening Black-owned businesses through patent-pending economic circulation technology.

Through this corporate sponsorship, ${companyName} will support verified Black-owned businesses by increasing their visibility, providing access to a broader customer base, and contributing to sustainable economic growth within the community.

\"We are proud to partner with 1325.AI and support their mission of creating a thriving ecosystem for Black-owned businesses,\" said [SPOKESPERSON NAME], [TITLE] at ${companyName}. \"This partnership reflects our commitment to diversity, equity, and economic empowerment.\"

The 1325.AI platform uses proprietary technology (U.S. Patent Pending 63/969,202) to facilitate economic circulation within community networks, enabling businesses to grow through verified connections, smart recommendations, and data-driven insights.

About ${companyName}:
[INSERT COMPANY BOILERPLATE]

About 1325.AI:
1325.AI is a technology platform that strengthens economic ecosystems for Black-owned businesses through patent-pending circulation technology, AI-powered recommendations, and community-driven growth tools.`,
  quote: `"This partnership represents a meaningful step toward building more equitable economic systems."`,
  quote_attribution: `[SPOKESPERSON NAME], [TITLE], ${companyName}`,
});

export const PressReleasePRSupport: React.FC<Props> = ({
  subscriptionId,
  companyName,
  className,
}) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    body: '',
    quote: '',
    quote_attribution: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
  });

  const { data: releases = [], isLoading } = useQuery({
    queryKey: ['sponsor-press-releases', subscriptionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsor_press_releases')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PressRelease[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (status: string) => {
      const payload = { ...form, subscription_id: subscriptionId, status };
      if (editingId) {
        const { error } = await supabase
          .from('sponsor_press_releases')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sponsor_press_releases')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-press-releases', subscriptionId] });
      toast.success(status === 'pending_review' ? 'Press release submitted for review!' : 'Draft saved!');
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sponsor_press_releases').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-press-releases', subscriptionId] });
      toast.success('Draft deleted');
    },
  });

  const resetForm = () => {
    setForm({ title: '', subtitle: '', body: '', quote: '', quote_attribution: '', contact_name: '', contact_email: '', contact_phone: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  const loadTemplate = () => {
    const t = pressReleaseTemplate(companyName);
    setForm(prev => ({ ...prev, title: t.title, subtitle: t.subtitle, body: t.body, quote: t.quote, quote_attribution: t.quote_attribution }));
  };

  const editRelease = (r: PressRelease) => {
    setForm({
      title: r.title,
      subtitle: r.subtitle || '',
      body: r.body,
      quote: r.quote || '',
      quote_attribution: r.quote_attribution || '',
      contact_name: r.contact_name || '',
      contact_email: r.contact_email || '',
      contact_phone: r.contact_phone || '',
    });
    setEditingId(r.id);
    setIsEditing(true);
  };

  return (
    <Card className={cn('border', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20">
              <FileText className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-amber-100">Press Release & PR Support</CardTitle>
              <CardDescription className="text-blue-200/70">
                Draft press releases for your partnership — Platinum exclusive
              </CardDescription>
            </div>
          </div>
          {!isEditing && (
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 gap-1"
            >
              <Plus className="h-4 w-4" /> New Release
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isEditing && (
          <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-amber-200">
                {editingId ? 'Edit Press Release' : 'New Press Release'}
              </h3>
              <Button size="sm" variant="ghost" onClick={loadTemplate} className="text-amber-400 hover:text-amber-300 gap-1 text-xs">
                <Sparkles className="h-3 w-3" /> Use Template
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-blue-200/80 text-xs">Headline</Label>
                <Input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Press release headline..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div>
                <Label className="text-blue-200/80 text-xs">Subtitle</Label>
                <Input
                  value={form.subtitle}
                  onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  placeholder="Optional subtitle..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div>
                <Label className="text-blue-200/80 text-xs">Body</Label>
                <Textarea
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder="Full press release body..."
                  rows={10}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-mono text-xs"
                />
              </div>

              <Separator className="bg-white/10" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-blue-200/80 text-xs flex items-center gap-1">
                    <Quote className="h-3 w-3" /> Pull Quote
                  </Label>
                  <Textarea
                    value={form.quote}
                    onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
                    placeholder='"We are proud to..."'
                    rows={3}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 italic"
                  />
                </div>
                <div>
                  <Label className="text-blue-200/80 text-xs">Quote Attribution</Label>
                  <Input
                    value={form.quote_attribution}
                    onChange={e => setForm(f => ({ ...f, quote_attribution: e.target.value }))}
                    placeholder="Name, Title, Company"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              <Separator className="bg-white/10" />
              <p className="text-xs text-blue-200/50">Media Contact (optional)</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-blue-200/80 text-xs">Name</Label>
                  <Input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div>
                  <Label className="text-blue-200/80 text-xs">Email</Label>
                  <Input value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div>
                  <Label className="text-blue-200/80 text-xs">Phone</Label>
                  <Input value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={resetForm} className="text-blue-200/60">
                Cancel
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => saveMutation.mutate('draft')}
                disabled={!form.title || !form.body || saveMutation.isPending}
                className="border-white/20 text-blue-100 hover:bg-white/10 gap-1"
              >
                <Edit3 className="h-3 w-3" /> Save Draft
              </Button>
              <Button
                size="sm"
                onClick={() => saveMutation.mutate('pending_review')}
                disabled={!form.title || !form.body || saveMutation.isPending}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold hover:from-amber-400 hover:to-yellow-500 gap-1"
              >
                <Send className="h-3 w-3" /> Submit for Review
              </Button>
            </div>
          </div>
        )}

        {/* Existing releases list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : releases.length === 0 && !isEditing ? (
          <div className="text-center py-8 text-blue-200/50">
            <Newspaper className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No press releases yet</p>
            <p className="text-xs mt-1">Create your first press release to amplify your partnership</p>
          </div>
        ) : (
          <div className="space-y-3">
            {releases.map(r => {
              const sc = statusConfig[r.status] || statusConfig.draft;
              return (
                <div
                  key={r.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-amber-100 truncate">{r.title}</h4>
                        <Badge variant="outline" className={cn('text-[10px] gap-1 shrink-0', sc.color)}>
                          {sc.icon} {sc.label}
                        </Badge>
                      </div>
                      {r.subtitle && (
                        <p className="text-xs text-blue-200/60 truncate">{r.subtitle}</p>
                      )}
                      <p className="text-xs text-blue-200/40 mt-1">
                        {new Date(r.created_at).toLocaleDateString()}
                        {r.published_at && ` • Published ${new Date(r.published_at).toLocaleDateString()}`}
                      </p>
                      {r.review_notes && r.status === 'rejected' && (
                        <p className="text-xs text-red-300/80 mt-2 p-2 rounded bg-red-500/10 border border-red-500/20">
                          Reviewer notes: {r.review_notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {(r.status === 'draft' || r.status === 'rejected') && (
                        <Button size="icon" variant="ghost" onClick={() => editRelease(r)} className="h-8 w-8 text-blue-200/60 hover:text-amber-300">
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {r.status === 'draft' && (
                        <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(r.id)} className="h-8 w-8 text-blue-200/60 hover:text-red-400">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
