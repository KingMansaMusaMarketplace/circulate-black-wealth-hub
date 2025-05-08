
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

// MFA Factor type
type Factor = {
  id: string;
  created_at: string;
  updated_at: string;
  factor_type: string;
  status: string;
  friendly_name?: string;
};

// MFA Challenge type
type MFAChallenge = {
  id: string;
  factorId: string;
  expiresAt: string;
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
  mfaEnrolled: boolean;
  mfaFactors: Factor[];
  verifyMFA: (factorId: string, code: string, challengeId: string) => Promise<any>;
  getMFAFactors: () => Promise<Factor[]>;
  getCurrentMFAChallenge: () => MFAChallenge | null;
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
  const [mfaFactors, setMfaFactors] = useState<Factor[]>([]);
  const [mfaEnrolled, setMfaEnrolled] = useState(false);
  const [currentMFAChallenge, setCurrentMFAChallenge] = useState<MFAChallenge | null>(null);

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

  // Get MFA factors for the current user
  const getMFAFactors = async (): Promise<Factor[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) throw error;
      
      const factors = data?.all || [];
      setMfaFactors(factors);
      setMfaEnrolled(factors.length > 0);
      
      return factors;
    } catch (error) {
      console.error('Error fetching MFA factors:', error);
      return [];
    }
  };

  // Verify an MFA challenge
  const verifyMFA = async (factorId: string, code: string, challengeId: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code
      });
      
      if (error) throw error;
      
      // Clear the MFA challenge after successful verification
      setCurrentMFAChallenge(null);
      
      return { success: true, data };
    } catch (error: any) {
      console.error('MFA verification error:', error);
      return { success: false, error };
    }
  };

  // Get the current MFA challenge
  const getCurrentMFAChallenge = () => {
    return currentMFAChallenge;
  };

  // Enhanced sign-in function that handles MFA challenges
  const enhancedSignIn = async (email: string, password: string) => {
    try {
      const result = await handleSignIn(email, password, toastWrapper);
      
      // Check if MFA challenge is required
      if (result.data?.session === null && result.data?.user !== null) {
        // User exists but session is null - likely needs MFA
        // Store user for later reference
        setUser(result.data.user);
        
        // Fetch available MFA factors
        await getMFAFactors();
        
        // If user has MFA factors, initiate a challenge
        const factors = await getMFAFactors();
        if (factors.length > 0) {
          const { data, error } = await supabase.auth.mfa.challenge({
            factorId: factors[0].id
          });
          
          if (error) throw error;
          
          // Store the challenge for verification
          setCurrentMFAChallenge({
            id: data.id,
            factorId: factors[0].id,
            expiresAt: data.expires_at
          });
          
          // Return a special result indicating MFA is required
          return { 
            ...result, 
            mfaRequired: true,
            factorId: factors[0].id,
            challengeId: data.id
          };
        }
      }
      
      return result;
    } catch (error) {
      console.error('Enhanced sign in error:', error);
      return { data: null, error };
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
          // Fetch MFA factors when user signs in
          getMFAFactors();
        } else if (event === 'SIGNED_OUT') {
          toast.info('You have been signed out');
          setMfaFactors([]);
          setMfaEnrolled(false);
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
      
      // Fetch MFA factors if user is already signed in
      if (session?.user) {
        getMFAFactors();
      }
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
    signIn: enhancedSignIn,
    signInWithSocial: (provider: Provider) =>
      handleSocialSignIn(provider, toastWrapper),
    signOut: async () => {
      const result = await handleSignOut(toastWrapper);
      if (result.success) {
        setUser(null);
        setSession(null);
        setUserType(null);
        setMfaFactors([]);
        setMfaEnrolled(false);
        setCurrentMFAChallenge(null);
      }
    },
    resetPassword: (email: string) =>
      requestPasswordReset(email, toastWrapper),
    updateUserPassword: (newPassword: string) =>
      updatePassword(newPassword, toastWrapper),
    userType,
    initializingDatabase,
    databaseInitialized,
    checkSession,
    mfaEnrolled,
    mfaFactors,
    verifyMFA,
    getMFAFactors,
    getCurrentMFAChallenge
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
