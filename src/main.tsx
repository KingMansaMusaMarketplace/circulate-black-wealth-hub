import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

console.log('[MAIN] Script loaded at', new Date().toISOString());

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

  window.addEventListener('error', (e) => {
    const msg = (e?.message || '').toString();
    if (msg.includes('ChunkLoadError') || msg.includes('Loading chunk') || msg.includes('Failed to fetch dynamically imported module')) {
      forceReload();
    }
  });

  window.addEventListener('unhandledrejection', (e) => {
    const reason = (e && (e as any).reason) as any;
    const text = reason?.message || (typeof reason === 'string' ? reason : reason?.toString?.()) || '';
    if (text.includes('ChunkLoadError') || text.includes('Failed to fetch dynamically imported module') || text.includes('Importing a module script failed')) {
      forceReload();
    }
  });
}

console.log('[MAIN] Getting root element');
const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error('[MAIN] FATAL: root element not found!');
  throw new Error('Root element not found');
}

console.log('[MAIN] Creating React root');
const root = ReactDOM.createRoot(rootEl);

// Hide boot fallback immediately when React starts mounting
const fb = document.getElementById('boot-fallback');
if (fb) {
  console.log('[MAIN] Hiding boot fallback');
  fb.style.display = 'none';
}

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
  throw err;
}

// After first paint, hide any lingering boot fallback just in case
requestAnimationFrame(() => {
  const fb = document.getElementById('boot-fallback');
  if (fb) fb.style.display = 'none';
});
