import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Mirror the Netlify proxy in local dev so /api/trendo_register works.
  server: {
    proxy: {
      '/api/trendo_register': {
        target: 'https://uat.elbrit.org/api/method/trendo_register',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trendo_register/, ''),
      },
    },
  },
})
