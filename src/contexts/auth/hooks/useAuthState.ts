
import { useState } from 'react';
import { User, Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<'customer' | 'business' | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializingDatabase, setInitializingDatabase] = useState(false);
  const [databaseInitialized, setDatabaseInitialized] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  return {
    user,
    setUser,
    session,
    setSession,
    userType,
    setUserType,
    loading,
    setLoading,
    initializingDatabase,
    setInitializingDatabase,
    databaseInitialized,
    setDatabaseInitialized,
    authInitialized,
    setAuthInitialized
  };
};
