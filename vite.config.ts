
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' ? componentTagger() : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'safari14',
    modulePreload: {
      polyfill: true,
    },
    // Bundle optimization settings
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React ecosystem - include framer-motion with React to ensure proper dependency sharing
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('framer-motion')) {
              return 'vendor-react';
            }
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            // React Query
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // Mapbox - split separately from directory pages
            if (id.includes('mapbox-gl')) {
              return 'vendor-mapbox';
            }
            // Charts
            if (id.includes('recharts')) {
              return 'charts';
            }
            // QR Code libraries
            if (id.includes('html5-qrcode') || id.includes('qrcode')) {
              return 'qr-code';
            }
            // PDF generation
            if (id.includes('html2pdf') || id.includes('jspdf')) {
              return 'pdf-generation';
            }
            // Date utilities
            if (id.includes('date-fns')) {
              return 'utils-date';
            }
            // File handling
            if (id.includes('file-saver')) {
              return 'utils-file';
            }
          }
          
          // Split directory pages individually instead of bundling together
          if (id.includes('src/pages/DirectoryPage.tsx')) {
            return 'page-directory-basic';
          }
          if (id.includes('src/pages/EnhancedDirectoryPage.tsx')) {
            return 'page-directory-enhanced';
          }
          if (id.includes('src/pages/BusinessDetailPage.tsx')) {
            return 'page-business-detail';
          }
          
          // Auth pages
          if (id.includes('src/pages/LoginPage.tsx') || 
              id.includes('src/pages/SignupPage.tsx') || 
              id.includes('src/pages/AuthPage.tsx')) {
            return 'auth-pages';
          }
          
          // Dashboard pages
          if (id.includes('src/pages/DashboardPage.tsx') || 
              id.includes('src/pages/BusinessDashboardPage.tsx') || 
              id.includes('src/pages/ProfilePage.tsx')) {
            return 'dashboard-pages';
          }
          
          // Map components - lazy load these
          if (id.includes('src/components/MapView')) {
            return 'component-map';
          }
        },
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '') : 'chunk';
          return `assets/[name]-[hash].js`;
        }
      }
    },
    // Optimize bundle size - only enable terser in production
    minify: mode === 'production' ? 'terser' : false,
    ...(mode === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    }),
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps in development
    sourcemap: mode === 'development',
  },
  // CSS optimization
  css: {
    devSourcemap: mode === 'development',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
      'framer-motion'
    ],
    exclude: [
      // Exclude heavy deps that should be loaded on demand
      'html5-qrcode',
      'html2pdf.js',
      'file-saver'
    ],
    esbuildOptions: {
      target: 'safari14'
    }
  }
}));
