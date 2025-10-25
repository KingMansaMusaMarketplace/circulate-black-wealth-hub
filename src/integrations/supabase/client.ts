
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agoclnqfyinwjxdmjnns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ';

// Storage adapter with fallback for iOS native app
const getStorage = () => {
  try {
    // Test if localStorage is accessible
    localStorage.setItem('_test', '1');
    localStorage.removeItem('_test');
    return localStorage;
  } catch (e) {
    console.warn('[SUPABASE] localStorage not accessible, using in-memory storage');
    // Fallback to in-memory storage if localStorage fails (iOS WebView issues)
    const memoryStorage: any = {};
    return {
      getItem: (key: string) => memoryStorage[key] || null,
      setItem: (key: string, value: string) => { memoryStorage[key] = value; },
      removeItem: (key: string) => { delete memoryStorage[key]; }
    };
  }
};

// Create a single instance of the Supabase client to avoid multiple instances warning
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getStorage() as any,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'mansa-musa-marketplace@1.0.0',
    },
    fetch: (url, options = {}) => {
      // Increased timeout from 10s to 15s for slower networks on iOS
      // This prevents premature aborts that could cause blank screens
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn('[SUPABASE] Request timeout after 15 seconds:', url);
        controller.abort();
      }, 15000);
      
      console.log('[SUPABASE] Fetch request:', url);
      
      return fetch(url, {
        ...options,
        signal: controller.signal,
      })
        .then(response => {
          console.log('[SUPABASE] Fetch response:', url, 'Status:', response.status);
          return response;
        })
        .catch(error => {
          console.error('[SUPABASE] Fetch error:', url, error);
          throw error;
        })
        .finally(() => clearTimeout(timeoutId));
    },
  },
});
