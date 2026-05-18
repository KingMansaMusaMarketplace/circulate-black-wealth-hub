/**
 * Sentry Error Tracking Initialization
 * 
 * Initializes Sentry as early as possible to catch bootstrap errors.
 * Must be imported and called BEFORE ReactDOM.createRoot in main.tsx.
 */
import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export function initSentry(): void {
  if (!SENTRY_DSN) {
    if (import.meta.env.DEV) {
      console.log('[Sentry] DSN not configured — skipping initialization');
    }
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance monitoring
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
    // Session replay sampling
    replaysSessionSampleRate: import.meta.env.DEV ? 1.0 : 0.05,
    replaysOnErrorSampleRate: 1.0,
    // Environment tagging
    environment: import.meta.env.MODE,
    // Release tracking (use build version from main.tsx)
    release: (window as any).__buildVersion || 'unknown',
    // Ignore common non-actionable errors
    ignoreErrors: [
      'ChunkLoadError',
      'Failed to fetch dynamically imported module',
      'Importing a module script failed',
      'Network Error',
      'network error',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'The operation was aborted',
      'AbortError',
    ],
    // Don't report on localhost in production builds
    beforeSend(event) {
      if (import.meta.env.PROD && window.location.hostname === 'localhost') {
        return null;
      }
      return event;
    },
  });

  if (import.meta.env.DEV) {
    console.log('[Sentry] Initialized with DSN');
  }
}

export { Sentry };
