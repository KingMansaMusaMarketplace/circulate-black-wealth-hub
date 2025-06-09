
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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile to get user type
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('id', session.user.id)
                .single();
              
              setUserType(profile?.user_type || null);
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          }, 0);
        } else {
          setUserType(null);
        }
        
        setLoading(false);
        setAuthInitialized(true);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      setAuthInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      
      // Create user profile
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email,
          user_type: metadata?.user_type || 'customer',
          full_name: metadata?.full_name || '',
          ...metadata
        });
      }
      
      toast.success('Account created successfully!');
      return { data, error: null };
    } catch (error: any) {
      toast.error('Sign up failed: ' + error.message);
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
      
      toast.success('Signed in successfully!');
      return { data, error: null };
    } catch (error: any) {
      toast.error('Sign in failed: ' + error.message);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserType(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Sign out failed: ' + error.message);
    }
  };

  const checkSession = async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      return false;
    }
  };

  const getMFAFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      return data?.totp || [];
    } catch (error) {
      console.error('Error getting MFA factors:', error);
      return [];
    }
  };

  const updateUserPassword = async (password: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      return { success: !error, data, error };
    } catch (error) {
      return { success: false, error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/new-password`,
      });
      return { success: !error, data, error };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signInWithSocial = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error('Social login error:', error);
    }
  };

  const verifyMFA = async (factorId: string, code: string, challengeId: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code
      });
      return { success: !error, data, error };
    } catch (error) {
      return { success: false, error };
    }
  };

  return (
    <AuthContext.Provider value={{
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
      databaseInitialized: true,
      signInWithSocial,
      verifyMFA
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
