
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
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove the initial static loader injected in index.html after React mounts
const killInitialLoader = () => {
  const loader = document.querySelector('.initial-loader') as HTMLElement | null;
  if (loader && loader.parentElement) {
    try { loader.parentElement.removeChild(loader); } catch {}
  }
};

// Try immediately after paint and once more shortly after to be safe
requestAnimationFrame(killInitialLoader);
setTimeout(killInitialLoader, 0);
setTimeout(killInitialLoader, 600);

