# Testing & Monitoring - Phase 3

## Overview
This document covers the testing infrastructure and monitoring utilities implemented for the Circulate Black Wealth Hub application.

## ✅ Implemented Features

### 1. Error Boundary System

#### **Components**
- `ErrorBoundary.tsx` - Global error boundary for React components
- `RouteErrorBoundary.tsx` - Route-specific error boundary for React Router
- `error-tracking.ts` - Centralized error logging and tracking

#### **Error Boundary Features**
- **Graceful Error Handling**: Catches JavaScript errors in component tree
- **Custom Fallback UI**: Beautiful error screens instead of white screen
- **Development Mode**: Shows detailed error messages and stack traces in dev
- **Error Context**: Attach user info, route, component name to errors
- **Global Handlers**: Catches unhandled promise rejections and global errors

#### **Usage**
```tsx
// Wrap entire app or specific sections
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

<ErrorBoundary
  onError={(error, errorInfo) => {
    // Optional custom error handler
    console.log('Error caught:', error);
  }}
>
  <YourApp />
</ErrorBoundary>

// Use in routes
import { RouteErrorBoundary } from '@/components/error-boundary/RouteErrorBoundary';

<Route
  path="/some-route"
  element={<SomePage />}
  errorElement={<RouteErrorBoundary />}
/>
```

### 2. Error Tracking System

#### **Features**
- **Centralized Logging**: Single source of truth for all errors
- **Context Tracking**: Attach user, route, component, action metadata
- **Severity Levels**: low, medium, high, critical
- **Local Storage**: Keeps last 100 errors for debugging
- **Service Integration Ready**: Prepared for Sentry, LogRocket integration

#### **Error Tracker API**
```tsx
import { errorTracker, useErrorTracking } from '@/utils/error-tracking';

// Direct usage
errorTracker.logError(
  new Error('Something went wrong'),
  {
    user: { id: userId, email: userEmail },
    route: '/dashboard',
    component: 'DashboardStats',
    action: 'fetch-stats',
  },
  'high' // severity
);

// In React components
const { logError, logWarning, logInfo } = useErrorTracking();

try {
  await fetchData();
} catch (error) {
  logError(error, { component: 'MyComponent' }, 'high');
}

// Wrap async functions
const safeFetch = withErrorTracking(
  fetchBusinessData,
  { component: 'BusinessList', action: 'fetch' }
);
```

### 3. Performance Monitoring

#### **Features**
- **Core Web Vitals**: Automatic LCP, FID, CLS tracking
- **Component Render Time**: Measure render performance
- **Async Operation Timing**: Track API calls, database queries
- **Page Load Metrics**: DNS, TCP, request, response, DOM, load times
- **Rating System**: Automatic "good", "needs-improvement", "poor" ratings

#### **Performance Monitor API**
```tsx
import { performanceMonitor, usePerformanceMonitoring } from '@/utils/performance-monitoring';

// Direct usage
performanceMonitor.recordMetric('API Call: Business List', 234);

// Measure async operations
const data = await performanceMonitor.measureAsync(
  'Fetch Businesses',
  () => supabase.from('businesses').select('*')
);

// In React components
const { recordMetric, measureAsync } = usePerformanceMonitoring();

// Get page load metrics
const metrics = performanceMonitor.getPageLoadMetrics();
console.log('Total page load:', metrics?.total, 'ms');

// Get average for a metric
const avgAPITime = performanceMonitor.getAverageMetric('API Call: Business List');
```

#### **Performance Tracking Hook**
```tsx
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';

const MyComponent = () => {
  const { renderCount, mountTime } = usePerformanceTracking('MyComponent');
  
  // Automatically tracks mount time and render count
  // Warns if component re-renders > 10 times
  
  return <div>Rendered {renderCount} times</div>;
};
```

### 4. Testing Infrastructure

#### **Test Configuration**
- **Vitest** setup with jsdom environment
- **React Testing Library** for component testing
- **Test setup file** with global mocks
- **Path aliases** configured (@/ imports work in tests)
- **Coverage reporting** with v8

#### **Running Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test src/utils/__tests__/mobile-responsive.test.ts
```

#### **Example Test**
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Integration Guide

### Step 1: Wrap App with Error Boundary

```tsx
// src/App.tsx
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {/* Your app */}
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

### Step 2: Add Error Boundaries to Routes

