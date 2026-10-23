import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_URL || 'http://localhost:8000'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, 'src') },
    },
    server: {
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true, secure: true },
        '/magical-towns': { target: apiTarget, changeOrigin: true, secure: true },
        '/places': { target: apiTarget, changeOrigin: true, secure: true },
        '/categories': { target: apiTarget, changeOrigin: true, secure: true },
        '/place-types': { target: apiTarget, changeOrigin: true, secure: true },
        '/place-images': { target: apiTarget, changeOrigin: true, secure: true },
        '/uploads': { target: apiTarget, changeOrigin: true, secure: true },
        '/badges': { target: apiTarget, changeOrigin: true, secure: true },
        '/challenges': { target: apiTarget, changeOrigin: true, secure: true },
        '/categories': { target: apiTarget, changeOrigin: true, secure: true },
      },
    },
  }
})
