
import { TestResult } from '../types';

export const initialTests: TestResult[] = [
  // Critical Backend & Database Tests
  { name: 'Supabase Connection', status: 'pending', message: '', critical: true },
  { name: 'Database Tables', status: 'pending', message: '', critical: true },
  { name: 'Authentication System', status: 'pending', message: '', critical: true },
  { name: 'User Profiles', status: 'pending', message: '', critical: true },
  { name: 'Business Directory', status: 'pending', message: '', critical: true },
  { name: 'QR Code System', status: 'pending', message: '', critical: true },
  { name: 'Loyalty Points', status: 'pending', message: '', critical: true },
  { name: 'Subscription System', status: 'pending', message: '', critical: true },
  { name: 'Payment Processing', status: 'pending', message: '', critical: true },
  { name: 'Real-time Data Sync', status: 'pending', message: '', critical: true },
  
  // Mobile Deployment Critical Tests
  { name: 'Capacitor Configuration', status: 'pending', message: '', critical: true },
  { name: 'iOS Compatibility', status: 'pending', message: '', critical: true },
  { name: 'Android Compatibility', status: 'pending', message: '', critical: true },
  { name: 'Mobile Navigation', status: 'pending', message: '', critical: true },
  { name: 'Touch Interface', status: 'pending', message: '', critical: true },
  { name: 'Responsive Design', status: 'pending', message: '', critical: true },
  
  // Device Features & Permissions
  { name: 'Camera Permissions', status: 'pending', message: '', critical: false },
  { name: 'Geolocation Services', status: 'pending', message: '', critical: false },
  { name: 'Network Detection', status: 'pending', message: '', critical: false },
  { name: 'Local Storage', status: 'pending', message: '', critical: false },
  { name: 'Push Notifications', status: 'pending', message: '', critical: false },
  { name: 'Offline Functionality', status: 'pending', message: '', critical: false },
  
  // API & External Services
  { name: 'Stripe Integration', status: 'pending', message: '', critical: true },
  { name: 'Edge Functions', status: 'pending', message: '', critical: false },
  { name: 'File Upload System', status: 'pending', message: '', critical: false },
  { name: 'Email System', status: 'pending', message: '', critical: false },
  { name: 'Social Login', status: 'pending', message: '', critical: false },
  
  // Performance & Security
  { name: 'App Bundle Size', status: 'pending', message: '', critical: false },
  { name: 'Load Performance', status: 'pending', message: '', critical: false },
  { name: 'Security Headers', status: 'pending', message: '', critical: false },
  { name: 'HTTPS Configuration', status: 'pending', message: '', critical: false },
];
