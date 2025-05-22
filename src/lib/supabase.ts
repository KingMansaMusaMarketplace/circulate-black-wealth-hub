
import { createClient } from '@supabase/supabase-js';

// Get environment variables from Lovable's environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client for development if environment variables are missing
let supabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Using mock client for development.');
  
  // Create a mock client that doesn't throw errors but won't connect to Supabase
  supabaseClient = {
    auth: {
      signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ subscription: { unsubscribe: () => {} }, data: { subscription: { unsubscribe: () => {} }} })
    },
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          limit: (limit: number) => Promise.resolve({ data: [], error: new Error('Supabase not configured') })
        }),
        limit: (limit: number) => Promise.resolve({ data: [], error: new Error('Supabase not configured') })
      }),
      insert: (data: any) => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      update: (data: any) => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      })
    }),
    rpc: (func: string, params: any) => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
  };
} else {
  // Create the real Supabase client
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;

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

export const getCurrentUser = async () => {
  return supabase.auth.getUser();
};

export const getSession = async () => {
  return supabase.auth.getSession();
};
