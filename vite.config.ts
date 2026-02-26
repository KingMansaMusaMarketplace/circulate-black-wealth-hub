
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

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
    // PWA plugin DISABLED - was causing stale cached assets ("old version" bug)
    // VitePWA removed to prevent service worker from serving outdated bundles
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Force single React instance - critical for hooks to work
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  build: {
    target: 'safari14',
    modulePreload: {
      polyfill: true,
    },
    // Bundle optimization settings
    rollupOptions: {
      output: {
        chunkFileNames: `assets/[name]-[hash].js`,
        manualChunks: {
          // Ensure React is always in vendor chunk with all lazy-loaded components
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'query-vendor': ['@tanstack/react-query'],
          'supabase': ['@supabase/supabase-js'],
          // Charts in their own chunk (loaded on-demand via route-level lazy loading)
          'charts': ['recharts'],
          // PDF/export tools in their own chunk
          'admin-heavy': [
            'jspdf',
            'jspdf-autotable',
            'html2canvas',
            'html2pdf.js',
          ],
          // i18n in its own chunk
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // Mapbox in its own chunk (heavy, loaded on-demand)
          'maps': ['mapbox-gl'],
          // Framer Motion in its own cacheable chunk
          'animation': ['framer-motion'],
        },
      },
    },
    // Optimize bundle size - only enable terser in production
    minify: mode === 'production' ? 'terser' : false,
    ...(mode === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
        },
        mangle: {
          safari10: true,
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
  // Optimize dependencies - Ensure React is pre-bundled together
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      'lodash',
    ],
    exclude: [
      // Exclude heavy deps that should be loaded on demand
      'html5-qrcode',
      'html2pdf.js',
      'file-saver',
    ],
    esbuildOptions: {
      target: 'safari14'
    }
  }
}));
