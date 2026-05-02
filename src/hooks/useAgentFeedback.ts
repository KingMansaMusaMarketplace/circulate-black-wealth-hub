import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AgentFeedbackPayload {
  agentName: string;
  decisionType: string;
  decisionPayload: Record<string, unknown>;
  businessId?: string;
  rating: 1 | -1; // thumbs up = 1, thumbs down = -1
  feedbackText?: string;
  modelUsed?: string;
}

/**
 * Wraps an insert into ai_agent_feedback for any Kayla output.
 * Returns { submit, submitting, submitted } to drive thumbs UI.
 */
export function useAgentFeedback() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<1 | -1 | null>(null);

  const submit = async (p: AgentFeedbackPayload) => {
    setSubmitting(true);
    setSubmitted(p.rating); // optimistic
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      const { error } = await supabase.from('ai_agent_feedback').insert({
        agent_name: p.agentName,
        decision_type: p.decisionType,
        decision_payload: p.decisionPayload as any,
        business_id: p.businessId ?? null,
        user_id: userId ?? null,
        rating: p.rating,
        feedback_text: p.feedbackText ?? null,
        model_used: p.modelUsed ?? null,
      });
      if (error) throw error;
      toast.success(p.rating === 1 ? 'Thanks — Kayla learns from this.' : 'Got it. Kayla will adjust.');
    } catch (err: any) {
      setSubmitted(null); // rollback
      toast.error(err.message || 'Could not save feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, submitting, submitted };
}
