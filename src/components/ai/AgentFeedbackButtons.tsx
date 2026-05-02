import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAgentFeedback, AgentFeedbackPayload } from '@/hooks/useAgentFeedback';
import { cn } from '@/lib/utils';

interface Props extends Omit<AgentFeedbackPayload, 'rating' | 'feedbackText'> {
  className?: string;
  compact?: boolean;
}

/**
 * Reusable thumbs-up/down control for any Kayla AI output.
 * On thumbs-down, reveals an optional one-line "what was wrong?" textarea.
 */
export const AgentFeedbackButtons: React.FC<Props> = ({ className, compact, ...payload }) => {
  const { submit, submitting, submitted } = useAgentFeedback();
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');

  const handleUp = () => submit({ ...payload, rating: 1 });
  const handleDown = () => {
    if (!showComment && submitted !== -1) {
      setShowComment(true);
      return;
    }
    submit({ ...payload, rating: -1, feedbackText: comment || undefined });
    setShowComment(false);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-1">
        <span className={cn('text-white/40 mr-1', compact ? 'text-[10px]' : 'text-xs')}>Helpful?</span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={submitting || submitted === 1}
          onClick={handleUp}
          className={cn(
            'h-7 w-7 p-0',
            submitted === 1 ? 'text-emerald-400' : 'text-white/40 hover:text-emerald-400'
          )}
          aria-label="Mark helpful"
        >
          {submitting && submitted === 1 ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ThumbsUp className="h-3.5 w-3.5" />}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={submitting || submitted === -1}
          onClick={handleDown}
          className={cn(
            'h-7 w-7 p-0',
            submitted === -1 ? 'text-red-400' : 'text-white/40 hover:text-red-400'
          )}
          aria-label="Mark not helpful"
        >
          {submitting && submitted === -1 ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ThumbsDown className="h-3.5 w-3.5" />}
        </Button>
      </div>
      {showComment && submitted !== -1 && (
        <div className="flex gap-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What was off? (optional)"
            rows={2}
            className="text-xs bg-slate-900/40 border-white/10"
          />
          <Button size="sm" onClick={handleDown} disabled={submitting} className="self-end">
            Send
          </Button>
        </div>
      )}
    </div>
  );
};
