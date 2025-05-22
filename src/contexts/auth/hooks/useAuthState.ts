
import { useState, useEffect, useCallback, useRef } from 'react';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthState, AuthActions } from './types';
import { signInWithEmail as authSignIn, 
         signInWithProvider as authSignInProvider, 
         signUp as authSignUp,
         signOut as authSignOut,
         checkMFAStatus } from './authUtils';
import { useMFASetup } from './mfaHooks';

export function useAuthState(): [AuthState, AuthActions] {
  const [state, setState] = useState<AuthState>({
    initialized: false,
    user: null,
    session: null,
    isMfaEnabled: false,
    isLoading: true,
  });
  
  // Track mounted state to avoid state updates after unmount
  const isMounted = useRef(true);

  // Safe setState that checks if component is still mounted
  const safeSetState = useCallback((newState: Partial<AuthState>) => {
    if (isMounted.current) {
      setState((prevState) => ({ ...prevState, ...newState }));
    }
  }, []);

  // Initialize auth state and set up listeners
  useEffect(() => {
    let authListener: { data: { subscription: { unsubscribe: () => void } } };

    async function initialize() {
      try {
        // First, set up the auth state change listener
        authListener = supabase.auth.onAuthStateChange(async (event, session) => {
          if (isMounted.current) {
            // Check MFA status whenever auth state changes
            let mfaStatus = false;
            if (session?.user) {
              mfaStatus = await checkMFAStatus(session.user.id);
            }

            safeSetState({
              user: session?.user ?? null,
              session,
              isMfaEnabled: mfaStatus,
              isLoading: false,
              initialized: true,
            });
          }
        });

        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        let mfaStatus = false;
        if (session?.user) {
          mfaStatus = await checkMFAStatus(session.user.id);
        }

        safeSetState({
          user: session?.user ?? null,
          session,
          isMfaEnabled: mfaStatus,
          isLoading: false,
          initialized: true,
        });
      } catch (error) {
        console.error("Error initializing auth:", error);
        safeSetState({ isLoading: false, initialized: true });
      }
    }

    initialize();

    // Clean up subscription on unmount
    return () => {
      isMounted.current = false;
      if (authListener) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, [safeSetState]);

  // Sign in with email and password
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      safeSetState({ isLoading: true });
      const result = await authSignIn(email, password);
      return result;
    } finally {
      safeSetState({ isLoading: false });
    }
  }, [safeSetState]);

  // Sign in with a provider
  const signInWithProvider = useCallback(async (provider: 'google' | 'facebook' | 'github') => {
    try {
      safeSetState({ isLoading: true });
      await authSignInProvider(provider);
    } finally {
      safeSetState({ isLoading: false });
    }
  }, [safeSetState]);

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string, metadata?: object) => {
    try {
      safeSetState({ isLoading: true });
      return await authSignUp(email, password, metadata);
    } finally {
      safeSetState({ isLoading: false });
    }
  }, [safeSetState]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      safeSetState({ isLoading: true });
      await authSignOut();
    } finally {
      safeSetState({ isLoading: false });
    }
  }, [safeSetState]);

  // Setup MFA
  const { setupMFAForUser } = useMFASetup(state.user?.id || null);

  return [
    state,
    {
      signInWithEmail,
      signInWithProvider,
      signUp,
      signOut,
      setupMFA: setupMFAForUser,
    },
  ];
}

// Re-export types for convenience
export type { AuthState, AuthActions };
