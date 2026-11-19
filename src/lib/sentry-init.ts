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
      // The iPhone/iPad/Android app also runs on "localhost", so only skip real local testing.
      const isApp = window.location.protocol === 'capacitor:' || !!(window as any).Capacitor?.isNativePlatform?.();
      if (import.meta.env.PROD && window.location.hostname === 'localhost' && !isApp) {
        return null;
      }
      return event;
    },
  });

  reportMediaFailures();

  if (import.meta.env.DEV) {
    console.log('[Sentry] Initialized with DSN');
  }
}

const reportedMedia = new Set<string>();

/** Records a video/audio that fails to load or start (once per file), so app-only playback problems show up in Sentry. */
export function reportMediaProblem(kind: 'load' | 'play', src: string, detail: string): void {
  const key = `${kind}:${src}`;
  if (!src || reportedMedia.has(key)) return;
  reportedMedia.add(key);
  Sentry.captureMessage(`Video ${kind === 'load' ? 'failed to load' : 'failed to start'}`, {
    level: 'warning',
    tags: { media_problem: kind, app_shell: window.location.protocol },
    extra: { src, detail },
  });
}

function reportMediaFailures(): void {
  // Media errors do not bubble, so listen in the capture phase.
  document.addEventListener('error', (event) => {
    const el = event.target;
    const media = el instanceof HTMLSourceElement ? el.parentElement : el;
    if (!(media instanceof HTMLMediaElement)) return;
    const src = el instanceof HTMLSourceElement ? el.src : media.currentSrc || media.src;
    reportMediaProblem('load', src, media.error ? `code ${media.error.code} ${media.error.message || ''}`.trim() : 'source error');
  }, true);
}

export { Sentry };
