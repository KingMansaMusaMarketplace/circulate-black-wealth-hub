import React, { createContext, useContext, useEffect, useMemo, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string | null;
  is_enabled: boolean;
  rollout_percentage: number;
  target_user_types: string[] | null;
  created_at: string;
  updated_at: string;
}

interface FeatureFlagsContextValue {
  flags: FeatureFlag[];
  isLoading: boolean;
  isEnabled: (flagKey: string) => boolean;
  getFlag: (flagKey: string) => FeatureFlag | undefined;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | undefined>(undefined);

/**
 * Feature Flags Context Provider
 * 
 * Pre-loads all flags on app startup and provides sync access to flag states.
 * Also handles real-time flag updates via Supabase Realtime.
 * 
 * Usage:
 * ```tsx
 * // In App.tsx
 * <FeatureFlagsProvider>
 *   <App />
 * </FeatureFlagsProvider>
 * 
 * // In components
 * const { isEnabled } = useFeatureFlagsContext();
 * if (isEnabled('new_feature')) { ... }
 * ```
 */
export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load flags on mount
  useEffect(() => {
    const loadFlags = async () => {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error('Error loading feature flags:', error);
        } else {
          setFlags(data || []);
        }
      } catch (err) {
        console.error('Failed to load feature flags:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFlags();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('feature_flags_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_flags',
        },
        (payload) => {
          console.log('Feature flag update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setFlags(prev => [...prev, payload.new as FeatureFlag]);
          } else if (payload.eventType === 'UPDATE') {
            setFlags(prev => 
              prev.map(flag => 
                flag.id === (payload.new as FeatureFlag).id 
                  ? payload.new as FeatureFlag 
                  : flag
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setFlags(prev => 
              prev.filter(flag => flag.id !== (payload.old as { id: string }).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Generate a deterministic hash for rollout percentage
  const getUserRolloutValue = useCallback((flagKey: string): number => {
    const userId = user?.id || 'anonymous';
    const combined = `${userId}:${flagKey}`;
    
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash) % 100;
  }, [user?.id]);

  // Get user type for targeting
  const userType = useMemo(() => {
    if (!user) return 'anonymous';
    
    const metadata = user.user_metadata;
    if (metadata?.user_type) return metadata.user_type;
    if (metadata?.is_business) return 'business';
    if (metadata?.is_admin) return 'admin';
    
    return 'customer';
  }, [user]);

  // Check if a flag is enabled
  const isEnabled = useCallback((flagKey: string): boolean => {
    const flag = flags.find(f => f.key === flagKey);
    
    if (!flag || !flag.is_enabled) {
      return false;
    }

    // Check user type targeting
    if (flag.target_user_types && flag.target_user_types.length > 0) {
      if (!flag.target_user_types.includes(userType)) {
        return false;
      }
    }

    // Check rollout percentage
    if (flag.rollout_percentage < 100) {
      const userRolloutValue = getUserRolloutValue(flagKey);
      if (userRolloutValue >= flag.rollout_percentage) {
        return false;
      }
    }

    return true;
  }, [flags, userType, getUserRolloutValue]);

  // Get a specific flag
  const getFlag = useCallback((flagKey: string): FeatureFlag | undefined => {
    return flags.find(f => f.key === flagKey);
  }, [flags]);

  const value = useMemo(() => ({
    flags,
    isLoading,
    isEnabled,
    getFlag,
  }), [flags, isLoading, isEnabled, getFlag]);

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

/**
 * Hook to access the FeatureFlags context
 * Must be used within a FeatureFlagsProvider
 */
export function useFeatureFlagsContext(): FeatureFlagsContextValue {
  const context = useContext(FeatureFlagsContext);
  
  if (context === undefined) {
    throw new Error('useFeatureFlagsContext must be used within a FeatureFlagsProvider');
  }
  
  return context;
}

export default FeatureFlagsProvider;
