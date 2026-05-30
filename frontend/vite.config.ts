import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// FIX: removido o bloco "define" que sobrescrevia import.meta.env incorretamente.
// Vite já lida nativamente com VITE_* vars via import.meta.env.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
