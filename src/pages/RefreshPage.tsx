import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const RefreshPage: React.FC = () => {
  const [status, setStatus] = useState('Refreshing site…');

  useEffect(() => {
    (async () => {
      try {
        setStatus('Clearing caches…');
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }

        setStatus('Unregistering service workers…');
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }

        setStatus('Clearing local storage…');
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch {}
      } catch {}

      // Redirect back to home with cache-buster
      const url = new URL(window.location.href);
      url.pathname = '/';
      url.searchParams.set('v', '4');
      setStatus('Reloading…');
      window.location.replace(url.toString());
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>Force Refresh | 1325.ai</title>
        <meta name="description" content="Clear cache and refresh the 1325.ai app." />
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