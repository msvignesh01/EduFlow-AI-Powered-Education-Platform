import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {

          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],


          'ui-vendor': ['lucide-react'],
          'animation-vendor': ['framer-motion'],


          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'ai-vendor': ['@google/generative-ai'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});