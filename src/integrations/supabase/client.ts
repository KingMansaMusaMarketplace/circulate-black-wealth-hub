
import { createClient } from '@supabase/supabase-js';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const supabaseUrl = 'https://agoclnqfyinwjxdmjnns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ';

// Storage adapter that uses Capacitor Preferences for native apps (iOS/Android)
// This fixes auth persistence issues on iOS where localStorage may not work reliably
const getStorage = () => {
  const isNative = Capacitor.isNativePlatform();
  
  if (isNative) {
    console.log('[SUPABASE] Using Capacitor Preferences for native app storage');
    return {
      getItem: async (key: string) => {
        const { value } = await Preferences.get({ key });
        return value;
      },
      setItem: async (key: string, value: string) => {
        await Preferences.set({ key, value });
      },
      removeItem: async (key: string) => {
        await Preferences.remove({ key });
      }
    };
  }
  
  // For web, use localStorage
  try {
    localStorage.setItem('_test', '1');
    localStorage.removeItem('_test');
    console.log('[SUPABASE] Using localStorage for web storage');
    return localStorage;
  } catch (e) {
    console.error('[SUPABASE] localStorage not accessible, auth will not persist');
    // Last resort fallback - this will lose session on page refresh
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
