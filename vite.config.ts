import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Mirror the Netlify proxy in local dev so /api/trendo_register works.
  server: {
    proxy: {
      '/api/forms_pro_submit': {
        target: 'https://uat.elbrit.org/api/method/forms_pro.api.submission.submit_form_response',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/forms_pro_submit/, ''),
      },
      '/api/trendo_register': {
        target: 'https://uat.elbrit.org/api/method/trendo_register',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trendo_register/, ''),
      },
    },
  },
})
