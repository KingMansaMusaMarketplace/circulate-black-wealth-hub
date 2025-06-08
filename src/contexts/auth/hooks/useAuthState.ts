
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthState } from '../types';

export const useAuthState = (): AuthState & {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
} => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [userType, setUserType] = useState<string | undefined>();
  const [databaseInitialized, setDatabaseInitialized] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setInitialized(true);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (session?.user) {
          // Get user profile to determine user type
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('user_type')
              .eq('id', session.user.id)
              .single();
            
            if (profile) {
              setUserType(profile.user_type);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setUserType(undefined);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return {
    initialized,
    user,
    session,
    isMfaEnabled,
    isLoading,
    userType,
    authInitialized: initialized,
    loading: isLoading,
    databaseInitialized,
    setUser,
    setSession,
    setLoading
  };
};
