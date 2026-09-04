import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'configure-js-mime-type',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.endsWith('.js') || req.url.endsWith('.mjs') || req.url.includes('.js?') || req.url.includes('.ts?'))) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.endsWith('.js') || req.url.endsWith('.mjs') || req.url.includes('.js?'))) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          }
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

