
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
    // PWA Plugin for offline support
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'app-icon-source.png', 'robots.txt'],
      manifest: false, // Use existing manifest.json
      workbox: {
        // Cache strategies for different asset types
        runtimeCaching: [
          {
            // Cache loyalty card data for offline access
            urlPattern: /^https:\/\/agoclnqfyinwjxdmjnns\.supabase\.co\/rest\/v1\/loyalty_points/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'loyalty-data-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache user profile for offline access
            urlPattern: /^https:\/\/agoclnqfyinwjxdmjnns\.supabase\.co\/rest\/v1\/profiles/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'profile-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            // Cache business data for offline directory
            urlPattern: /^https:\/\/agoclnqfyinwjxdmjnns\.supabase\.co\/rest\/v1\/businesses/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'businesses-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
          {
            // Cache images from Supabase storage
            urlPattern: /^https:\/\/agoclnqfyinwjxdmjnns\.supabase\.co\/storage/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
        // Skip waiting for immediate activation
        skipWaiting: true,
        clientsClaim: true,
        // Automatically remove old precache entries on new SW activation
        cleanupOutdatedCaches: true,
        // Don't cache index.html aggressively
        navigateFallback: null,
      },
      devOptions: {
        enabled: false, // Disable in development to avoid confusion
      },
    }),
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
          // Split admin modules into separate chunks
          'admin-heavy': [
            'recharts',
            'jspdf',
            'jspdf-autotable',
            'html2canvas',
            'html2pdf.js',
          ],
          // i18n in its own chunk
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // Mapbox in its own chunk (heavy)
          'maps': ['mapbox-gl'],
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
      '@radix-ui/react-progress'
    ],
    exclude: [
      // Exclude heavy deps that should be loaded on demand
      'html5-qrcode',
      'html2pdf.js',
      'file-saver',
      'recharts', // Heavy charting library
    ],
    esbuildOptions: {
      target: 'safari14'
    }
  }
}));
