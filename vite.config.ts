import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '/api'),
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        chunkSizeWarningLimit: 1000, // Increase limit to 1000kB
        assetsInlineLimit: 4096, // Inline small assets
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // Vendor chunks
              if (id.includes('node_modules/react')) {
                return 'vendor-react';
              }
              if (id.includes('node_modules/firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('node_modules/@google')) {
                return 'vendor-google';
              }
              if (id.includes('node_modules/three')) {
                return 'vendor-three';
              }
              if (id.includes('node_modules/gsap')) {
                return 'vendor-gsap';
              }
              if (id.includes('node_modules/leaflet')) {
                return 'vendor-leaflet';
              }
              
              // Component chunks
              if (id.includes('components/AuthView') || id.includes('components/ui/sign')) {
                return 'components-auth';
              }
              if (id.includes('components/Onboarding') || id.includes('components/IntentSelection')) {
                return 'components-onboarding';
              }
              if (id.includes('components/RecommendationView') || id.includes('components/DestinationCard') || id.includes('RecommendationEngine')) {
                return 'components-recommendations';
              }
              if (id.includes('components/DestinationOptimizer')) {
                return 'components-optimizer';
              }
              
              // Services
              if (id.includes('services/')) {
                return 'services';
              }
            }
          }
        }
      }
    };
});
