
import { TestResult } from '../types';

export const initialTests: TestResult[] = [
  // Database & Backend Tests
  { name: 'Supabase Connection', status: 'pending', message: '', critical: true },
  { name: 'Database Tables', status: 'pending', message: '', critical: true },
  { name: 'Authentication System', status: 'pending', message: '', critical: true },
  { name: 'User Profiles', status: 'pending', message: '', critical: true },
  { name: 'Business Directory', status: 'pending', message: '', critical: true },
  { name: 'QR Code System', status: 'pending', message: '', critical: true },
  { name: 'Loyalty Points', status: 'pending', message: '', critical: true },
  { name: 'Subscription System', status: 'pending', message: '', critical: true },
  
  // Mobile Compatibility Tests
  { name: 'Capacitor Configuration', status: 'pending', message: '', critical: true },
  { name: 'Camera Permissions', status: 'pending', message: '', critical: false },
  { name: 'Geolocation Services', status: 'pending', message: '', critical: false },
  { name: 'Network Detection', status: 'pending', message: '', critical: false },
  { name: 'Touch Interface', status: 'pending', message: '', critical: false },
  { name: 'Responsive Design', status: 'pending', message: '', critical: false },
  
  // API & External Services
  { name: 'Stripe Integration', status: 'pending', message: '', critical: true },
  { name: 'Edge Functions', status: 'pending', message: '', critical: false },
  { name: 'File Upload System', status: 'pending', message: '', critical: false },
  { name: 'Email System', status: 'pending', message: '', critical: false },
];
