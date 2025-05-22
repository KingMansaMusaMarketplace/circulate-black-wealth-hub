
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

// Hook to manage auth session
export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<'customer' | 'business' | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Initialize the auth state and listeners
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
          const metadata = currentSession.user.user_metadata;
          console.log("Setting user type from metadata:", metadata.userType);
          
          // Only set if it's a valid user type
          if (metadata.userType === 'customer' || metadata.userType === 'business') {
            setUserType(metadata.userType);
          } else {
            console.warn("Unknown user type:", metadata.userType);
            setUserType(null);
          }
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
              // Only set if it's a valid user type
              if (profileData.user_type === 'customer' || profileData.user_type === 'business') {
                setUserType(profileData.user_type);
              } else {
                console.warn("Unknown user type from profile:", profileData.user_type);
                setUserType(null);
              }
            }
          } catch (error) {
            console.error('Error fetching user type from profile:', error);
          }
        } else {
          setUserType(null);
        }
        
        setLoading(false);
        setAuthInitialized(true);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Initial session check:", !!currentSession);
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user?.user_metadata?.userType) {
        const metadata = currentSession.user.user_metadata;
        console.log("Setting initial user type from metadata:", metadata.userType);
        
        // Only set if it's a valid user type
        if (metadata.userType === 'customer' || metadata.userType === 'business') {
          setUserType(metadata.userType);
        } else {
          console.warn("Unknown initial user type:", metadata.userType);
          setUserType(null);
        }
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
            // Only set if it's a valid user type
            if (profileData.user_type === 'customer' || profileData.user_type === 'business') {
              setUserType(profileData.user_type);
            } else {
              console.warn("Unknown initial user type from profile:", profileData.user_type);
              setUserType(null);
            }
          }
        } catch (error) {
          console.error('Error fetching user type from profile:', error);
        }
      }
      
      setLoading(false);
      setAuthInitialized(true);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    setUser,
    session,
    setSession,
    userType,
    setUserType,
    loading,
    authInitialized
  };
};

// Function to check if the session is valid
export const useSessionCheck = () => {
  const checkSession = async (): Promise<boolean> => {
    try {
      console.log("Checking user session...");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("checkUserSession result:", !!session);
      return !!session;
    } catch (error) {
      console.error('Error checking session:', error);
      return false;
    }
  };

  return { checkSession };
};
