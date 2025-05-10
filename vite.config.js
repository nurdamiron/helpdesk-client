// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log('Vite build mode:', mode);
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5002',
          changeOrigin: true,
          secure: false
        },
        '/health': {
          target: 'http://localhost:5002',
          changeOrigin: true,
          secure: false
        },
        '/ws': {
          target: 'ws://localhost:5002',
          ws: true,
          changeOrigin: true,
          secure: false
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // Build optimization
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom'],
            'material-ui': ['@mui/material', '@mui/icons-material'],
          },
        },
      },
      // Only minify in production
      minify: mode === 'production' ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
    },
  };
});