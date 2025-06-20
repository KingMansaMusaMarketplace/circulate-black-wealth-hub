
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './index.css';

// Import providers
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { ThemeProvider } from '@/components/ui/theme-provider';

// Import the main App component
import App from './App';

console.log('main.tsx: Starting application initialization');

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

console.log('main.tsx: QueryClient created');

const rootElement = document.getElementById('root');
console.log('main.tsx: Root element found:', !!rootElement);

if (!rootElement) {
  console.error('main.tsx: Root element not found!');
  throw new Error('Root element not found');
}

try {
  const root = ReactDOM.createRoot(rootElement);
  console.log('main.tsx: React root created');
  
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ThemeProvider>
            <AuthProvider>
              <SubscriptionProvider>
                <Router>
                  <App />
                  <Toaster />
                </Router>
              </SubscriptionProvider>
            </AuthProvider>
          </ThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
  console.log('main.tsx: React app rendered successfully');
} catch (error) {
  console.error('main.tsx: Error rendering React app:', error);
}
