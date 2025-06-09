import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createUserProfile } from '@/lib/auth/auth-profile';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: string | null;
  loading: boolean;
  authInitialized: boolean;
  databaseInitialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signUp: (email: string, password: string, metadata?: object) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
  checkSession: () => Promise<boolean>;
  getMFAFactors: () => Promise<any[]>;
  updateUserPassword: (password: string) => Promise<{ success: boolean; error?: any }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: any }>;
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
  const [databaseInitialized, setDatabaseInitialized] = useState(true); // Assume initialized for now

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setAuthInitialized(true);

        // Handle user signup completion - check for event string value
        if (event === 'SIGNED_UP' && session?.user) {
          const userMetadata = session.user.user_metadata;
          console.log('Creating user profile for new user:', userMetadata);
          
          try {
            await createUserProfile(session.user.id, userMetadata);
            console.log('User profile created successfully');
          } catch (error) {
            console.error('Failed to create user profile:', error);
          }
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      setAuthInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success('Successfully signed in!');
      return { error: null, data };
    } catch (error: any) {
      toast.error(error.message);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: object) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
        }
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      if (data.user && !data.session) {
        toast.success('Check your email to confirm your account');
      } else {
        toast.success('Account created successfully!');
      }
      
      return { error: null, data };
    } catch (error: any) {
      toast.error(error.message);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Successfully signed out');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const checkSession = async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('Error checking session:', error);
      return false;
    }
  };

  const getMFAFactors = async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      return data?.totp || [];
    } catch (error) {
      console.error('Error getting MFA factors:', error);
      return [];
    }
  };

  const updateUserPassword = async (password: string): Promise<{ success: boolean; error?: any }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        return { success: false, error };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: any }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/new-password`
      });
      if (error) {
        return { success: false, error };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const userType = user?.user_metadata?.user_type || user?.user_metadata?.userType || 'customer';

  const value = {
    user,
    session,
    userType,
    loading,
    authInitialized,
    databaseInitialized,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
    checkSession,
    getMFAFactors,
    updateUserPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
