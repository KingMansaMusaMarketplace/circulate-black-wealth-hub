
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
    // Bundle optimization settings
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
          
          // Feature chunks
          'auth-pages': [
            './src/pages/LoginPage.tsx',
            './src/pages/SignupPage.tsx',
            './src/pages/AuthPage.tsx'
          ],
          'dashboard-pages': [
            './src/pages/DashboardPage.tsx',
            './src/pages/BusinessDashboardPage.tsx',
            './src/pages/ProfilePage.tsx'
          ],
          'directory-pages': [
            './src/pages/DirectoryPage.tsx',
            './src/pages/EnhancedDirectoryPage.tsx',
            './src/pages/BusinessDetailPage.tsx'
          ],
          
          // Heavy components
          'charts': ['recharts'],
          'qr-code': ['html5-qrcode', 'qrcode'],
          'animations': ['framer-motion'],
          'utils': ['date-fns', 'file-saver']
        },
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '') : 'chunk';
          return `assets/[name]-[hash].js`;
        }
      }
    },
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
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
      'lucide-react'
    ],
    exclude: [
      // Exclude heavy deps that should be loaded on demand
      'html5-qrcode',
      'html2pdf.js',
      'file-saver'
    ]
  }
}));