```tsx
import { RouteErrorBoundary } from '@/components/error-boundary/RouteErrorBoundary';

<Route
  path="/dashboard"
  element={<Dashboard />}
  errorElement={<RouteErrorBoundary />}
/>
```

### Step 3: Add Error Tracking to Critical Functions

```tsx
// In API calls
const fetchBusinesses = async () => {
  try {
    const { data, error } = await supabase.from('businesses').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    errorTracker.logError(error, {
      component: 'BusinessDirectory',
      action: 'fetch-businesses',
    }, 'high');
    throw error;
  }
};
```

### Step 4: Add Performance Tracking to Components

```tsx
// In slow/complex components
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';

const ComplexDashboard = () => {
  usePerformanceTracking('ComplexDashboard');
  
  // Your component code
};
```

### Step 5: Monitor Async Operations

```tsx
// Wrap expensive operations
const { measureAsync } = usePerformanceMonitoring();

const loadData = async () => {
  const data = await measureAsync('Load Dashboard Data', async () => {
    const businesses = await fetchBusinesses();
    const analytics = await fetchAnalytics();
    return { businesses, analytics };
  });
};
```

## External Service Integration

### Sentry Integration (Recommended)

```bash
npm install @sentry/react
```

```tsx
// src/utils/sentry-config.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
});

// Update error-tracking.ts to send to Sentry
private sendToService(errorLog: ErrorLog) {
  Sentry.captureException(errorLog.error, {
    level: errorLog.severity,
    tags: {
      component: errorLog.context.component,
      route: errorLog.context.route,
    },
    user: errorLog.context.user,
    extra: errorLog.context.metadata,
  });
}
```

### LogRocket Integration (Optional)

```bash
npm install logrocket
```

```tsx
// src/utils/logrocket-config.ts
import LogRocket from 'logrocket';

LogRocket.init('YOUR_LOGROCKET_APP_ID');

// Identify users
LogRocket.identify(userId, {
  name: userName,
  email: userEmail,
});
```

## Writing Tests

### Component Tests

```tsx
// src/components/MyComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should handle button click', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should display loading state', () => {
    render(<MyComponent isLoading={true} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

### Hook Tests

```tsx
// src/hooks/useMyHook.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMyHook } from './useMyHook';

describe('useMyHook', () => {
  it('should update state correctly', () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.updateValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });
});
```

### Utility Function Tests

```tsx
// src/utils/myUtil.test.ts
import { describe, it, expect } from 'vitest';
import { myUtil } from './myUtil';

describe('myUtil', () => {
  it('should return expected output', () => {
    expect(myUtil('input')).toBe('expected output');
  });
});
```

## Monitoring Best Practices

### 1. Error Tracking
- Always include context (user, route, component, action)
- Use appropriate severity levels
- Don't log expected errors (404s, validation errors)
- Sanitize sensitive data before logging

### 2. Performance Monitoring
- Track critical user journeys (login, checkout, booking)
- Monitor slow components (> 16ms render time)
- Track API call duration
- Monitor Core Web Vitals scores

### 3. Testing
- Test critical user flows
- Test error states and edge cases
- Maintain > 80% code coverage
- Run tests in CI/CD pipeline

## Metrics to Track

### Error Metrics
- Error rate by severity
- Error rate by component/route
- Most common errors
- Time to resolution

### Performance Metrics
- Core Web Vitals (LCP, FID, CLS)
- Page load time
- API response times
- Component render times

### User Experience Metrics
- Error impact on user sessions
- Performance impact on conversions
- Browser/device specific issues

## Next Steps

### Immediate
- [ ] Add ErrorBoundary to App.tsx
- [ ] Add RouteErrorBoundary to all routes
- [ ] Add error tracking to critical API calls
- [ ] Add performance tracking to slow components

### Short-term
- [ ] Write tests for critical components
- [ ] Set up Sentry account
- [ ] Configure LogRocket (optional)
- [ ] Set up CI/CD pipeline with tests

### Long-term
- [ ] Achieve 80%+ test coverage
- [ ] Set up automated performance monitoring
- [ ] Create error/performance dashboards
- [ ] Implement automated alerts

## Resources
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Sentry React SDK](https://docs.sentry.io/platforms/javascript/guides/react/)
- [LogRocket Documentation](https://docs.logrocket.com/)
- [Web Vitals](https://web.dev/vitals/)

---

**Last Updated:** 2025-10-13
**Status:** Phase 3 Complete ✅
