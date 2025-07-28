// Vite configuration optimizations for bundle splitting and performance

export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-tabs',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-toast'
          ],
          'supabase-vendor': ['@supabase/supabase-js'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'icons-vendor': ['lucide-react'],
          
          // Feature chunks  
          'auth-features': [
            'src/components/auth',
            'src/contexts/AuthContext',
            'src/lib/auth'
          ],
          'business-features': [
            'src/components/business',
            'src/pages/business-dashboard'
          ],
          'testing-features': [
            'src/components/testing',
            'src/components/performance'
          ],
          'qr-features': [
            'src/components/qr-scanner',
            'html5-qrcode'
          ],
          'charts-features': [
            'recharts',
            'src/components/charts'
          ]
        }
      },
      
      // External dependencies (CDN)
      external: [
        // Consider externalizing heavy libraries to CDN
      ]
    },
    
    // Optimization settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'], // Remove specific console methods
      },
      mangle: {
        safari10: true,
      },
    },
    
    // Code splitting
    chunkSizeWarningLimit: 1000, // Warn for chunks > 1MB
    
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets < 4KB
    
    // Source maps for production debugging (disable for smaller bundles)
    sourcemap: false,
    
    // Target modern browsers for smaller output
    target: 'es2020'
  },
  
  // Development optimizations
  server: {
    hmr: {
      overlay: false // Disable error overlay for better performance
    }
  },
  
  // Dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react'
    ],
    exclude: [
      // Exclude heavy dependencies that should be lazy loaded
      'html5-qrcode',
      'recharts'
    ]
  }
};