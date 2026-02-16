import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Build version for cache-busting stale service workers
const BUILD_VERSION = '20260216a';

// Version-aware cache clearing: if BUILD_VERSION changed, nuke SW caches and reload once
if (typeof window !== 'undefined') {
  const storedVersion = localStorage.getItem('app_build_version');
  if (storedVersion && storedVersion !== BUILD_VERSION) {
    // Version mismatch — clear everything and reload
    localStorage.setItem('app_build_version', BUILD_VERSION);
    (async () => {
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map(r => r.unregister()));
        }
      } catch {}
      window.location.reload();
    })();
    // Stop further execution — page will reload
    throw new Error('App version changed, reloading');
  }
  localStorage.setItem('app_build_version', BUILD_VERSION);
}

console.log('[MAIN] Script loaded at', new Date().toISOString());
console.log('[MAIN] User Agent:', navigator.userAgent);

// Detect iPad specifically (including iPadOS 13+ which reports as Mac)
const isIPad = /iPad/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || isIPad;

console.log('[MAIN] Platform detection - iOS:', isIOS, 'iPad:', isIPad);

// Global chunk error recovery: force-refresh with cache-buster or send to /refresh
if (typeof window !== 'undefined') {
  console.log('[MAIN] Setting up error handlers');
  
  const forceReload = () => {
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('v')) url.searchParams.set('v', '4');
      window.location.replace(url.toString());
    } catch {
      window.location.reload();
    }
  };

  // CRITICAL: Prevent unhandled promise rejections from crashing the app on iOS/iPad
  window.addEventListener('unhandledrejection', (e) => {
    const reason = (e && (e as any).reason) as any;
    const text = reason?.message || (typeof reason === 'string' ? reason : reason?.toString?.()) || '';
    
    console.error('[MAIN] Unhandled rejection:', text);
    
    // Prevent the default behavior which can cause white screen on iOS
    e.preventDefault();
    
    // Only reload for chunk/module loading errors
    if (text.includes('ChunkLoadError') || 
        text.includes('Failed to fetch dynamically imported module') || 
        text.includes('Importing a module script failed')) {
      console.log('[MAIN] Chunk error detected, will reload');
      forceReload();
    }
    
    // For other unhandled rejections, log but don't crash
    // This prevents the app from crashing when async operations fail
    console.warn('[MAIN] Prevented app crash from unhandled rejection');
  });

  // CRITICAL: Prevent errors from crashing the app on iOS/iPad
  window.addEventListener('error', (e) => {
    const msg = (e?.message || '').toString();
    
    console.error('[MAIN] Global error:', msg);
    
    // Prevent the default behavior
    e.preventDefault();
    
    if (msg.includes('ChunkLoadError') || 
        msg.includes('Loading chunk') || 
        msg.includes('Failed to fetch dynamically imported module')) {
      console.log('[MAIN] Chunk error detected, will reload');
      forceReload();
    }
  });
}

console.log('[MAIN] Getting root element');
const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error('[MAIN] FATAL: root element not found!');
  // On iOS/iPad, show a visible error instead of just throwing
  document.body.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#1B365D;color:white;text-align:center;padding:20px;">
      <div>
        <h1 style="font-size:24px;margin-bottom:16px;">App Loading Error</h1>
        <p style="margin-bottom:16px;">Unable to start the application.</p>
        <button onclick="location.reload()" style="padding:12px 24px;background:#D4AF37;color:#1B365D;border:none;border-radius:8px;font-weight:600;cursor:pointer;">
          Reload App
        </button>
      </div>
    </div>
  `;
  throw new Error('Root element not found');
}

console.log('[MAIN] Creating React root');
const root = ReactDOM.createRoot(rootEl);

// Keep boot fallback visible; React or a readiness event will hide it
console.log('[MAIN] Preserving boot fallback until app is ready');

// Ensure boot fallback overlay is hidden once React mounts
if (typeof window !== 'undefined') {
  (window as any).__reactMounted = true;
  console.log('[MAIN] Set __reactMounted flag');
}

console.log('[MAIN] Rendering App component');
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('[MAIN] App render initiated successfully');
} catch (err) {
  console.error('[MAIN] FATAL: Failed to render App:', err);
  // On iOS/iPad, show a visible error instead of white screen
  rootEl.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#1B365D;color:white;text-align:center;padding:20px;">
      <div>
        <h1 style="font-size:24px;margin-bottom:16px;">App Error</h1>
        <p style="margin-bottom:16px;">Something went wrong during startup.</p>
        <button onclick="location.reload()" style="padding:12px 24px;background:#D4AF37;color:#1B365D;border:none;border-radius:8px;font-weight:600;cursor:pointer;">
          Reload App
        </button>
      </div>
    </div>
  `;
  throw err;
}

// Defer hiding boot fallback until the app signals readiness or after a timeout safety
(function() {
  const hideFallback = () => {
    const el = document.getElementById('boot-fallback');
    if (el) {
      el.style.display = 'none';
      console.log('[MAIN] Boot fallback hidden');
    }
  };
  window.addEventListener('app:ready', hideFallback, { once: true });
  setTimeout(hideFallback, 12000);
})();
