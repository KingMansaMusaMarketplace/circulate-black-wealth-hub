import React, { useState } from 'react';
import { Flag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

interface Props {
  contentType: 'property' | 'property_photo' | 'lease_property';
  contentId: string;
  photoUrl?: string;
  variant?: 'icon' | 'link';
  className?: string;
}

const REASONS = [
  { value: 'sexual', label: 'Sexual or nudity' },
  { value: 'violence', label: 'Violence or weapons' },
  { value: 'hate', label: 'Hate or harassment' },
  { value: 'misleading', label: 'Misleading or fake listing' },
  { value: 'spam', label: 'Spam' },
  { value: 'illegal', label: 'Illegal activity' },
  { value: 'other', label: 'Something else' },
] as const;

const schema = z.object({
  reason: z.enum(['sexual','violence','hate','spam','misleading','illegal','other']),
  details: z.string().trim().max(1000).optional(),
});

const ReportContentButton: React.FC<Props> = ({ contentType, contentId, photoUrl, variant = 'icon', className }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const parsed = schema.safeParse({ reason, details });
    if (!parsed.success) {
      toast.error('Please choose a reason.');
      return;
    }
    setSubmitting(true);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from('content_reports').insert({
      reporter_id: userData.user?.id ?? null,
      reporter_email: userData.user?.email ?? null,
      content_type: contentType,
      content_id: contentId,
      photo_url: photoUrl ?? null,
      reason: parsed.data.reason,
      details: parsed.data.details || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error('Could not submit report: ' + error.message);
      return;
    }
    toast.success('Report submitted. Our team will review it shortly.');
    setOpen(false);
    setReason('');
    setDetails('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'icon' ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`text-white/60 hover:text-red-300 hover:bg-red-500/10 ${className || ''}`}
            title="Report this"
          >
            <Flag className="h-4 w-4 mr-1" /> Report
          </Button>
        ) : (
          <button
            type="button"
            className={`text-xs text-white/50 hover:text-red-300 underline-offset-2 hover:underline inline-flex items-center gap-1 ${className || ''}`}
          >
            <Flag className="h-3 w-3" /> Report
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Report this {contentType === 'property_photo' ? 'photo' : 'listing'}</DialogTitle>
          <DialogDescription className="text-white/60">
            Help us keep the marketplace safe. Reports are reviewed by our team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            {REASONS.map(r => (
              <label key={r.value} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-white/5">
                <input
                  type="radio"
                  name="report-reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={e => setReason(e.target.value)}
                  className="accent-mansagold"
                />
                <span className="text-sm">{r.label}</span>
              </label>
            ))}
          </div>
          <Textarea
            placeholder="Add details (optional)…"
            value={details}
            onChange={e => setDetails(e.target.value)}
            maxLength={1000}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={submit}
            disabled={submitting || !reason}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportContentButton;
