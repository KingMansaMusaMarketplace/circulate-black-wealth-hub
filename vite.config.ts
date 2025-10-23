
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
        // Use Vite's default chunking to avoid dependency order issues
        chunkFileNames: `assets/[name]-[hash].js`,
      },
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
