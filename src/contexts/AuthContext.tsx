
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthUser extends User {
  user_type?: 'customer' | 'business' | 'sales_agent';
  subscription_tier?: 'free' | 'premium' | 'enterprise';
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  userType?: string;
  authInitialized: boolean;
  databaseInitialized: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  refreshUser: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  getMFAFactors: () => Promise<any[]>;
  resetPassword: (email: string) => Promise<any>;
  updateUserPassword: (password: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | undefined>();
  const [authInitialized, setAuthInitialized] = useState(false);
  const [databaseInitialized] = useState(true);

  const refreshUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type, subscription_tier')
          .eq('id', currentUser.id)
          .single();
        
        const enhancedUser = {
          ...currentUser,
          user_type: profile?.user_type,
          subscription_tier: profile?.subscription_tier
        } as AuthUser;
        
        setUser(enhancedUser);
        setUserType(profile?.user_type);
      } else {
        setUser(null);
        setUserType(undefined);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      setUserType(undefined);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error };
      }

      return { data };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

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
      
      if (error) {
        return { error };
      }

      return { data };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      setUserType(undefined);
    } catch (error) {
      console.error('Error signing out:', error);
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

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/new-password`
      });
      
      if (error) {
        return { error };
      }

      return { data };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error };
    }
  };

  const updateUserPassword = async (password: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        return { error };
      }

      return { data };
    } catch (error) {
      console.error('Error updating password:', error);
      return { error };
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        
        if (initialSession?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_type, subscription_tier')
            .eq('id', initialSession.user.id)
            .single();
          
          const enhancedUser = {
            ...initialSession.user,
            user_type: profile?.user_type,
            subscription_tier: profile?.subscription_tier
          } as AuthUser;
          
          setUser(enhancedUser);
          setUserType(profile?.user_type);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('user_type, subscription_tier')
              .eq('id', session.user.id)
              .single();
            
            const enhancedUser = {
              ...session.user,
              user_type: profile?.user_type,
              subscription_tier: profile?.subscription_tier
            } as AuthUser;
            
            setUser(enhancedUser);
            setUserType(profile?.user_type);
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(session.user as AuthUser);
            setUserType(undefined);
          }
        } else {
          setUser(null);
          setUserType(undefined);
        }
        setLoading(false);
        setAuthInitialized(true);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    userType,
    authInitialized,
    databaseInitialized,
    signOut,
    signIn,
    signUp,
    refreshUser,
    checkSession,
    getMFAFactors,
    resetPassword,
    updateUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
