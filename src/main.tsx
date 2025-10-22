
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global chunk error recovery: force-refresh with cache-buster or send to /refresh
if (typeof window !== 'undefined') {
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

const rootEl = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootEl);

// Hide boot fallback immediately when React starts mounting
const fb = document.getElementById('boot-fallback');
if (fb) fb.style.display = 'none';

// Ensure boot fallback overlay is hidden once React mounts
if (typeof window !== 'undefined') {
  (window as any).__reactMounted = true;
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// After first paint, hide any lingering boot fallback just in case
requestAnimationFrame(() => {
  const fb = document.getElementById('boot-fallback');
  if (fb) fb.style.display = 'none';
});
