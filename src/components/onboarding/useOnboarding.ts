import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useOnboarding = () => {
  const { user } = useAuth();
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_onboarding')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking onboarding status:', error);
          setLoading(false);
          return;
        }

        if (!data) {
          // Create onboarding record
          await supabase
            .from('user_onboarding')
            .insert({ user_id: user.id });
          setShouldShowOnboarding(true);
        } else {
          setShouldShowOnboarding(!data.onboarding_completed);
        }
      } catch (error) {
        console.error('Error in onboarding check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      await supabase
        .from('user_onboarding')
        .update({
          onboarding_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      setShouldShowOnboarding(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const markFeatureViewed = async (featureName: string) => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_onboarding')
        .select('features_viewed')
        .eq('user_id', user.id)
        .single();

      const currentFeatures = (data?.features_viewed as string[]) || [];
      
      if (!currentFeatures.includes(featureName)) {
        await supabase
          .from('user_onboarding')
          .update({
            features_viewed: [...currentFeatures, featureName]
          })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error marking feature viewed:', error);
    }
  };

  return {
    shouldShowOnboarding,
    loading,
    completeOnboarding,
    markFeatureViewed
  };
};
