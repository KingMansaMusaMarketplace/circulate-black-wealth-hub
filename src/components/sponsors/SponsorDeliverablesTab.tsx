import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
  Plus,
  Trash2,
  Repeat,
  ListChecks,
} from 'lucide-react';

interface Deliverable {
  id: string;
  sponsor_id: string;
  tier: string;
  category: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  completed_at: string | null;
  notes: string | null;
  sort_order: number;
  is_recurring: boolean;
  recurrence_interval: string | null;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', icon: Circle, color: 'bg-muted text-muted-foreground' },
  { value: 'in_progress', label: 'In Progress', icon: Clock, color: 'bg-blue-500/10 text-blue-500' },
  { value: 'completed', label: 'Completed', icon: CheckCircle2, color: 'bg-green-500/10 text-green-500' },
  { value: 'skipped', label: 'Skipped', icon: XCircle, color: 'bg-zinc-500/10 text-zinc-400' },
];

const statusMeta = (status: string) =>
  STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];

interface Props {
  sponsorId: string;
  tier: string;
}

export default function SponsorDeliverablesTab({ sponsorId, tier }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('custom');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const { data: deliverables = [], isLoading } = useQuery({
    queryKey: ['sponsor-deliverables', sponsorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsor_deliverables')
        .select('*')
        .eq('sponsor_id', sponsorId)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as Deliverable[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: Record<string, unknown> = { status };
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
        updates.completed_by = user?.id;
      } else {
        updates.completed_at = null;
        updates.completed_by = null;
      }
      const { error } = await supabase
        .from('sponsor_deliverables')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-deliverables', sponsorId] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  const updateNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from('sponsor_deliverables')
        .update({ notes })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-deliverables', sponsorId] });
      toast.success('Notes saved');
    },
  });

  const addDeliverable = useMutation({
    mutationFn: async () => {
      const maxOrder = Math.max(0, ...deliverables.map((d) => d.sort_order));
      const { error } = await supabase.from('sponsor_deliverables').insert({
        sponsor_id: sponsorId,
        tier,
        category: newCategory,
        title: newTitle,
        description: newDescription || null,
        due_date: newDueDate || null,
        sort_order: maxOrder + 10,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-deliverables', sponsorId] });
      toast.success('Deliverable added');
      setAddOpen(false);
      setNewTitle('');
      setNewDescription('');
      setNewDueDate('');
      setNewCategory('custom');
    },
    onError: () => toast.error('Failed to add deliverable'),
  });

  const deleteDeliverable = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sponsor_deliverables')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-deliverables', sponsorId] });
      toast.success('Deliverable removed');
    },
  });

  const grouped = useMemo(() => {
    const map = new Map<string, Deliverable[]>();
    for (const d of deliverables) {
      const key = d.category;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [deliverables]);

  const completedCount = deliverables.filter((d) => d.status === 'completed').length;
  const totalCount = deliverables.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-12 bg-muted rounded" />
        <div className="h-12 bg-muted rounded" />
        <div className="h-12 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header / progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
          <div className="flex items-center gap-3">
            <ListChecks className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base">Benefit Fulfillment</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {completedCount} of {totalCount} delivered ({progress}%)
              </p>
            </div>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add deliverable
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add custom deliverable</DialogTitle>
                <DialogDescription>
                  Track a one-off benefit or service item for this sponsor.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Print branded swag for event"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logo">Logo / Placement</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due date (optional)</Label>
                  <Input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => addDeliverable.mutate()}
                  disabled={!newTitle || addDeliverable.isPending}
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {totalCount === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ListChecks className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No deliverables yet. New sponsors auto-populate based on their tier.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Grouped list */}
      {grouped.map(([category, items]) => (
        <Card key={category}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              {category}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {items.map((d) => {
              const meta = statusMeta(d.status);
              const Icon = meta.icon;
              return (
                <div
                  key={d.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 transition"
                >
                  <Checkbox
                    checked={d.status === 'completed'}
                    onCheckedChange={(checked) =>
                      updateStatus.mutate({
                        id: d.id,
                        status: checked ? 'completed' : 'pending',
                      })
                    }
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-medium ${
                          d.status === 'completed' ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {d.title}
                      </span>
                      {d.is_recurring && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Repeat className="h-3 w-3" />
                          {d.recurrence_interval}
                        </Badge>
                      )}
                      <Badge className={`${meta.color} text-xs gap-1`}>
                        <Icon className="h-3 w-3" />
                        {meta.label}
                      </Badge>
                    </div>
                    {d.description && (
                      <p className="text-xs text-muted-foreground mt-1">{d.description}</p>
                    )}
                    {d.due_date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Due {format(new Date(d.due_date), 'MMM d, yyyy')}
                      </p>
                    )}
                    {d.completed_at && (
                      <p className="text-xs text-green-600 mt-1">
                        Completed {format(new Date(d.completed_at), 'MMM d, yyyy')}
                      </p>
                    )}
                    <Textarea
                      placeholder="Notes…"
                      defaultValue={d.notes ?? ''}
                      onBlur={(e) => {
                        const val = e.target.value;
                        if (val !== (d.notes ?? '')) {
                          updateNotes.mutate({ id: d.id, notes: val });
                        }
                      }}
                      rows={1}
                      className="mt-2 text-xs resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Select
                      value={d.status}
                      onValueChange={(v) => updateStatus.mutate({ id: d.id, status: v })}
                    >
                      <SelectTrigger className="h-7 w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        if (confirm(`Remove "${d.title}"?`)) {
                          deleteDeliverable.mutate(d.id);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
