
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Provider, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { setupDatabase, checkDatabaseInitialized } from '@/lib/database-init';
import { 
  handleSignUp, 
  handleSignIn, 
  handleSignOut,
  handleSocialSignIn,
  requestPasswordReset,
  updatePassword 
} from '@/lib/auth';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithSocial: (provider: Provider) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updateUserPassword: (newPassword: string) => Promise<any>;
  userType: 'customer' | 'business' | null;
  initializingDatabase: boolean;
  databaseInitialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<'customer' | 'business' | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializingDatabase, setInitializingDatabase] = useState(false);
  const [databaseInitialized, setDatabaseInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user?.user_metadata?.userType) {
          setUserType(session.user.user_metadata.userType);
        } else {
          setUserType(null);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user?.user_metadata?.userType) {
        setUserType(session.user.user_metadata.userType);
      }
      
      setLoading(false);
    });

    // Check if database is initialized
    checkDatabaseInitialized().then((initialized) => {
      setDatabaseInitialized(initialized);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    signUp: (email: string, password: string, metadata?: any) => 
      handleSignUp(email, password, metadata),
    signIn: (email: string, password: string) => 
      handleSignIn(email, password),
    signInWithSocial: (provider: Provider) =>
      handleSocialSignIn(provider),
    signOut: async () => {
      const result = await handleSignOut();
      if (result.success) {
        setUser(null);
        setSession(null);
        setUserType(null);
      }
    },
    resetPassword: (email: string) =>
      requestPasswordReset(email),
    updateUserPassword: (newPassword: string) =>
      updatePassword(newPassword),
    userType,
    initializingDatabase,
    databaseInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
