
import { RouteTest } from './types';

export const allRoutes: RouteTest[] = [
  { path: '/', name: 'Home Page', status: 'pending', message: 'Testing home page' },
  { path: '/directory', name: 'Directory Page', status: 'pending', message: 'Testing business directory' },
  { path: '/login', name: 'Login Page', status: 'pending', message: 'Testing login functionality' },
  { path: '/signup', name: 'Signup Page', status: 'pending', message: 'Testing signup functionality' },
  { path: '/dashboard', name: 'Dashboard Page', status: 'pending', message: 'Testing dashboard', requiresAuth: true },
  { path: '/scanner', name: 'QR Scanner Page', status: 'pending', message: 'Testing QR scanner' },
  { path: '/loyalty', name: 'Loyalty Page', status: 'pending', message: 'Testing loyalty system' },
  { path: '/business-form', name: 'Business Form Page', status: 'pending', message: 'Testing business registration' },
  { path: '/sponsorship', name: 'Sponsorship Page', status: 'pending', message: 'Testing corporate sponsorship' },
  { path: '/corporate-sponsorship', name: 'Corporate Sponsorship Page', status: 'pending', message: 'Testing corporate sponsorship (alt route)' },
  { path: '/community-impact', name: 'Community Impact Page', status: 'pending', message: 'Testing community impact' },
  { path: '/system-test', name: 'System Test Page', status: 'pending', message: 'Testing system diagnostics' },
  { path: '/mobile-test', name: 'Mobile Test Page', status: 'pending', message: 'Testing mobile features' },
  { path: '/comprehensive-test', name: 'Comprehensive Test Page', status: 'pending', message: 'Testing comprehensive diagnostics' },
  { path: '/signup-test', name: 'Signup Test Page', status: 'pending', message: 'Testing signup validation' },
  { path: '/new-password', name: 'New Password Page', status: 'pending', message: 'Testing password reset' },
  { path: '/password-reset-request', name: 'Password Reset Request Page', status: 'pending', message: 'Testing password reset request' },
  { path: '/mobile-readiness-test', name: 'Mobile Readiness Test Page', status: 'pending', message: 'Testing mobile readiness' },
  { path: '/app-test', name: 'App Test Page', status: 'pending', message: 'Testing app functionality (current page)' }
];
