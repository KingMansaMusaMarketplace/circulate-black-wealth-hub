import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const RefreshPage: React.FC = () => {
  const [status, setStatus] = useState('Refreshing site…');

  useEffect(() => {
    (async () => {
      try {
        // 1. Unregister ALL service workers first
        setStatus('Unregistering service workers…');
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }

        // 2. Delete ALL Cache API entries
        setStatus('Clearing caches…');
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }

        // 3. Clear all storage
        setStatus('Clearing storage…');
        try { localStorage.clear(); } catch {}
        try { sessionStorage.clear(); } catch {}

        // 4. Clear ALL IndexedDB databases (React Query, Supabase, etc.)
        setStatus('Clearing databases…');
        if ('indexedDB' in window && indexedDB.databases) {
          try {
            const dbs = await indexedDB.databases();
            await Promise.all(
              dbs.map((db) => {
                if (db.name) {
                  return new Promise<void>((resolve) => {
                    const req = indexedDB.deleteDatabase(db.name!);
                    req.onsuccess = () => resolve();
                    req.onerror = () => resolve();
                    req.onblocked = () => resolve();
                  });
                }
                return Promise.resolve();
              })
            );
          } catch {}
        }

        // 5. Clear cookies for this domain
        setStatus('Clearing cookies…');
        try {
          document.cookie.split(';').forEach((c) => {
            const name = c.split('=')[0].trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          });
        } catch {}

      } catch (e) {
        console.error('Refresh cleanup error:', e);
      }

      // 6. Hard redirect with cache-buster
      setStatus('Reloading…');
      const dest = window.location.origin + '/?v=' + Date.now();
      window.location.replace(dest);
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>Force Refresh | 1325.AI</title>
        <meta name="description" content="Clear cache and refresh the 1325.AI app." />
        <link rel="canonical" href="https://1325.ai/refresh" />
      </Helmet>
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansablue mx-auto"></div>
          <p className="text-gray-600">{status}</p>
          <p className="text-xs text-gray-500">If it doesn't redirect, go to https://1325.ai?v=4</p>
        </div>
      </main>
    </>
  );
};

export default RefreshPage;