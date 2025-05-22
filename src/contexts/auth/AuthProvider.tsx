
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthContextType } from './types';
import { 
  enhancedSignIn, 
  handleUserSignUp, 
  handleUserSignOut, 
  handleUserSocialSignIn,
  handlePasswordReset,
  handleUpdatePassword,
  toastWrapper
} from './authUtils';
import { AuthContext } from './AuthContext';
import { useAuthSession, useSessionCheck } from './hooks/useAuthSession';
import { useMFAFactors, useMFAChallenge } from './hooks/useMFAHooks';
import { useDatabaseInit } from './hooks/useDatabaseInit';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    setUser,
    session,
    setSession,
    userType,
    setUserType,
    loading,
    authInitialized
  } = useAuthSession();
  
  const {
    initializingDatabase,
    databaseInitialized
  } = useDatabaseInit();
  
  const { checkSession } = useSessionCheck();
  
  const {
    mfaFactors,
    mfaEnrolled,
    getMFAFactors
  } = useMFAFactors(user?.id);
  
  const {
    currentMFAChallenge,
    setCurrentMFAChallenge,
    getCurrentMFAChallenge,
    verifyMFA
  } = useMFAChallenge();

  const value: AuthContextType = {
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
        getMFAFactors,
        setCurrentMFAChallenge, 
        toastWrapper
      );
      if (result.data?.session) {
        setUser(result.data.user || null);
        setSession(result.data.session);
        const userTypeFromMeta = result.data.user?.user_metadata?.userType;
        if (userTypeFromMeta === 'customer' || userTypeFromMeta === 'business') {
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
        getMFAFactors,
        setCurrentMFAChallenge, 
        toastWrapper
      );
      if (result.data?.session) {
        setUser(result.data.user || null);
        setSession(result.data.session);
        const userTypeFromMeta = result.data.user?.user_metadata?.userType;
        if (userTypeFromMeta === 'customer' || userTypeFromMeta === 'business') {
          console.log("Setting user type after sign in:", userTypeFromMeta);
          setUserType(userTypeFromMeta);
        }
      }
      return result;
    },
    signInWithSocial: async (provider) => {
      const result = await handleUserSocialSignIn(provider, toastWrapper);
      return result;
    },
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

export { useAuth } from './AuthContext';
