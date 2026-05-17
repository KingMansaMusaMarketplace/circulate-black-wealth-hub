/**
 * Dev-only logger. Use instead of console.log for new code.
 *
 * In production:
 * - log / info / debug are no-ops AND stripped by terser (vite.config.ts drop_console)
 * - warn / error always pass through so real issues surface in Sentry/analytics
 *
 * Existing console.log calls in the codebase are already stripped in production
 * builds via vite.config.ts `terserOptions.drop_console: true`. This logger is
 * preferred for new code so dev logs stay readable while prod stays silent.
 */
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => { if (isDev) console.log(...args); },
  info: (...args: unknown[]) => { if (isDev) console.info(...args); },
  debug: (...args: unknown[]) => { if (isDev) console.debug(...args); },
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.error(...args),
};
