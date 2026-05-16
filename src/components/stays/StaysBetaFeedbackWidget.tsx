import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquarePlus, Star } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Floating "Beta Feedback" button shown only to active Mansa Stays beta testers
 * on any /stays/* page.
 */
const StaysBetaFeedbackWidget: React.FC = () => {
  const { user } = useAuth();
  const [isBeta, setIsBeta] = useState(false);
  const [testerId, setTesterId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) { setIsBeta(false); return; }
    (async () => {
      const { data } = await supabase
        .from('stays_beta_testers' as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      if (data) { setIsBeta(true); setTesterId((data as any).id); }
    })();
  }, [user]);

  if (!isBeta) return null;

  const submit = async () => {
    if (!rating && !comment.trim()) { toast.error('Add a rating or comment'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('stays_beta_feedback' as any).insert({
      beta_tester_id: testerId,
      user_id: user!.id,
      rating: rating || null,
      comment: comment.trim() || null,
      page_url: window.location.pathname,
    } as any);
    setSubmitting(false);
    if (error) { toast.error('Could not submit'); console.error(error); return; }
    toast.success('Thanks for the feedback!');
    setOpen(false); setRating(0); setComment('');
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-mansagold text-black hover:bg-mansagold/90 shadow-lg rounded-full px-4 h-12"
        size="sm"
      >
        <MessageSquarePlus className="h-4 w-4 mr-2" />
        Beta Feedback
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Mansa Stays Beta Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-300 mb-2">How's the experience?</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setRating(n)} type="button">
                    <Star className={`h-7 w-7 ${n <= rating ? 'fill-mansagold text-mansagold' : 'text-gray-600'}`} />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="What worked? What broke? Ideas?"
              className="bg-gray-800 border-gray-600 text-white min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">Page: {window.location.pathname}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={submitting} className="bg-mansagold text-black hover:bg-mansagold/90">
              {submitting ? 'Sending...' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StaysBetaFeedbackWidget;
