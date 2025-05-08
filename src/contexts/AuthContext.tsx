
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Provider, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { setupDatabase, checkDatabaseInitialized } from '@/lib/database-init';
import { 
  handleSignUp, 
  handleSignIn, 
  handleSignOut,
  handleSocialSignIn,
  requestPasswordReset,
  updatePassword 
} from '@/lib/auth';

// Fixed ToastProps type to match what's expected in auth functions
type ToastProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

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
  checkSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to wrap toast in the expected format
const toastWrapper = (props: ToastProps) => {
  if (props.variant === "destructive") {
    return toast.error(props.title, { description: props.description });
  } else {
    return toast.success(props.title, { description: props.description });
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<'customer' | 'business' | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializingDatabase, setInitializingDatabase] = useState(false);
  const [databaseInitialized, setDatabaseInitialized] = useState(false);

  // Check if the session is valid
  const checkSession = async (): Promise<boolean> => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      return !!currentSession;
    } catch (error) {
      console.error('Error checking session:', error);
      return false;
    }
  };

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
        
        if (event === 'SIGNED_IN') {
          toast.success('You have successfully signed in!');
        } else if (event === 'SIGNED_OUT') {
          toast.info('You have been signed out');
        }
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
      handleSignUp(email, password, metadata, toastWrapper),
    signIn: (email: string, password: string) => 
      handleSignIn(email, password, toastWrapper),
    signInWithSocial: (provider: Provider) =>
      handleSocialSignIn(provider, toastWrapper),
    signOut: async () => {
      const result = await handleSignOut(toastWrapper);
      if (result.success) {
        setUser(null);
        setSession(null);
        setUserType(null);
      }
    },
    resetPassword: (email: string) =>
      requestPasswordReset(email, toastWrapper),
    updateUserPassword: (newPassword: string) =>
      updatePassword(newPassword, toastWrapper),
    userType,
    initializingDatabase,
    databaseInitialized,
    checkSession
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
