
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkDatabaseInitialized } from '@/lib/database-init';
import { AuthContextType } from './types';
import { 
  enhancedSignIn, 
  handleUserSignUp, 
  handleUserSignOut, 
  handleUserSocialSignIn,
  handlePasswordReset,
  handleUpdatePassword,
  checkUserSession,
  toastWrapper
} from './authUtils';
import { verifyMFA as verifyUserMFA } from './mfaUtils';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializingDatabase, setInitializingDatabase] = useState(false);
  const [databaseInitialized, setDatabaseInitialized] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [mfaFactors, setMfaFactors] = useState([]);
  const [mfaEnrolled, setMfaEnrolled] = useState(false);
  const [currentMFAChallenge, setCurrentMFAChallenge] = useState(null);
  
  // Function to get MFA factors for the current user
  const getMFAFactors = async (userId) => {
    if (!userId) return [];
    
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
  
  // Get current MFA challenge
  const getCurrentMFAChallenge = () => {
    return currentMFAChallenge;
  };

  // Verify an MFA challenge
  const verifyMFA = async (factorId, code, challengeId) => {
    console.log("Verifying MFA:", { factorId, code, challengeId });
    const result = await verifyUserMFA(factorId, code, challengeId);
    
    // Clear the MFA challenge after verification attempt
    if (result.success) {
      console.log("MFA verification successful");
      setCurrentMFAChallenge(null);
      // Update session after successful MFA
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        if (data.session.user?.user_metadata?.userType) {
          setUserType(data.session.user.user_metadata.userType);
        }
      }
    } else {
      console.error("MFA verification failed:", result);
    }
    
    return result;
  };

  useEffect(() => {
    console.log("AuthProvider initialized");
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, !!currentSession);
        
        // Always update the session state
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (currentSession?.user?.user_metadata?.userType) {
          console.log("Setting user type from metadata:", currentSession.user.user_metadata.userType);
          setUserType(currentSession.user.user_metadata.userType);
        } else if (currentSession?.user) {
          // Attempt to get user type from profiles if not in metadata
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('user_type')
              .eq('id', currentSession.user.id)
              .single();
            
            if (profileData) {
              console.log("Setting user type from profile:", profileData.user_type);
              setUserType(profileData.user_type);
            }
          } catch (error) {
            console.error('Error fetching user type from profile:', error);
          }
        } else {
          setUserType(null);
        }
        
        setLoading(false);
        setAuthInitialized(true);
        
        if (event === 'SIGNED_IN') {
          console.log("User signed in, user type:", currentSession?.user?.user_metadata?.userType);
          toast.success('You have successfully signed in!');
          // Fetch MFA factors when user signs in
          if (currentSession?.user) {
            getMFAFactors(currentSession.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          toast.info('You have been signed out');
        } else if (event === 'USER_UPDATED' && currentSession) {
          if (currentSession.user) {
            getMFAFactors(currentSession.user.id);
          }
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Initial session check:", !!currentSession);
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user?.user_metadata?.userType) {
        console.log("Setting initial user type from metadata:", currentSession.user.user_metadata.userType);
        setUserType(currentSession.user.user_metadata.userType);
      } else if (currentSession?.user) {
        // Attempt to get user type from profiles if not in metadata
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', currentSession.user.id)
            .single();
          
          if (profileData) {
            console.log("Setting initial user type from profile:", profileData.user_type);
            setUserType(profileData.user_type);
          }
        } catch (error) {
          console.error('Error fetching user type from profile:', error);
        }
      }
      
      setLoading(false);
      setAuthInitialized(true);
      
      // Fetch MFA factors if user is already signed in
      if (currentSession?.user) {
        getMFAFactors(currentSession.user.id);
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
    authInitialized,
    signUp: async (email, password, metadata) => {
      console.log("Signing up with metadata:", metadata);
      const result = await handleUserSignUp(email, password, metadata, toastWrapper);
      // If signup was successful and we have a session, update the auth state
      if (result.data?.session) {
        setUser(result.data.user || null);
        setSession(result.data.session);
        if (metadata?.userType) {
          setUserType(metadata.userType);
        }
      }
      return result;
    },
    signIn: async (email, password) => {
      console.log("Signing in:", email);
      const result = await enhancedSignIn(
        email, 
        password, 
        setUser, 
        async () => await getMFAFactors(user?.id),
        setCurrentMFAChallenge, 
        toastWrapper
      );
      if (result.data?.session) {
        setUser(result.data.user || null);
        setSession(result.data.session);
        const userTypeFromMeta = result.data.user?.user_metadata?.userType;
        if (userTypeFromMeta) {
          console.log("Setting user type after sign in:", userTypeFromMeta);
          setUserType(userTypeFromMeta);
        }
      }
      return result;
    },
    signInWithEmail: async (email, password) => {
      console.log("Signing in with email:", email);
      const result = await enhancedSignIn(
        email, 
        password, 
        setUser, 
        async () => await getMFAFactors(user?.id),
        setCurrentMFAChallenge, 
        toastWrapper
      );
      if (result.data?.session) {
        setUser(result.data.user || null);
        setSession(result.data.session);
        const userTypeFromMeta = result.data.user?.user_metadata?.userType;
        if (userTypeFromMeta) {
          console.log("Setting user type after sign in:", userTypeFromMeta);
          setUserType(userTypeFromMeta);
        }
      }
      return result;
    },
    signInWithSocial: (provider) =>
      handleUserSocialSignIn(provider, toastWrapper),
    signOut: async () => {
      const result = await handleUserSignOut(toastWrapper);
      if (result.success) {
        setUser(null);
        setSession(null);
        setUserType(null);
      }
      return result;
    },
    resetPassword: (email) =>
      handlePasswordReset(email, toastWrapper),
    updateUserPassword: (newPassword) =>
      handleUpdatePassword(newPassword, toastWrapper),
    userType,
    initializingDatabase,
    databaseInitialized,
    checkSession: checkUserSession,
    mfaEnrolled,
    mfaFactors,
    verifyMFA,
    getMFAFactors: async () => await getMFAFactors(user?.id),
    getCurrentMFAChallenge
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth } from './AuthContext';
