
import { createClient } from '@supabase/supabase-js';

// Get environment variables from Lovable's environment
// or use fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://agoclnqfyinwjxdmjnns.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage
  }
});

// Get the current user
export const getCurrentUser = async () => {
  return supabase.auth.getUser();
};

// Get the current session
export const getSession = async () => {
  return supabase.auth.getSession();
};

// Authentication helpers
export const signUp = async (email: string, password: string, metadata?: object) => {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
};

export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({
    email,
    password
  });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};
