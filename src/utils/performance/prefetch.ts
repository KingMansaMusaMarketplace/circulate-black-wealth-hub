/**
 * Prefetch routes for faster navigation
 */
export const prefetchRoute = (path: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'document';
  link.href = path;
  document.head.appendChild(link);
};

/**
 * Preconnect to external domains
 */
export const preconnectDomain = (domain: string) => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = domain;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

/**
 * DNS prefetch for external domains
 */
export const dnsPrefetch = (domain: string) => {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = domain;
  document.head.appendChild(link);
};

/**
 * Prefetch common routes on idle
 */
export const prefetchCommonRoutes = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      prefetchRoute('/directory');
      prefetchRoute('/about');
      prefetchRoute('/loyalty');
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      prefetchRoute('/directory');
      prefetchRoute('/about');
      prefetchRoute('/loyalty');
    }, 1000);
  }
};
