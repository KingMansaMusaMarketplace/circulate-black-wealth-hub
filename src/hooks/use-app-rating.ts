import { useCallback } from 'react';

/**
 * Hook to prompt users for an app store rating after positive actions.
 * Uses Capacitor's native app review API on iOS/Android.
 * Respects a cooldown to avoid over-prompting.
 */
export const useAppRating = () => {
  const RATING_COOLDOWN_KEY = 'app_rating_last_prompt';
  const RATING_ACTION_COUNT_KEY = 'app_rating_action_count';
  const COOLDOWN_DAYS = 90;
  const ACTIONS_BEFORE_PROMPT = 5;

  const isNativePlatform = () => {
    try {
      return (
        typeof window !== 'undefined' &&
        window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === 'function' &&
        window.Capacitor.isNativePlatform()
      );
    } catch {
      return false;
    }
  };

  const canPrompt = useCallback((): boolean => {
    const lastPrompt = localStorage.getItem(RATING_COOLDOWN_KEY);
    if (lastPrompt) {
      const daysSince = (Date.now() - parseInt(lastPrompt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSince < COOLDOWN_DAYS) return false;
    }
    return true;
  }, []);

  const trackPositiveAction = useCallback(() => {
    if (!isNativePlatform() || !canPrompt()) return;

    const count = parseInt(localStorage.getItem(RATING_ACTION_COUNT_KEY) || '0', 10) + 1;
    localStorage.setItem(RATING_ACTION_COUNT_KEY, String(count));

    if (count >= ACTIONS_BEFORE_PROMPT) {
      promptRating();
    }
  }, [canPrompt]);

  const promptRating = useCallback(async () => {
    if (!isNativePlatform() || !canPrompt()) return;

    try {
      const { RateApp } = await import('capacitor-rate-app');
      await RateApp.requestReview();
      localStorage.setItem(RATING_COOLDOWN_KEY, String(Date.now()));
      localStorage.setItem(RATING_ACTION_COUNT_KEY, '0');
      console.log('App rating prompt shown');
    } catch (error) {
      console.log('App rating not available:', error);
    }
  }, [canPrompt]);

  return { trackPositiveAction, promptRating };
};
