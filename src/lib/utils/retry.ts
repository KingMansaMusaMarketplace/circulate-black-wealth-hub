/**
 * Retry utility with exponential backoff for API calls
 * Use this for wrapping individual async operations that need retry logic
 */

interface RetryOptions {
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Initial delay in milliseconds (doubles each retry) */
  initialDelay?: number;
  /** Maximum delay between retries */
  maxDelay?: number;
  /** Jitter factor (0-1) to randomize delays */
  jitter?: number;
  /** Function to determine if error is retryable */
  isRetryable?: (error: Error) => boolean;
  /** Called before each retry */
  onRetry?: (error: Error, attempt: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  jitter: 0.1,
  isRetryable: (error) => {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('failed to fetch') ||
      message.includes('429') ||
      message.includes('503') ||
      message.includes('502') ||
      message.includes('econnreset')
    );
  },
  onRetry: () => {},
};

/**
 * Calculate delay with exponential backoff and optional jitter
 */
function calculateDelay(attempt: number, options: Required<RetryOptions>): number {
  const exponentialDelay = options.initialDelay * Math.pow(2, attempt);
  const cappedDelay = Math.min(exponentialDelay, options.maxDelay);
  
  if (options.jitter > 0) {
    const jitterRange = cappedDelay * options.jitter;
    const jitterValue = Math.random() * jitterRange * 2 - jitterRange;
    return Math.max(0, cappedDelay + jitterValue);
  }
  
  return cappedDelay;
}

/**
 * Sleep utility
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry an async function with exponential backoff
 * 
 * @example
 * const result = await withRetry(
 *   () => fetch('/api/data').then(r => r.json()),
 *   { maxRetries: 3, initialDelay: 1000 }
 * );
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      const isLastAttempt = attempt === opts.maxRetries;
      const shouldRetry = !isLastAttempt && opts.isRetryable(lastError);
      
      if (!shouldRetry) {
        throw lastError;
      }
      
      const delay = calculateDelay(attempt, opts);
      console.log(`[Retry] Attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms:`, lastError.message);
      
      opts.onRetry(lastError, attempt + 1);
      await sleep(delay);
    }
  }
  
  throw lastError;
}

/**
 * Retry with timeout - combines retry logic with overall timeout
 * 
 * @example
 * const result = await withRetryAndTimeout(
 *   () => fetchData(),
 *   { timeout: 30000, maxRetries: 3 }
 * );
 */
export async function withRetryAndTimeout<T>(
  fn: () => Promise<T>,
  options: RetryOptions & { timeout?: number } = {}
): Promise<T> {
  const { timeout = 30000, ...retryOptions } = options;
  
  return Promise.race([
    withRetry(fn, retryOptions),
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeout}ms`));
      }, timeout);
    }),
  ]);
}

/**
 * Circuit breaker pattern - stops retrying after too many failures
 */
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private readonly threshold: number = 5,
    private readonly resetTimeout: number = 60000
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit should reset
    if (this.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure >= this.resetTimeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open - too many recent failures');
      }
    }
    
    try {
      const result = await fn();
      
      // Success - reset or close circuit
      if (this.state === 'half-open') {
        this.state = 'closed';
        this.failures = 0;
      }
      
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();
      
      if (this.failures >= this.threshold) {
        this.state = 'open';
        console.warn('[CircuitBreaker] Circuit opened after', this.failures, 'failures');
      }
      
      throw error;
    }
  }
  
  reset() {
    this.failures = 0;
    this.state = 'closed';
  }
  
  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

// Export a default circuit breaker instance for shared use
export const apiCircuitBreaker = new CircuitBreaker();

export { CircuitBreaker };
