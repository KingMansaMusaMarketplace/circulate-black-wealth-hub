
import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
// This allows key rotation without code changes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.');
}

// Check if running on native platform without throwing errors
const isNativePlatform = () => {
  try {
    return typeof window !== 'undefined' && 
           window.Capacitor && 
           typeof window.Capacitor.isNativePlatform === 'function' && 
           window.Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

// Detect iOS device
const isIOSDevice = () => {
  try {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  } catch {
    return false;
  }
};

// Storage adapter with iOS-safe fallback
// CRITICAL: On iOS WKWebView, localStorage can be restricted
const getStorage = () => {
  // Try localStorage first (works on web and most native)
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    console.log('[SUPABASE] Using localStorage');
    return localStorage;
  } catch (e) {
    console.warn('[SUPABASE] localStorage not available, using memory storage');
  }
  
  // Fallback to memory storage (auth won't persist but app will work)
  console.log('[SUPABASE] Using memory storage fallback');
  const memoryStorage: Record<string, string> = {};
  return {
    getItem: (key: string) => memoryStorage[key] || null,
    setItem: (key: string, value: string) => { memoryStorage[key] = value; },
    removeItem: (key: string) => { delete memoryStorage[key]; }
  };
};

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getStorage() as any,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: !isNativePlatform(), // Disable URL detection on native
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'mansa-musa-marketplace@1.1.0',
    },
    fetch: (url, options = {}) => {
      // CRITICAL: Shorter timeout on iOS (8s) vs web (15s)
      // iOS WKWebView can hang on slow connections
      const timeoutMs = isIOSDevice() ? 8000 : 15000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn('[SUPABASE] Request timeout after', timeoutMs, 'ms:', url);
        controller.abort();
      }, timeoutMs);
      
      console.log('[SUPABASE] Fetch:', url.toString().substring(0, 80));
      
      return fetch(url, {
        ...options,
        signal: controller.signal,
      })
        .then(response => {
          console.log('[SUPABASE] Response:', response.status, url.toString().substring(0, 50));
          return response;
        })
        .catch(error => {
          // Don't throw on abort - just log and continue
          if (error.name === 'AbortError') {
            console.warn('[SUPABASE] Request aborted:', url.toString().substring(0, 50));
          } else {
            console.error('[SUPABASE] Fetch error:', error);
          }
          throw error;
        })
        .finally(() => clearTimeout(timeoutId));
    },
  },
});
