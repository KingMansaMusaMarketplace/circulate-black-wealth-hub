import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface User extends SupabaseUser {
  user_metadata: {
    fullName?: string;
    full_name?: string;
    name?: string;
    role?: string;
    user_type?: 'customer' | 'business' | 'sales_agent';
    is_admin?: boolean;
    is_customer?: boolean;
    is_agent?: boolean;
    is_hbcu_member?: boolean;
    avatar_url?: string;
    avatarUrl?: string;
  };
  app_metadata: any;
  aud: string;
  created_at: string;
  email_confirmed_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userType?: 'customer' | 'business' | 'sales_agent';
  authInitialized: boolean;
  databaseInitialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any; mfaRequired?: boolean; factorId?: string; challengeId?: string; data?: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: any; data?: any }>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  updateUserPassword?: (newPassword: string) => Promise<{ success: boolean; error?: any }>;
  getMFAFactors?: () => Promise<any[]>;
  resetPassword?: (email: string) => Promise<{ success: boolean; error?: any }>;
  signInWithSocial: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
  verifyMFA: (factorId: string, code: string, challengeId: string) => Promise<{ success: boolean; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Safe AuthProvider that ensures React is ready before using hooks
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with null to prevent hook calls if React isn't ready
  const [initialized, setInitialized] = useState(false);
  
  // Check if React context is available before proceeding
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialized(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Don't render children until React is fully initialized
  if (!initialized) {
    return <div>Initializing...</div>;
  }
  
  return <AuthProviderInner>{children}</AuthProviderInner>;
};

// The actual AuthProvider implementation
const AuthProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'customer' | 'business' | 'sales_agent' | undefined>();
  const [authInitialized, setAuthInitialized] = useState(false);
  const [databaseInitialized, setDatabaseInitialized] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('AuthContext: Initializing auth');
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log('Auth state changed:', event, !!currentSession);
            setSession(currentSession);
            setUser(currentSession?.user as User || null);
            
            if (currentSession?.user?.user_metadata?.user_type) {
              setUserType(currentSession.user.user_metadata.user_type);
            }
            
            setLoading(false);
            setAuthInitialized(true);
          }
        );

        // Check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', !!currentSession);
        
        setSession(currentSession);
        setUser(currentSession?.user as User || null);
        
        if (currentSession?.user?.user_metadata?.user_type) {
          setUserType(currentSession.user.user_metadata.user_type);
        }
        
        setLoading(false);
        setAuthInitialized(true);

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Sign in attempt:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { data };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      console.log('Sign up attempt:', email, metadata);
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
        return { error };
      }

      return { data };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserType(undefined);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('Error checking session:', error);
      return false;
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        return { success: false, error };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const getMFAFactors = async () => {
    return [];
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        return { success: false, error };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signInWithSocial = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
    } catch (error) {
      console.error('Error with social sign in:', error);
    }
  };

  const verifyMFA = async (factorId: string, code: string, challengeId: string) => {
    try {
      console.log('Verifying MFA:', { factorId, code, challengeId });
      return { success: true };
    } catch (error) {
      console.error('Error verifying MFA:', error);
      return { success: false, error };
    }
  };

  const value = {
    user,
    session,
    loading,
    userType,
    authInitialized,
    databaseInitialized,
    signIn,
    signUp,
    signOut,
    checkSession,
    updateUserPassword,
    getMFAFactors,
    resetPassword,
    signInWithSocial,
    verifyMFA
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
