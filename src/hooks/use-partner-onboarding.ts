import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const ONBOARDING_STEPS = [
  { id: 'welcome', label: 'Welcome', description: 'Quick intro to the partner program' },
  { id: 'profile', label: 'Complete profile', description: 'Add your details so partners can reach you' },
  { id: 'goals', label: 'Set your goals', description: 'Tell us what you want to achieve' },
  { id: 'resources', label: 'Tour resources', description: 'Marketing kit, embeds, and assets' },
  { id: 'first_link', label: 'Generate your link', description: 'Create your first referral link' },
] as const;

export type StepId = typeof ONBOARDING_STEPS[number]['id'];

export interface OnboardingProgress {
  id: string;
  user_id: string;
  current_step: number;
  steps_completed: string[];
  step_timestamps: Record<string, string>;
  goals: Record<string, unknown>;
  profile_completed: boolean;
  resources_viewed: boolean;
  first_link_generated: boolean;
  completed_at: string | null;
  started_at: string;
}

export const usePartnerOnboarding = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('partner_onboarding_progress')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setProgress(data as unknown as OnboardingProgress);
    } else {
      // Auto-create on first load
      const { data: created } = await supabase
        .from('partner_onboarding_progress')
        .insert({ user_id: user.id, current_step: 1 })
        .select()
        .single();
      if (created) setProgress(created as unknown as OnboardingProgress);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const completeStep = useCallback(async (stepId: StepId, extraFields: Partial<OnboardingProgress> = {}) => {
    if (!progress || !user) return;
    const stepIndex = ONBOARDING_STEPS.findIndex((s) => s.id === stepId);
    const newStepsCompleted = Array.from(new Set([...progress.steps_completed, stepId]));
    const newStepTimestamps = { ...progress.step_timestamps, [stepId]: new Date().toISOString() };
    const allDone = ONBOARDING_STEPS.every((s) => newStepsCompleted.includes(s.id));

    const update: Record<string, unknown> = {
      steps_completed: newStepsCompleted,
      step_timestamps: newStepTimestamps,
      current_step: Math.min(stepIndex + 2, ONBOARDING_STEPS.length),
      ...extraFields,
    };
    if (allDone && !progress.completed_at) update.completed_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('partner_onboarding_progress')
      .update(update)
      .eq('user_id', user.id)
      .select()
      .single();
    if (!error && data) setProgress(data as unknown as OnboardingProgress);
  }, [progress, user]);

  const skipOnboarding = useCallback(async () => {
    if (!progress || !user) return;
    await supabase
      .from('partner_onboarding_progress')
      .update({ completed_at: new Date().toISOString() })
      .eq('user_id', user.id);
    load();
  }, [progress, user, load]);

  const completionPercent = progress
    ? Math.round((progress.steps_completed.length / ONBOARDING_STEPS.length) * 100)
    : 0;

  const isComplete = !!progress?.completed_at;

  return { progress, loading, completeStep, skipOnboarding, completionPercent, isComplete, reload: load };
};
