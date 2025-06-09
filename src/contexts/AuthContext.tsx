
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  userType: string | null;
  checkSession: () => Promise<boolean>;
  authInitialized: boolean;
  getMFAFactors: () => Promise<any[]>;
  updateUserPassword: (password: string) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  databaseInitialized: boolean;
  signInWithSocial: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
  verifyMFA: (factorId: string, code: string, challengeId: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [databaseInitialized, setDatabaseInitialized] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setUserType(session.user.user_metadata?.userType || 'customer');
      }
      setLoading(false);
      setAuthInitialized(true);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setUserType(session.user.user_metadata?.userType || 'customer');
      } else {
        setUserType(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const signInWithSocial = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider
      });
      if (error) throw error;
    } catch (error) {
      console.error('Social sign in error:', error);
      toast.error('Failed to sign in with social provider');
    }
  };

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  };

  const getMFAFactors = async () => {
    // Placeholder for MFA functionality
    return [];
  };

  const verifyMFA = async (factorId: string, code: string, challengeId: string) => {
    // Placeholder for MFA verification
    return { error: null };
  };

  const updateUserPassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    userType,
    checkSession,
    authInitialized,
    getMFAFactors,
    updateUserPassword,
    resetPassword,
    databaseInitialized,
    signInWithSocial,
    verifyMFA
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
